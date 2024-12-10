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

	router.HandlerFunc(http.MethodPost, "/v1/tokens/activation", app.createActivationTokenHandler)
	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthTokenHandler)
	router.HandlerFunc(http.MethodDelete, "/v1/tokens/authentication", app.requireAuthenticatedUser(app.revokeAuthTokenHandler))

	router.HandlerFunc(http.MethodPost, "/v1/images", app.requireAuthenticatedUser(app.uploadImagesHandler))

	router.HandlerFunc(http.MethodPost, "/v1/posts", app.requireAuthenticatedUser(app.createPostHandler))

	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)
	router.HandlerFunc(http.MethodPut, "/v1/users/activation", app.activateUserHandler)

	return app.recoverPanic(app.enableCORS(app.rateLimit(app.authenticate(router))))
}
