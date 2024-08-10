package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

type createPostRequest struct {
	UserID   int64    `json:"user_id"`
	Title    string   `json:"title"`
	Slug     string   `json:"slug"`
	Preview  string   `json:"preview,omitempty"`
	Content  string   `json:"content,omitempty"`
	ImageUrl string   `json:"image_url,omitempty"`
	Status   string   `json:"status,omitempty"`
	Tags     []string `json:"tags,omitempty"`
}

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var createPostRequest createPostRequest

	err := app.readJSON(w, r, &createPostRequest)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post := &data.Post{
		UserID:   createPostRequest.UserID,
		Title:    createPostRequest.Title,
		Slug:     createPostRequest.Slug,
		Preview:  createPostRequest.Preview,
		Content:  createPostRequest.Content,
		ImageUrl: createPostRequest.ImageUrl,
		Status:   createPostRequest.Status,
		Tags:     createPostRequest.Tags,
	}

	v := validator.New()

	if data.ValidatePost(v, post); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Posts.Insert(post)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateSlug):
			v.AddError("slug", "slug already exists")
			app.failedValidationResponse(w, r, v.Errors)

		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/posts/%d", post.ID))

	err = app.writeJSON(w, http.StatusCreated, envelope{"post": post}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
