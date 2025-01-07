package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/julienschmidt/httprouter"
	"github.com/mnabil1718/blog.mnabil.dev/internal/config"
	"github.com/mnabil1718/blog.mnabil.dev/internal/utils"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

func openDB(cfg config.Config) (*sql.DB, error) {
	db, err := sql.Open("pgx", cfg.DB.DSN)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(cfg.DB.MaxOpenConns)
	db.SetMaxIdleConns(cfg.DB.MaxIdleConns)
	duration, err := time.ParseDuration(cfg.DB.MaxIdleTime) // "15m" or "5s"
	if err != nil {
		return nil, err
	}
	db.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		return nil, err
	}

	return db, nil
}

func (app *application) getIdFromRequestContext(request *http.Request) (int64, error) {
	params := httprouter.ParamsFromContext(request.Context())
	id, err := strconv.ParseInt(params.ByName("id"), 10, 64) // int64
	if err != nil || id < 1 {
		return 0, errors.New("invalid id")
	}

	return id, nil
}

func (app *application) getStatusFromRequestContext(request *http.Request) string {
	params := httprouter.ParamsFromContext(request.Context())
	return params.ByName("id")
}

func (app *application) getImageNameFromRequestContext(request *http.Request) (string, error) {
	params := httprouter.ParamsFromContext(request.Context())
	name := params.ByName("name")

	err := utils.ValidateImageName(name)
	if err != nil {
		return "", err
	}

	return name, nil
}

type envelope map[string]interface{}

func (app *application) writeJSON(writer http.ResponseWriter, code int, data envelope, headers http.Header) error {
	resp, err := json.Marshal(data)
	if err != nil {
		return err
	}

	resp = append(resp, '\n')

	for key, value := range headers {
		writer.Header()[key] = value
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(code)
	writer.Write(resp)

	return nil
}

func (app *application) readJSON(writer http.ResponseWriter, request *http.Request, destination any) error {
	// Use http.MaxBytesReader() to limit the size of the request body to 1MB.
	maxBytes := 1_048_576
	request.Body = http.MaxBytesReader(writer, request.Body, int64(maxBytes))

	dec := json.NewDecoder(request.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(destination) // receiver must be a pointer
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError
		var invalidUnmarshalError *json.InvalidUnmarshalError

		switch {
		case errors.As(err, &syntaxError):
			return fmt.Errorf("body contains badly-formed JSON (at character %d)", syntaxError.Offset)

		case errors.Is(err, io.ErrUnexpectedEOF):
			return errors.New("body contains badly-formed JSON")

		case errors.As(err, &unmarshalTypeError):
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON type for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d)", unmarshalTypeError.Offset)

		case errors.Is(err, io.EOF):
			return errors.New("body must not be empty")

		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
			return fmt.Errorf("body contains unknown key %s", fieldName)

		case err.Error() == "http: request body too large":
			return fmt.Errorf("body must not be larger than %d bytes", maxBytes)

		case errors.As(err, &invalidUnmarshalError):
			panic(err)
		default:
			return err
		}
	}

	// ensure theres nothing left in the decoder stream
	// if there is, meaning client send more than one JSON object, which is invalid
	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("body must only contain a single JSON value")
	}

	return nil
}

func (app *application) readString(queryString url.Values, key string, defaultValue string) string {

	value := queryString.Get(key)
	if value == "" {
		return defaultValue
	}

	return value
}

func (app *application) readInt(queryString url.Values, key string, defaultValue int, validator *validator.Validator) int {
	value := queryString.Get(key)
	if value == "" {
		return defaultValue
	}

	intValue, err := strconv.Atoi(value)
	if err != nil {
		validator.AddError(key, fmt.Sprintf("%s must be an integer value.", key))
	}

	return intValue
}

func (app *application) readFloat(queryString url.Values, key string, defaultValue float64, v *validator.Validator) float64 {
	value := queryString.Get(key)
	if value == "" {
		return defaultValue
	}

	floatValue, err := strconv.ParseFloat(value, 64)
	if err != nil {
		v.AddError(key, fmt.Sprintf("%s must be a float value.", key))
	}

	return floatValue
}

func (app *application) readBool(queryString url.Values, key string, v *validator.Validator) bool {

	value := queryString.Get(key)

	if value == "" {
		return false
	}

	res, err := strconv.ParseBool(value)
	if err != nil {
		v.AddError(key, fmt.Sprintf("%s must be a boolean value.", key))
	}

	return res
}

func (app *application) readCSV(queryString url.Values, key string, defaultValues []string) []string {
	value := queryString.Get(key)
	if value == "" {
		return defaultValues
	}

	return strings.Split(value, ",")
}

func (app *application) background(fn func()) {

	app.wg.Add(1)

	go func() {
		defer app.wg.Done()
		defer func() {
			if err := recover(); err != nil {
				app.logger.PrintError(fmt.Errorf("%s", err), nil)
			}
		}()

		fn()
	}()
}

func (app *application) getSecureCookieFlag() bool {
	secureFlag := false
	if app.config.Env == "prod" {
		secureFlag = true
	}
	return secureFlag
}

func (application *application) generateImageURL(name string) string {
	return fmt.Sprintf("http://%s:%d/v1/images/%s", application.config.Host, application.config.Port, name)
}
