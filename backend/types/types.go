package types

import "time"

type EmailData struct {
	To       string
	Username string
	Url      string
}

type JWTPayload struct {
	UserId    string
	Username  string
	Email     string
	ExpiresAt time.Time
}
