package storage

import (
	"errors"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/utils"
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

type ImageStorage struct {
	path     string
	tempPath string
}

func New(path, tempPath string) (*ImageStorage, error) {

	for _, item := range []string{path, tempPath} {
		if err := os.MkdirAll(item, 0755); err != nil { // Set directory permissions to 0755
			return nil, fmt.Errorf("failed to create directory %s: %w", item, err)
		}
	}

	return &ImageStorage{path, tempPath}, nil
}

func (s *ImageStorage) GetFullPath(destination string) string {
	return s.path + "/" + destination
}
func (s *ImageStorage) GetFullTempPath(destination string) string {
	return s.tempPath + "/" + destination
}

func (s *ImageStorage) SaveTemp(file multipart.File, fileHeader multipart.FileHeader, path string, v *validator.Validator) (*data.Image, error) {
	// Read the first 512 bytes to determine MIME type
	buffer := make([]byte, 512)
	if _, err := file.Read(buffer); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrFileRead, err)
	}

	fileType := http.DetectContentType(buffer)
	decoder, ok := CONTENT_DECODERS[fileType]
	if !ok {
		return nil, ErrUnsupportedFormat
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSystem, err)
	}

	imageConfig, err := decoder(file)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidImage, err)
	}
	width := imageConfig.Width
	height := imageConfig.Height

	extension := EXT_MAP[fileType]
	if extension == "" {
		return nil, ErrUnsupportedFormat
	}

	fileSize := fileHeader.Size
	filename := utils.GenerateFileName(fileHeader.Filename)
	destination := filename + extension

	image := &data.Image{
		FileName:    filename,
		Alt:         filename,
		Destination: destination,
		Size:        int32(fileSize),
		Width:       int32(width),
		Height:      int32(height),
		ContentType: fileType,
		IsTemp:      true,
	}

	if data.ValidateImage(v, image); !v.Valid() {
		return nil, ErrValidation
	}

	filePath := filepath.Join(path, destination)
	f, err := os.Create(filePath)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrFileCreate, err)
	}
	defer f.Close()

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSystem, err)
	}

	if _, err = io.Copy(f, file); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSystem, err)
	}

	return image, nil
}
