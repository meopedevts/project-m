package router

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/meopedevts/project-m/types"
	"github.com/meopedevts/project-m/utils"
)

type LoginData struct {
	Email string `json:"email"`
}

func LoginUser(routing *gin.Engine, db *pgxpool.Pool) {
	routing.POST("/auth/login", func(c *gin.Context) {
		var loginData LoginData
		if err := c.BindJSON(&loginData); err != nil {
			c.String(http.StatusUnprocessableEntity, "Dados do payload inválidos.")
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var jwtPayload types.JWTPayload
		rowUser := db.QueryRow(ctx, "SELECT id, first_name || ' ' || last_name AS username, email FROM users WHERE email = $1", loginData.Email)
		if err := rowUser.Scan(&jwtPayload.UserId, &jwtPayload.Username, &jwtPayload.Email); err != nil {
			c.String(http.StatusNotFound, "Usuário não encontrado.")
			return
		}
		jwtPayload.ExpiresAt = time.Now().AddDate(0, 0, 3)

		jwtToken, err := utils.GenerateJWT(jwtPayload)
		if err != nil {
			c.String(http.StatusInternalServerError, "Erro durante a geração do JWT de autenticação.")
			return
		}

		var oldSessionExpires time.Time
		row := db.QueryRow(ctx, "SELECT expires_at FROM user_token WHERE email = $1", jwtPayload.Email)
		if err := row.Scan(&oldSessionExpires); err != nil {
			_, errDb := db.Exec(ctx, "INSERT INTO user_token VALUES ($1, $2, $3, $4, $5)",
				&jwtToken, &jwtPayload.UserId, &jwtPayload.Username, jwtPayload.Email, jwtPayload.ExpiresAt,
			)
			if errDb != nil {
				c.String(http.StatusInternalServerError, "Erro durante a inserção do JWT no banco de dados.")
				return
			}
		} else {
			_, errDb := db.Exec(ctx, "UPDATE user_token SET jwt_token = $1, expires_at = $2 WHERE email = $3",
				&jwtToken, jwtPayload.ExpiresAt, jwtPayload.Email,
			)
			if errDb != nil {
				c.String(http.StatusInternalServerError, "Erro durante a atualização do JWT no banco de dados.")
				return
			}
		}

		emailData := types.EmailData{
			To:       jwtPayload.Email,
			Username: jwtPayload.Username,
			Url:      utils.GenerateAuthUrl(jwtToken),
		}

		utils.SendEmail(emailData)

		c.String(http.StatusNoContent, "")
	})
}
