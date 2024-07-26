package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()
	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc(http.MethodGet, "/v1/tokens/csrf", app.getCsrfTokenHandler)
	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthTokenHandler)

	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)
	router.HandlerFunc(http.MethodPut, "/v1/users/activation", app.activateUserHandler)

	// csrfMiddleware := csrf.Protect([]byte("5VgBdqris6ZOF8vPGNzj8W4amQEGBZ0N3zMJQVvGUVM="), csrf.HttpOnly(true), csrf.SameSite(csrf.SameSiteLaxMode), csrf.Path("/"), csrf.Secure(false))

	return app.recoverPanic(app.enableCORS(app.rateLimit(app.noSurf(router))))
}
