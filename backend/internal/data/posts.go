package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

var (
	ErrDuplicateSlug  = errors.New("duplicate slug")
	postStatusChoices = []string{"draft", "published", "archived"}
)

type Post struct {
	ID        int64        `json:"id"`
	UserID    int64        `json:"-"`
	Title     *NullString  `json:"title,omitempty"`
	Slug      *NullString  `json:"slug,omitempty"`
	Preview   *NullString  `json:"preview,omitempty"`
	Content   *NullString  `json:"content,omitempty"`
	ImageName *NullString  `json:"image_name,omitempty"`
	Status    string       `json:"status,omitempty"`
	Tags      []string     `json:"tags,omitempty"`
	UpdatedAt time.Time    `json:"updated_at,omitempty"`
	CreatedAt time.Time    `json:"created_at,omitempty"`
	DeletedAt sql.NullTime `json:"-"`
	Version   int32        `json:"-"`
}

type Author struct {
	ID    int64  `json:"id"`
	Name  string `json:"name,omitempty"`
	Email string `json:"email,omitempty"`
}

type PostWithAuthor struct {
	ID        int64        `json:"id"`
	Author    Author       `json:"author"`
	Title     *NullString  `json:"title,omitempty"`
	Slug      *NullString  `json:"slug,omitempty"`
	Preview   *NullString  `json:"preview,omitempty"`
	Content   *NullString  `json:"content,omitempty"`
	ImageName *NullString  `json:"image_name,omitempty"`
	Status    string       `json:"status,omitempty"`
	Tags      []string     `json:"tags,omitempty"`
	UpdatedAt time.Time    `json:"updated_at,omitempty"`
	CreatedAt time.Time    `json:"created_at,omitempty"`
	DeletedAt sql.NullTime `json:"-"`
	Version   int32        `json:"-"`
}

func ValidatePostImageName(v *validator.Validator, imageName *NullString) {
	v.Check(imageName.String != "", "image_name", "must be provided")
	v.Check(validator.Matches(imageName.String, validator.ImageNameRX), "image_name", "must be a valid image name")
}

func ValidatePostUserIDOnly(v *validator.Validator, post *Post) {
	v.Check(post.UserID > 0, "user_id", "invalid user id")
}

func ValidatePost(v *validator.Validator, post *Post) {
	v.Check(post.UserID > 0, "user_id", "invalid user id")
	v.Check(post.Title.String != "", "title", "must be provided")
	v.Check(len(post.Title.String) <= 500, "title", "must not be more than 500 bytes long")
	v.Check(post.Slug.String != "", "slug", "must be provided")
	v.Check(post.Preview.String != "", "preview", "must be provided")
	v.Check(post.Content.String != "", "content", "must be provided")
	ValidatePostImageName(v, post.ImageName)
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

	args := []interface{}{post.UserID}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&post.ID, &post.CreatedAt, &post.UpdatedAt, &post.Version)
	if err != nil {
		return err
	}

	return nil
}
