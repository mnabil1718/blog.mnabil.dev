package storage

type ImageStorage struct {
	path string
}

func New(path string) *ImageStorage {
	return &ImageStorage{path: path}
}
