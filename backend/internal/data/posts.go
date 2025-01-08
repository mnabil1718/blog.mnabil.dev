package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
	"unicode/utf8"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
)

var (
	ErrDuplicateSlug  = errors.New("duplicate slug")
	postStatusChoices = []string{"draft", "published", "archived"}
)

type PostStatus string

const (
	DRAFT     PostStatus = "draft"
	PUBLISHED PostStatus = "published"
	ARCHIVED  PostStatus = "archived"
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
	UpdatedAt *time.Time   `json:"updated_at"`
	CreatedAt *time.Time   `json:"created_at"`
	DeletedAt sql.NullTime `json:"-"`
	Version   int32        `json:"-"`
}

type PostStatusCount struct {
	Status string `json:"status"`
	Count  int    `json:"count"`
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
	v.Check(utf8.RuneCountInString(*post.Title) <= 200, "title", "must be less than 200 characters long")
	v.Check(*post.Slug != "", "slug", "must be provided")
	v.Check(*post.Preview != "", "preview", "must be provided")
	v.Check(*post.Content != "", "content", "must be provided")
	ValidatePostImageName(v, post.Image.Name)
	v.Check(post.Status != "", "status", "must be provided")
	v.Check(v.In(post.Status, postStatusChoices...), "status", "invalid status")
	v.Check(post.Tags != nil, "tags", "must be provided")
	v.Check(len(post.Tags) >= 1, "tags", "must contain at least 1 tag")
	v.Check(len(post.Tags) <= 5, "tags", "must not contain more than 5 tags")

	// just one long tag error is enough
	for _, tag := range post.Tags {
		if utf8.RuneCountInString(tag) > 20 {
			v.AddError("tags", "tag text is too long")
			break
		}
	}

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

func (model PostModel) GetAll(title string, tags []string, filters Filters) ([]*Post, Metadata, error) {

	SQL := `
			SELECT COUNT(*) OVER(), id, user_id, title, preview, slug, image_name, tags, status, created_at, updated_at, deleted_at, version
			FROM posts
			WHERE (to_tsvector('simple', title) @@ plainto_tsquery('simple', $1) OR $1 = '')
			AND (tags @> $2 OR $2 = '{}')
			AND ($3 = 'all' OR status = $3::post_status)
			ORDER BY updated_at DESC
			LIMIT $4 OFFSET $5`

	args := []interface{}{title, tags, filters.Status, filters.limit(), filters.offset()}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := model.DB.QueryContext(ctx, SQL, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	posts := []*Post{}

	for rows.Next() {
		post := &Post{Author: &User{}}
		m := pgtype.NewMap()
		var tags []string
		var image_name *string

		err := rows.Scan(&totalRecords, &post.ID, &post.Author.ID, &post.Title, &post.Preview, &post.Slug, &image_name, m.SQLScanner(&tags), &post.Status, &post.CreatedAt, &post.UpdatedAt, &post.DeletedAt, &post.Version)
		if err != nil {
			return nil, Metadata{}, err
		}

		post.Tags = tags

		if image_name != nil {
			post.Image = &Image{Name: *image_name}
		}

		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return posts, metadata, nil
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

func (model PostModel) UpdateForUser(post *Post, userID int64) error {
	SQL := `UPDATE posts
						SET slug=$1, title=$2, preview=$3, content=$4, image_name=$5, status=$6, tags=$7, version=version + 1
					WHERE id=$8 AND user_id=$9 AND version=$10
					RETURNING version`

	args := []interface{}{post.Slug, post.Title, post.Preview, post.Content, post.Image.Name, post.Status, post.Tags, post.ID, userID, post.Version}
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

func (model PostModel) CountByStatus() ([]*PostStatusCount, error) {
	SQL := `WITH status_counts AS (
							SELECT status, COUNT(*) AS count
							FROM posts
							GROUP BY status
					),
					all_posts AS (
							SELECT 'all' AS status, COUNT(*) AS count
							FROM posts
					)
					SELECT status, count
					FROM all_posts
					UNION ALL
					SELECT sc.status::text, COALESCE(sc.count, 0) AS count
					FROM (
							SELECT s.status, sc.count
							FROM (VALUES 
									('draft'::post_status), 
									('published'::post_status), 
									('archived'::post_status)
							) AS s(status)
							LEFT JOIN status_counts sc ON s.status = sc.status
					) sc
					ORDER BY status ASC`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := model.DB.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var scs []*PostStatusCount

	for rows.Next() {

		sc := &PostStatusCount{}

		err := rows.Scan(&sc.Status, &sc.Count)
		if err != nil {
			return nil, err
		}

		scs = append(scs, sc)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return scs, nil
}
