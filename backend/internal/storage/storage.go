package storage

type ImageStorage struct {
	path     string
	tempPath string
}

func New(path, tempPath string) *ImageStorage {
	return &ImageStorage{path, tempPath}
}

func (s *ImageStorage) GetFullPath(destination string) string {
	return s.path + "/" + destination
}
func (s *ImageStorage) GetFullTempPath(destination string) string {
	return s.tempPath + "/" + destination
}
