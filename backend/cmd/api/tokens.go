package main

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

type CreateAuthTokenRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ResendActivationTokenRequest struct {
	Email string `json:"email"`
}

type RevokeAuthTokenRequest struct {
	TokenPlainText string `json:"token"`
}

func (app *application) revokeAuthTokenHandler(w http.ResponseWriter, r *http.Request) {

	token := strings.Split(r.Header.Get("Authorization"), " ")[1]

	user, err := app.models.Users.GetForToken(data.ScopeAuthentication, token)

	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.invalidAuthenticationTokenResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.models.Tokens.DeleteForAllUser(data.ScopeAuthentication, user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	expiredCookie := &http.Cookie{
		Name:     "authentication_token",
		Path:     "/",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}
	http.SetCookie(w, expiredCookie)

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "authentication token sucessfully revoked"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createAuthTokenHandler(w http.ResponseWriter, r *http.Request) {

	var createAuthTokenRequest CreateAuthTokenRequest

	err := app.readJSON(w, r, &createAuthTokenRequest)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()

	data.ValidateEmail(v, createAuthTokenRequest.Email)
	data.ValidatePasswordPlaintext(v, createAuthTokenRequest.Password)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := app.models.Users.GetByEmail(createAuthTokenRequest.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.invalidCredentialsResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	ok, err := user.Password.Matches(createAuthTokenRequest.Password)
	if !ok {
		if err != nil {
			app.serverErrorResponse(w, r, err)
		} else {
			app.invalidCredentialsResponse(w, r)
		}
		return
	}

	token, err := app.models.Tokens.New(user.ID, 24*time.Hour, data.ScopeAuthentication)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	cookie := &http.Cookie{
		Name:     "authentication_token",
		Path:     "/",
		Value:    token.Plaintext,
		Expires:  token.ExpiryTime,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(w, cookie)
	err = app.writeJSON(w, http.StatusCreated, envelope{"authentication_token": token, "user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createActivationTokenHandler(w http.ResponseWriter, r *http.Request) {
	var input ResendActivationTokenRequest

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	if data.ValidateEmail(v, input.Email); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := app.models.Users.GetByEmail(input.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("email", "no matching email address found")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if user.Activated {
		v.AddError("email", "user has already been activated")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	token, err := app.models.Tokens.New(user.ID, 3*24*time.Hour, data.ScopeActivation)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.background(func() {
		data := map[string]interface{}{
			"activationToken": token.Plaintext,
			"activationLink":  app.config.frontendUrl + "/activation",
		}
		// Since email addresses MAY be case sensitive, notice that we are sending this
		// email using the address stored in our database for the user --- not to the
		// input.Email address provided by the client in this request.
		err = app.mailer.Send(user.Email, "token_activation.tmpl", data)
		if err != nil {
			app.logger.PrintError(err, nil)
		}
	})

	env := envelope{"message": "an email will be sent to you containing activation instructions"}
	err = app.writeJSON(w, http.StatusAccepted, env, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
