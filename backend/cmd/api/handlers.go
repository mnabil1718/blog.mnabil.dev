package main

import (
	"net/http"

	"github.com/justinas/nosurf"
)

func (app *application) healthcheckHandler(writer http.ResponseWriter, request *http.Request) {
	env := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": app.config.Env,
			"version":     version,
		},
	}

	err := app.writeJSON(writer, http.StatusOK, env, request.Header)

	if err != nil {
		app.serverErrorResponse(writer, request, err)
	}
}

func (app *application) getCsrfTokenHandler(w http.ResponseWriter, r *http.Request) {

	token := nosurf.Token(r)

	w.Header().Set("X-CSRF-Token", token)

	err := app.writeJSON(w, http.StatusOK, envelope{"token": token}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
