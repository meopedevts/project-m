package router

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/meopedevts/project-m/types"
	"github.com/meopedevts/project-m/utils"
)

func DeleteProject(routing *gin.Engine, db *pgxpool.Pool) {
	routing.DELETE("/project/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusNotFound,
				Cause:   "request",
				Message: "Projeto não encontrado.",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
			c.Data(http.StatusNotFound, "application/json", serializedResponseError)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		_, err = db.Exec(ctx, "DELETE FROM projects WHERE project_id = $1", id)
		if err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusNotFound,
				Cause:   "delete",
				Message: "Não possível excluir o projeto.",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
			c.Data(http.StatusNotFound, "application/json", serializedResponseError)
			return
		}

		c.String(http.StatusOK, strconv.Itoa(id))
	})
}
