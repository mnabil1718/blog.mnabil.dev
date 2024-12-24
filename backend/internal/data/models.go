package data

import (
	"database/sql"
	"encoding/json"
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
	Images      ImageModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:       UserModel{DB: db},
		Tokens:      TokenModel{DB: db},
		Permissions: PermissionModel{DB: db},
		Posts:       PostModel{DB: db},
		Images:      ImageModel{DB: db},
	}
}

type NullString sql.NullString

// MarshalJSON method is called by json.Marshal,
// whenever it is of type NullString
func (field *NullString) MarshalJSON() ([]byte, error) {
	if !field.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(field.String)
}
