package main

import (
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

type ListPostRequest struct {
	Title string
	Tags  []string
	data.Filters
}

type updatePostRequest struct {
	Title   *string `json:"title"`
	Slug    *string `json:"slug"`
	Preview *string `json:"preview"`
	Content *string `json:"content"`
	Image   *struct {
		Name string `json:"name"`
		Alt  string `json:"alt"`
	} `json:"image"`
	Status *string  `json:"status"`
	Tags   []string `json:"tags"`
}

type CreatePostRequest struct {
	UserID int64 `json:"user_id"`
}

func (app *application) getStatusCountHandler(w http.ResponseWriter, r *http.Request) {

	scs, err := app.models.Posts.CountByStatus()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"data": scs}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) listPostsHandler(w http.ResponseWriter, r *http.Request) {
	var listPostRequest ListPostRequest
	validator := validator.New()
	queryString := r.URL.Query()

	listPostRequest.Title = app.readString(queryString, "title", "")
	listPostRequest.Tags = app.readCSV(queryString, "tags", []string{})
	listPostRequest.PageSize = app.readInt(queryString, "page_size", 10, validator)
	listPostRequest.Page = app.readInt(queryString, "page", 1, validator)
	listPostRequest.Status = app.readString(queryString, "status", "all")
	listPostRequest.StatusSafelist = []string{"all", string(data.DRAFT), string(data.PUBLISHED), string(data.ARCHIVED)}

	if data.ValidateFilters(validator, &listPostRequest.Filters); !validator.Valid() {
		app.failedValidationResponse(w, r, validator.Errors)
		return
	}

	posts, metadata, err := app.models.Posts.GetAll(listPostRequest.Title, listPostRequest.Tags, listPostRequest.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var extractedAuthorIDs []int64
	var extractedImageNames []string

	for idx := range posts {
		extractedAuthorIDs = append(extractedAuthorIDs, posts[idx].Author.ID)
		if posts[idx].Image != nil {
			extractedImageNames = append(extractedImageNames, posts[idx].Image.Name)
		}
	}

	users, err := app.models.Users.GetByIDs(extractedAuthorIDs)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	images, err := app.models.Images.GetByNames(extractedImageNames)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// memory efficient, use idx
	for idx := range posts {
		posts[idx].Author = &data.User{Name: users[posts[idx].Author.ID].Name, Email: users[posts[idx].Author.ID].Email}
		if posts[idx].Image != nil {
			image := images[posts[idx].Image.Name]
			posts[idx].Image = &data.Image{
				Name: image.Name,
				Alt:  image.Alt,
				URL:  app.generateImageURL(image.Name),
			}
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"metadata": metadata, "posts": posts}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var createPostRequest CreatePostRequest

	err := app.readJSON(w, r, &createPostRequest)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post := &data.Post{Author: &data.User{ID: createPostRequest.UserID}}

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
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if post.Author != nil {
		user, err := app.models.Users.GetByID(post.Author.ID)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

		post.Author = &data.User{ID: user.ID, Name: user.Name, Email: user.Email}
	}

	if post.Image != nil {
		image, err := app.models.Images.GetByName(post.Image.Name)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

		post.Image = image
		post.Image.URL = app.generateImageURL(post.Image.Name)

	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": post}, r.Header)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) updatePostHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.getIdFromRequestContext(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	var updatePostRequest updatePostRequest
	err = app.readJSON(w, r, &updatePostRequest)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	post, err := app.models.Posts.GetByID(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	v := validator.New()

	if updatePostRequest.Image != nil {

		image, err := app.models.Images.GetByName(updatePostRequest.Image.Name)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

		if image.IsTemp {

			origin := filepath.Join(app.config.Upload.TempPath, image.FileName)
			destination := filepath.Join(app.config.Upload.Path, image.FileName)

			err = app.storage.Move(origin, destination)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}
		}

		image.Alt = updatePostRequest.Image.Alt
		image.IsTemp = false
		image.UpdatedAt = time.Now()
		image.URL = app.generateImageURL(image.Name)

		if data.ValidateImage(v, image); !v.Valid() {
			app.failedValidationResponse(w, r, v.Errors)
			return
		}

		err = app.models.Images.Update(image)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrEditConflict):
				app.editConflictResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

		post.Image = image
	} else {
		if post.Image != nil && post.Image.Name != "" {
			image, err := app.models.Images.GetByName(post.Image.Name)
			if err != nil {
				switch {
				case errors.Is(err, data.ErrRecordNotFound):
					app.notFoundResponse(w, r)
				default:
					app.serverErrorResponse(w, r, err)
				}
				return
			}

			image.URL = app.generateImageURL(image.Name)

			if data.ValidateImage(v, image); !v.Valid() {
				app.failedValidationResponse(w, r, v.Errors)
				return
			}

			post.Image = image
		}
	}

	if updatePostRequest.Slug != nil {
		post.Slug = updatePostRequest.Slug
	}

	if updatePostRequest.Title != nil {
		post.Title = updatePostRequest.Title
	}

	if updatePostRequest.Preview != nil {
		post.Preview = updatePostRequest.Preview
	}

	if updatePostRequest.Content != nil {
		post.Content = updatePostRequest.Content
	}

	if updatePostRequest.Status != nil {
		post.Status = *updatePostRequest.Status
	}

	if updatePostRequest.Tags != nil {
		post.Tags = updatePostRequest.Tags
	}

	v.ResetErrors() // reuse the same validator struct for post validation

	if data.ValidatePost(v, post); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	// check if current user is post
	// author otherwise update error
	user := app.contextGetUser(r)
	post.Author.ID = 0 // don't leak author id on update
	post.Author.Name = user.Name
	post.Author.Email = user.Email

	err = app.models.Posts.UpdateForUser(post, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": post}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
