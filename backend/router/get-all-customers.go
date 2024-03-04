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

func GetAllCustomers(routing *gin.Engine, db *pgxpool.Pool) {
	routing.GET("/customers", func(c *gin.Context) {
		var customers []types.CustomerResponse

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		rows, err := db.Query(ctx, "SELECT * FROM customers ORDER BY customer_id")
		if err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusInternalServerError,
				Cause:   "select",
				Message: "Erro durante a consulta de clientes",
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
			var customer types.CustomerResponse
			if err := rows.Scan(&customer.CustomerId, &customer.Company, &customer.Email, &customer.Phone, &customer.CreatedAt, &customer.UpdatedAt); err != nil {
				rawResponseError := types.ResponseError{
					Status:  http.StatusInternalServerError,
					Cause:   "select",
					Message: "Erro durante a consulta de clientes",
				}
				serializedResponseError, err := utils.Serialize(rawResponseError)
				if err != nil {
					c.String(http.StatusInternalServerError, err.Error())
					return
				}

				c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
				return
			}
			customers = append(customers, customer)
		}
		if err := rows.Err(); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusInternalServerError,
				Cause:   "select",
				Message: "Erro durante a consulta de clientes",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedCustomers, err := utils.Serialize(&customers)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusOK, "application/json", serializedCustomers)
	})
}
