package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type UsersModelInterface interface {
	Insert(user *User) error
	GetByEmail(email string) (*User, error)
	Update(user *User) error
	GetForToken(scope string, tokenPlainText string) (*User, error)
}

type Models struct {
	Users       UsersModelInterface
	Tokens      TokenModel
	Permissions PermissionModel
	Posts       PostModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:       UserModel{DB: db},
		Tokens:      TokenModel{DB: db},
		Permissions: PermissionModel{DB: db},
		Posts:       PostModel{DB: db},
	}
}
