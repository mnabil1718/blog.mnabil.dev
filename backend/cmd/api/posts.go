package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

type CreatePostRequest struct {
	UserID int64 `json:"user_id"`
}

// type createPostRequest struct {
// 	UserID    int64    `json:"user_id"`
// 	Title     string   `json:"title"`
// 	Slug      string   `json:"slug"`
// 	Preview   string   `json:"preview"`
// 	Content   string   `json:"content"`
// 	ImageName string   `json:"image_name"`
// 	ImageAlt  string   `json:"image_alt"`
// 	Status    string   `json:"status"`
// 	Tags      []string `json:"tags"`
// }

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var createPostRequest CreatePostRequest

	err := app.readJSON(w, r, &createPostRequest)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post := &data.Post{UserID: createPostRequest.UserID}

	v := validator.New()
	if data.ValidatePostUserIDOnly(v, post); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Posts.Insert(post)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/posts/%d", post.ID))

	err = app.writeJSON(w, http.StatusCreated, envelope{"post": post}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) getPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.getIdFromRequestContext(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	post, err := app.models.Posts.GetByID(id)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			app.notFoundResponse(w, r)
			return
		}

		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": post}, r.Header)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

// func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
// 	var createPostRequest createPostRequest

// 	err := app.readJSON(w, r, &createPostRequest)
// 	if err != nil {
// 		app.badRequestResponse(w, r, err)
// 		return
// 	}

// 	image, err := app.models.Images.GetByName(createPostRequest.ImageName)
// 	if err != nil {
// 		if errors.Is(err, data.ErrRecordNotFound) {
// 			app.notFoundResponse(w, r)
// 			return
// 		}

// 		app.serverErrorResponse(w, r, err)
// 		return
// 	}

// 	image.Alt = createPostRequest.ImageAlt
// 	image.IsTemp = false
// 	image.UpdatedAt = time.Now()

// 	v := validator.New()

// 	if data.ValidateImage(v, image); !v.Valid() {
// 		app.failedValidationResponse(w, r, v.Errors)
// 		return
// 	}

// 	if image.IsTemp {
// 		origin := filepath.Join(app.config.Upload.TempPath, image.FileName)
// 		destination := filepath.Join(app.config.Upload.Path, image.FileName)
// 		err = app.storage.Move(origin, destination)
// 		if err != nil {
// 			app.serverErrorResponse(w, r, err)
// 			return
// 		}
// 	}

// 	err = app.models.Images.Update(image)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, data.ErrEditConflict):
// 			app.editConflictResponse(w, r)
// 		default:
// 			app.serverErrorResponse(w, r, err)
// 		}
// 		return
// 	}

// 	post := &data.Post{
// 		UserID:    createPostRequest.UserID,
// 		Title:     createPostRequest.Title,
// 		Slug:      createPostRequest.Slug,
// 		Preview:   createPostRequest.Preview,
// 		Content:   createPostRequest.Content,
// 		ImageName: createPostRequest.ImageName,
// 		Status:    createPostRequest.Status,
// 		Tags:      createPostRequest.Tags,
// 	}

// 	v.ResetErrors() // reuse the same validator struct for post validation

// 	if data.ValidatePost(v, post); !v.Valid() {
// 		app.failedValidationResponse(w, r, v.Errors)
// 		return
// 	}

// 	err = app.models.Posts.Insert(post)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, data.ErrDuplicateSlug):
// 			v.AddError("slug", "slug already exists")
// 			app.failedValidationResponse(w, r, v.Errors)

// 		default:
// 			app.serverErrorResponse(w, r, err)
// 		}
// 		return
// 	}

// 	headers := make(http.Header)
// 	headers.Set("Location", fmt.Sprintf("/v1/posts/%d", post.ID))

// 	err = app.writeJSON(w, http.StatusCreated, envelope{"post": post}, headers)
// 	if err != nil {
// 		app.serverErrorResponse(w, r, err)
// 	}
// }
