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

type GetCustomerPayload struct {
	Email string `json:"email"`
}

func GetCustomer(routing *gin.Engine, db *pgxpool.Pool) {
	routing.GET("/customers/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.String(http.StatusBadRequest, "Parâmetro inválido")
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var customer types.CustomerResponse
		row := db.QueryRow(ctx, "SELECT * FROM customers WHERE customer_id = $1", id)
		if err := row.Scan(
			&customer.CustomerId,
			&customer.Company,
			&customer.Email,
			&customer.Phone,
			&customer.CreatedAt,
			&customer.UpdatedAt,
		); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusNotFound,
				Cause:   "select",
				Message: "Cliente não encontrado",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedCustomer, err := utils.Serialize(&customer)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusOK, "application/json", serializedCustomer)
	})
}
