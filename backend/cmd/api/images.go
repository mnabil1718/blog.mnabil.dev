package main

import (
	"errors"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/validator"
	"golang.org/x/image/bmp"
	"golang.org/x/image/tiff"
	"golang.org/x/image/webp"
)

var CONTENT_DECODERS = map[string](func(r io.Reader) (image.Config, error)){
	"image/jpeg": jpeg.DecodeConfig,
	"image/png":  png.DecodeConfig,
	"image/gif":  gif.DecodeConfig,
	"image/tiff": tiff.DecodeConfig,
	"image/webp": webp.DecodeConfig,
	"image/bmp":  bmp.DecodeConfig,
}

func (app *application) uploadImagesHandler(w http.ResponseWriter, r *http.Request) {
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	defer file.Close()

	// Read the first 512 bytes to determine MIME type
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	fileType := http.DetectContentType(buffer)
	decoder, ok := CONTENT_DECODERS[fileType]
	if !ok {
		app.badRequestResponse(w, r, errors.New("unsupported image format"))
		return
	}

	// Seek back to the start of the file for reading the full file
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Decode the image to get dimensions
	imageConfig, err := decoder(file)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	width := imageConfig.Width
	height := imageConfig.Height

	// Determine the correct file extension based on content type
	extension := map[string]string{
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/gif":  ".gif",
		"image/tiff": ".tif",
		"image/webp": ".webp",
		"image/bmp":  ".bmp",
	}[fileType]

	if extension == "" {
		app.badRequestResponse(w, r, errors.New("unsupported image format"))
		return
	}

	fileSize := fileHeader.Size
	// TODO: fix filename generation to exclude extension
	filename := generateFileName(fileHeader.Filename)
	destination := filename + extension

	image := &data.Image{
		FileName:    filename,
		Alt:         filename,
		Destination: destination,
		Size:        int32(fileSize),
		Width:       int32(width),
		Height:      int32(height),
		ContentType: fileType,
	}

	v := validator.New()
	if data.ValidateImage(v, image); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = os.MkdirAll(app.config.upload.path, 0755) // Set directory permissions to 0755
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	filePath := filepath.Join(app.config.upload.path, destination)
	f, err := os.Create(filePath)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	defer f.Close()

	// important, seek pointer to the start again after decoding image
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	_, err = io.Copy(f, file)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.models.Images.Insert(image)
	if err != nil {
		if errors.Is(err, data.ErrDuplicateFileName) {
			v.AddError("file_name", "name already exists")
			app.failedValidationResponse(w, r, v.Errors)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/images/%d", image.ID))

	err = app.writeJSON(w, http.StatusCreated, envelope{"image": image}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
