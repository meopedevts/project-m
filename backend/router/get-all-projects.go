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

func GetAllProjects(routing *gin.Engine, db *pgxpool.Pool) {
	routing.GET("projects", func(c *gin.Context) {
		var projects []types.ProjectResponse

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		rows, err := db.Query(ctx, "SELECT * FROM projects ORDER BY customer_id")
		if err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusInternalServerError,
				Cause:   "select",
				Message: "Erro durante a consulta de projetos",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var project types.ProjectResponse
			if err := rows.Scan(&project.CustomerId, &project.Title, &project.Description, &project.CustomerId, &project.DtInitial, &project.DtFinal); err != nil {
				rawResponseError := types.ResponseError{
					Status:  http.StatusInternalServerError,
					Cause:   "select",
					Message: "Erro durante a consulta de projetos",
				}
				serializedResponseError, err := utils.Serialize(rawResponseError)
				if err != nil {
					c.String(http.StatusInternalServerError, err.Error())
					return
				}

				c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
				return
			}
			projects = append(projects, project)
		}
		if err := rows.Err(); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusInternalServerError,
				Cause:   "select",
				Message: "Erro durante a consulta de projetos",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedProjects, err := utils.Serialize(&projects)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusOK, "application/json", serializedProjects)
	})
}
