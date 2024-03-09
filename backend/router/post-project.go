package router

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/meopedevts/project-m/types"
	"github.com/meopedevts/project-m/utils"
)

func PostProject(routing *gin.Engine, db *pgxpool.Pool) {
	routing.POST("/projects", func(c *gin.Context) {
		var projectPostPayload types.ProjectPostPayload
		if err := c.BindJSON(&projectPostPayload); err != nil {
			rawResponseError := types.ResponseError{
				Status: http.StatusBadRequest,
				Cause:  "payload",
				// Message: "Dados do projeto incorretos",
				Message: err.Error(),
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}
			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var project types.ProjectResponse
		rowProject := db.QueryRow(ctx, `INSERT INTO projects (title, description, customer_id, dt_initial) VALUES ($1, $2, $3, $4)
			RETURNING project_id, title, description, customer_id, dt_initial, dt_final`,
			projectPostPayload.Title, projectPostPayload.Description, projectPostPayload.CustomerId, projectPostPayload.DtInitial)

		if err := rowProject.Scan(&project.ProjectId, &project.Title, &project.Description, &project.CustomerId,
			&project.DtInitial, &project.DtFinal); err != nil {
			var rawResponseError types.ResponseError
			if strings.Contains(err.Error(), "violates foreign key constraint") {
				rawResponseError = types.ResponseError{
					Status:  http.StatusBadRequest,
					Cause:   "insert",
					Message: "Cliente informado não existe",
				}
			} else {
				rawResponseError = types.ResponseError{
					Status:  http.StatusBadRequest,
					Cause:   "insert",
					Message: err.Error(),
				}
			}

			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedProject, err := utils.Serialize(project)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusCreated, "application/json", serializedProject)
	})
}
