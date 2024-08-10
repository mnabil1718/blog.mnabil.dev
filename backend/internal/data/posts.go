package data

import (
	"context"
	"database/sql"
	"errors"
	"strings"
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
	Title     string       `json:"title"`
	Slug      string       `json:"slug"`
	Preview   string       `json:"preview,omitempty"`
	Content   string       `json:"content,omitempty"`
	ImageUrl  string       `json:"image_url,omitempty"`
	Status    string       `json:"status,omitempty"`
	Tags      []string     `json:"tags,omitempty"`
	UpdatedAt time.Time    `json:"updated_at,omitempty"`
	CreatedAt time.Time    `json:"-"`
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
	Title     string       `json:"title"`
	Slug      string       `json:"slug"`
	Preview   string       `json:"preview,omitempty"`
	Content   string       `json:"content,omitempty"`
	ImageUrl  string       `json:"image_url,omitempty"`
	Status    string       `json:"status,omitempty"`
	Tags      []string     `json:"tags,omitempty"`
	UpdatedAt time.Time    `json:"updated_at,omitempty"`
	CreatedAt time.Time    `json:"-"`
	DeletedAt sql.NullTime `json:"-"`
	Version   int32        `json:"-"`
}

func ValidatePost(v *validator.Validator, post *Post) {
	v.Check(post.UserID > 0, "user_id", "invalid user id")
	v.Check(post.Title != "", "title", "must be provided")
	v.Check(len(post.Title) <= 500, "title", "must not be more than 500 bytes long")
	v.Check(post.Slug != "", "slug", "must be provided")
	v.Check(post.Preview != "", "preview", "must be provided")
	v.Check(post.Content != "", "content", "must be provided")
	v.Check(post.ImageUrl != "", "image_url", "must be provided")
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
	SQL := `INSERT INTO posts (user_id, title, slug, preview, content, image_url, status, tags)
			VALUES ($1, $2, $3)
			RETURNING id, updated_at, version`

	args := []interface{}{post.UserID, post.Title, post.Slug, post.Preview, post.Content, post.ImageUrl, post.Status, post.Tags}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&post.ID, &post.UpdatedAt, &post.Version)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), `violates unique constraint "posts_slug_key"`):
			return ErrDuplicateEmail
		default:
			return err
		}
	}

	return nil
}
