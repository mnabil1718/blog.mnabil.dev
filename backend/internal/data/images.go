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
	ErrDuplicateFileName = errors.New("duplicate file name")
)

type Image struct {
	ID          int64     `json:"id"`
	FileName    string    `json:"file_name"`
	Alt         string    `json:"alt"`
	Destination string    `json:"destination"`
	Size        int32     `json:"size,omitempty"`
	Width       int32     `json:"width,omitempty"`
	Height      int32     `json:"height,omitempty"`
	ContentType string    `json:"content_type"`
	IsTemp      bool      `json:"-"`
	UpdatedAt   time.Time `json:"-"`
	CreatedAt   time.Time `json:"-"`
	Version     int32     `json:"-"`
}

func ValidateImage(v *validator.Validator, image *Image) {
	v.Check(image.FileName != "", "file_name", "must be provided")
	v.Check(len(image.FileName) <= 750, "file_name", "must not be more than 750 bytes long")
	v.Check(image.Alt != "", "alt", "must be provided")
	v.Check(len(image.Alt) <= 750, "alt", "must not be more than 750 bytes long")
	v.Check(image.Size > 0, "size", "must be more than zero")
	v.Check(image.Size < 10*1024*1024, "size", "must be less than 10 MB")
	v.Check(image.Height > 0, "height", "must be more than zero")
	v.Check(image.Width > 0, "width", "must be more than zero")
	v.Check(v.In(image.ContentType, "image/jpeg", "image/png", "image/webp", "image/gif"), "content_type", "invalid content type")
}

type ImageModel struct {
	DB *sql.DB
}

func (model ImageModel) Insert(image *Image) error {
	SQL := `INSERT INTO images (file_name, alt, destination, size, width, height, content_type)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, created_at, updated_at, version`

	args := []interface{}{image.FileName, image.Alt, image.Destination, image.Size, image.Width, image.Height, image.ContentType}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := model.DB.QueryRowContext(ctx, SQL, args...).Scan(&image.ID, &image.CreatedAt, &image.UpdatedAt, &image.Version)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), `violates unique constraint "images_file_name_key"`):
			return ErrDuplicateFileName
		default:
			return err
		}
	}

	return nil
}
