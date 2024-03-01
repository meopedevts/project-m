package router

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RegisterData struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

func RegisterUser(routing *gin.Engine, db *pgxpool.Pool) {
	routing.POST("/auth/register", func(c *gin.Context) {
		var registerData RegisterData
		if err := c.BindJSON(&registerData); err != nil {
			c.String(http.StatusUnprocessableEntity, "Dados do payload inválidos.")
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var id *string
		rowUser := db.QueryRow(ctx, "SELECT id FROM users WHERE email = $1", registerData.Email)
		if err := rowUser.Scan(&id); err != nil {
			id = nil
		}

		if id != nil {
			c.String(http.StatusUnprocessableEntity, "Já existe um usuário cadastrado com este e-mail.")
			return
		}

		_, err := db.Exec(ctx, "INSERT INTO users (first_name, last_name, email, created_at) VALUES ($1, $2, $3, $4)",
			&registerData.FirstName, &registerData.LastName, &registerData.Email, time.Now(),
		)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.String(http.StatusNoContent, "")
	})
}
