package storage

import (
	"errors"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
	"golang.org/x/image/bmp"
	"golang.org/x/image/tiff"
	"golang.org/x/image/webp"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported image format")
	ErrFileRead          = errors.New("failed to read file")
	ErrFileCreate        = errors.New("failed to create file")
	ErrInvalidImage      = errors.New("invalid image dimensions")
	ErrValidation        = errors.New("image validation failed")
	ErrSystem            = errors.New("system error")
	ErrFileNotFound      = errors.New("file does not exist")
	ErrDirectoryNotFound = errors.New("directory does not exist")
	ErrFileMove          = errors.New("failed to move file")
)

var CONTENT_DECODERS = map[string](func(r io.Reader) (image.Config, error)){
	"image/jpeg": jpeg.DecodeConfig,
	"image/png":  png.DecodeConfig,
	"image/gif":  gif.DecodeConfig,
	"image/tiff": tiff.DecodeConfig,
	"image/webp": webp.DecodeConfig,
	"image/bmp":  bmp.DecodeConfig,
}

var EXT_MAP = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/gif":  ".gif",
	"image/tiff": ".tif",
	"image/webp": ".webp",
	"image/bmp":  ".bmp",
}

func detectMimeType(file multipart.File) (string, error) {
	buffer := make([]byte, 512)
	if _, err := file.Read(buffer); err != nil {
		return "", ErrFileRead
	}
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", ErrSystem
	}
	return http.DetectContentType(buffer), nil
}

func decodeImageMetadata(file multipart.File, mimeType string) (int, int, error) {
	decoder, ok := CONTENT_DECODERS[mimeType]
	if !ok {
		return 0, 0, ErrUnsupportedFormat
	}
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return 0, 0, ErrSystem
	}
	config, err := decoder(file)
	if err != nil {
		return 0, 0, err
	}
	return config.Width, config.Height, nil
}

func validateImage(v *validator.Validator, image *data.Image) error {
	if data.ValidateImage(v, image); !v.Valid() {
		return ErrValidation
	}
	return nil
}

func saveFileToDisk(file multipart.File, filePath string) error {
	f, err := os.Create(filePath)
	if err != nil {
		return ErrFileCreate
	}
	defer f.Close()

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return ErrSystem
	}

	if _, err := io.Copy(f, file); err != nil {
		return ErrSystem
	}
	return nil
}
