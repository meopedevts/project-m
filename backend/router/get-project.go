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

func GetProject(routing *gin.Engine, db *pgxpool.Pool) {
	routing.GET("/projects/:id", func(c *gin.Context) {
		projectId, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.String(http.StatusBadRequest, "Parâmetro inválido")
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var project types.ProjectResponse
		row := db.QueryRow(ctx, "SELECT * FROM customers WHERE customer_id = $1", projectId)
		if err := row.Scan(
			&project.ProjectId,
			&project.Title,
			&project.Description,
			&project.CustomerId,
			&project.DtInitial,
			&project.DtFinal,
		); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusNotFound,
				Cause:   "select",
				Message: "Projeto não encontrado",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedProject, err := utils.Serialize(&project)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusOK, "application/json", serializedProject)
	})
}
