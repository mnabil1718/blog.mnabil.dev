package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

var (
	ErrDuplicateSlug  = errors.New("duplicate slug")
	postStatusChoices = []string{"draft", "published", "archived"}
)

type Post struct {
	ID        int64        `json:"id"`
	Author    *User        `json:"author,omitempty"`
	Title     *string      `json:"title"`
	Slug      *string      `json:"slug"`
	Preview   *string      `json:"preview"`
	Content   *string      `json:"content"`
	Status    string       `json:"status,omitempty"`
	Tags      []string     `json:"tags"`
	Image     *Image       `json:"image,omitempty"`
	UpdatedAt time.Time    `json:"updated_at"`
	CreatedAt time.Time    `json:"created_at"`
	DeletedAt sql.NullTime `json:"-"`
	Version   int32        `json:"-"`
}

func ValidatePostImageName(v *validator.Validator, imageName string) {
	v.Check(imageName != "", "image", "must be provided")
	v.Check(validator.Matches(imageName, validator.ImageNameRX), "image", "must be a valid image name")
}

func ValidatePostUserIDOnly(v *validator.Validator, post *Post) {
	v.Check(post.Author.ID > 0, "author", "invalid user id")
}

func ValidatePost(v *validator.Validator, post *Post) {
	v.Check(post.Author.ID > 0, "author", "invalid user id")
	v.Check(*post.Title != "", "title", "must be provided")
	v.Check(len(*post.Title) <= 500, "title", "must not be more than 500 bytes long")
	v.Check(*post.Slug != "", "slug", "must be provided")
	v.Check(*post.Preview != "", "preview", "must be provided")
	v.Check(*post.Content != "", "content", "must be provided")
	ValidatePostImageName(v, post.Image.Name)
	v.Check(post.Status != "", "status", "must be provided")
	v.Check(v.In(post.Status, postStatusChoices...), "status", "invalid status")
	v.Check(post.Tags != nil, "tags", "must be provided")
	v.Check(len(post.Tags) >= 1, "tags", "must contain at least 1 tag")
	v.Check(len(post.Tags) <= 5, "tags", "must not contain more than 5 tags")
	v.Check(validator.Unique(post.Tags), "tags", "must not contain duplicate values")
}

type PostModel struct {
	DB *sql.DB
}

func (model PostModel) Insert(post *Post) error {
	SQL := `INSERT INTO posts (user_id)
			VALUES ($1)
			RETURNING id, created_at, updated_at, version`

	args := []interface{}{post.Author.ID}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&post.ID, &post.CreatedAt, &post.UpdatedAt, &post.Version)
	if err != nil {
		return err
	}

	return nil
}

func (model PostModel) GetByID(id int64) (*Post, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	SQL := `SELECT 
						id, user_id, title, preview, content, slug, image_name, tags, status, created_at, updated_at, deleted_at, version
					FROM posts WHERE id=$1`

	post := &Post{Author: &User{}}
	m := pgtype.NewMap()
	var tags []string
	var image_name *string

	args := []interface{}{id}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&post.ID, &post.Author.ID, &post.Title, &post.Preview, &post.Content, &post.Slug, &image_name, m.SQLScanner(&tags), &post.Status, &post.CreatedAt, &post.UpdatedAt, &post.DeletedAt, &post.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound

		default:
			return nil, err
		}
	}

	post.Tags = tags

	if image_name != nil {
		post.Image = &Image{Name: *image_name}
	}

	return post, nil
}

func (model PostModel) Update(post *Post) error {
	SQL := `UPDATE posts
						SET slug=$1, title=$2, preview=$3, content=$4, image_name=$5, status=$6, tags=$7, version=version + 1
					WHERE id=$8 AND user_id=$9 AND version=$10
					RETURNING version`

	args := []interface{}{post.Slug, post.Title, post.Preview, post.Content, post.Image.Name, post.Status, post.Tags, post.ID, post.Author.ID, post.Version}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&post.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}
