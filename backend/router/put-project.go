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

func PutProject(routing *gin.Engine, db *pgxpool.Pool) {
	routing.PUT("/projects/:id", func(c *gin.Context) {
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

		var projectPayload types.ProjectPutPayload
		if err := c.BindJSON(&projectPayload); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "payload",
				Message: "Dados do projeto incorretos",
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
		rowProject := db.QueryRow(ctx, `UPDATE projects SET title = $1, description = $2, customer_id = $3, dt_initial = $4, dt_final = $5 WHERE project_id = $6
			RETURNING project_id, title, description, customer_id, dt_initial, dt_final`,
			projectPayload.Title, projectPayload.Description, projectPayload.CustomerId, projectPayload.DtInitial, projectPayload.DtFinal, id,
		)
		if err := rowProject.Scan(
			&project.ProjectId,
			&project.Title,
			&project.Description,
			&project.CustomerId,
			&project.DtInitial,
			&project.DtFinal,
		); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "update",
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

		serializedProject, err := utils.Serialize(project)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusCreated, "application/json", serializedProject)
	})
}
