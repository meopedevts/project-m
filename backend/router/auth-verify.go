package router

import (
	"context"
	"net/http"
	"time"

	"github.com/bytedance/sonic"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VerifyPayload struct {
	Token string `json:"token"`
}

type SessionData struct {
	Id        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"expires_at"`
}

func AuthVerify(routing *gin.Engine, db *pgxpool.Pool) {
	routing.POST("/auth/verify", func(c *gin.Context) {
		var verifyPayload VerifyPayload
		if err := c.BindJSON(&verifyPayload); err != nil {
			c.String(http.StatusBadRequest, "Dados do payload inválidos.")
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var sessionData SessionData
		row := db.QueryRow(ctx, "SELECT user_id, username, email, timezone('America/Sao_Paulo', expires_at) as expires_at FROM user_token WHERE jwt_token = $1", verifyPayload.Token)
		if err := row.Scan(&sessionData.Id, &sessionData.Username, &sessionData.Email, &sessionData.ExpiresAt); err != nil {
			c.String(http.StatusNotFound, "Token não encontrado.")
			return
		}

		if time.Now().After(sessionData.ExpiresAt) {
			c.String(http.StatusUnauthorized, "Token expirado. ")
			return
		}

		sessionDataResponse, err := sonic.Marshal(&sessionData)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusOK, "application/json", sessionDataResponse)
	})
}
