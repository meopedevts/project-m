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

type ResponseError struct {
	Status  int    `json:"status"`
	Cause   string `json:"cause"`
	Message string `json:"message"`
}

type CustomerResponse struct {
	CustomerId int       `json:"customer_id"`
	Company    string    `json:"company"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type CustomerRequest struct {
	Company string `json:"company"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
}
