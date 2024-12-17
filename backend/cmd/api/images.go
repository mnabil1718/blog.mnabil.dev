package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/storage"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

func (app *application) uploadImagesHandler(w http.ResponseWriter, r *http.Request) {
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	defer file.Close()

	v := validator.New()

	image, err := app.storage.SaveTemp(file, *fileHeader, app.config.Upload.TempPath, v)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrUnsupportedFormat):
			app.badRequestResponse(w, r, err)
		case errors.Is(err, storage.ErrFileRead):
			app.serverErrorResponse(w, r, err)
		case errors.Is(err, storage.ErrFileCreate):
			app.serverErrorResponse(w, r, err)
		case errors.Is(err, storage.ErrInvalidImage):
			app.badRequestResponse(w, r, err)
		case errors.Is(err, storage.ErrValidation):
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.models.Images.Insert(image)
	if err != nil {
		if errors.Is(err, data.ErrDuplicateFileName) {
			v.AddError("file_name", "name already exists")
			app.failedValidationResponse(w, r, v.Errors)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/images/%d", image.ID))

	err = app.writeJSON(w, http.StatusCreated, envelope{"image": image}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
