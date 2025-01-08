package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

// func (app *application) routesOld() http.Handler {
// 	router := httprouter.New()
// 	router.NotFound = http.HandlerFunc(app.notFoundResponse)
// 	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

// 	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

// 	router.HandlerFunc(http.MethodPost, "/v1/tokens/activation", app.createActivationTokenHandler)
// 	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthTokenHandler)
// 	router.HandlerFunc(http.MethodDelete, "/v1/tokens/authentication", app.requireAuthenticatedUser(app.revokeAuthTokenHandler))

// 	router.HandlerFunc(http.MethodGet, "/v1/images/:name", app.getImagesHandler)
// 	router.HandlerFunc(http.MethodGet, "/v1/images/:name/metadata", app.getImagesMetadataHandler)
// 	router.HandlerFunc(http.MethodPost, "/v1/images", app.requireAuthenticatedUser(app.uploadImagesHandler))

// 	router.HandlerFunc(http.MethodGet, "/v1/posts", app.listPostsHandler)
// 	router.HandlerFunc(http.MethodPost, "/v1/posts", app.requireAuthenticatedUser(app.createPostHandler))

// 	// this route evaluates to: /v1/posts/status/count
// 	// julienschmidt/httprouter doesn't allow conflicting route
// 	router.HandlerFunc(http.MethodGet, "/v1/posts/:id/count", app.requireAuthenticatedUser(app.getStatusCountHandler))
// 	router.HandlerFunc(http.MethodGet, "/v1/posts/:id", app.requireAuthenticatedUser(app.getPostByIDHandler))
// 	router.HandlerFunc(http.MethodPatch, "/v1/posts/:id", app.requireAuthenticatedUser(app.updatePostHandler))

// 	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)
// 	router.HandlerFunc(http.MethodPut, "/v1/users/activation", app.activateUserHandler)

// 	return app.recoverPanic(app.enableCORS(app.rateLimit(app.authenticate(router))))
// }

func (app *application) routes() http.Handler {
	r := chi.NewRouter()

	r.Use(app.recoverPanic)
	r.Use(app.enableCORS)
	r.Use(app.rateLimit)
	r.Use(app.authenticate)

	r.NotFound(http.HandlerFunc(app.notFoundResponse))
	r.MethodNotAllowed(http.HandlerFunc(app.methodNotAllowedResponse))

	// public
	r.Group(func(r chi.Router) {
		r.Method(http.MethodGet, "/v1/healthcheck", http.HandlerFunc(app.healthcheckHandler))

		r.Method(http.MethodPost, "/v1/tokens/activation", http.HandlerFunc(app.createActivationTokenHandler))
		r.Method(http.MethodPost, "/v1/tokens/authentication", http.HandlerFunc(app.createAuthTokenHandler))

		r.Method(http.MethodPost, "/v1/users", http.HandlerFunc(app.registerUserHandler))
		r.Method(http.MethodPut, "/v1/users/activation", http.HandlerFunc(app.activateUserHandler))

		r.Method(http.MethodGet, "/v1/images/{name}/metadata", http.HandlerFunc(app.getImagesMetadataHandler))
		r.Method(http.MethodGet, "/v1/images/{name}", http.HandlerFunc(app.getImagesHandler))

		r.Method(http.MethodGet, "/v1/posts", http.HandlerFunc(app.listPostsHandler))
	})

	// auth
	r.Group(func(r chi.Router) {
		r.Use(app.requireAuthenticatedUser)

		r.Method(http.MethodDelete, "/v1/tokens/authentication", http.HandlerFunc(app.revokeAuthTokenHandler))
		r.Method(http.MethodPost, "/v1/images", http.HandlerFunc(app.uploadImagesHandler))
		r.Method(http.MethodPost, "/v1/posts", http.HandlerFunc(app.createPostHandler))
		r.Method(http.MethodGet, "/v1/posts/status/count", http.HandlerFunc(app.getStatusCountHandler))
		r.Method(http.MethodGet, "/v1/posts/{id}", http.HandlerFunc(app.getPostByIDHandler))
		r.Method(http.MethodPatch, "/v1/posts/{id}", http.HandlerFunc(app.updatePostHandler))
	})

	return r
}
