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

type ProjectPostPayload struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CustomerId  int       `json:"customer_id"`
	DtInitial   time.Time `json:"dt_initial"`
}

type ProjectPutPayload struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CustomerId  int       `json:"customer_id"`
	DtInitial   time.Time `json:"dt_initial"`
	DtFinal     time.Time `json:"dt_final"`
}

/*
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL,
    title VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),
    customer_id INT,
    dt_start_project TIMESTAMP NULL,
    dt_finish_project TIMESTAMP NULL,
    CONSTRAINT projects_pk PRIMARY KEY (project_id)
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
*/

type ProjectResponse struct {
	ProjectId   int       `json:"project_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CustomerId  int       `json:"customer_id"`
	DtInitial   time.Time `json:"dt_initial"`
	DtFinal     time.Time `json:"dt_final"`
}
