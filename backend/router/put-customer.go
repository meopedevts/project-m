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

func PutCustomer(routing *gin.Engine, db *pgxpool.Pool) {
	routing.PUT("/customers/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusNotFound,
				Cause:   "request",
				Message: "Cliente não encontrado.",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
			c.Data(http.StatusNotFound, "application/json", serializedResponseError)
			return
		}

		var customerPayload types.CustomerRequest
		if err := c.BindJSON(&customerPayload); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "payload",
				Message: "Dados do parceiro incorretos",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}
			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		if len(customerPayload.Email) == 0 {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "email",
				Message: "O campo e-mail deve ser informado",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}
			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		if len(customerPayload.Company) == 0 {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "company",
				Message: "O campo empresa deve ser informado",
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

		var customer types.CustomerResponse
		rowCustomer := db.QueryRow(ctx, `UPDATE customers SET company = $1, email = $2, phone = $3, updated_at = $4 WHERE customer_id = $5
			RETURNING customer_id, company, email, phone, created_at, updated_at`,
			customerPayload.Company, customerPayload.Email, customerPayload.Phone, time.Now(), id,
		)
		if err := rowCustomer.Scan(&customer.CustomerId, &customer.Company, &customer.Email, &customer.Phone, &customer.CreatedAt, &customer.UpdatedAt); err != nil {
			rawResponseError := types.ResponseError{
				Status:  http.StatusBadRequest,
				Cause:   "update",
				Message: "Já existe um cliente cadastrado com este email",
			}
			serializedResponseError, err := utils.Serialize(rawResponseError)
			if err != nil {
				c.String(http.StatusInternalServerError, err.Error())
				return
			}

			c.Data(http.StatusBadRequest, "application/json", serializedResponseError)
			return
		}

		serializedCustomer, err := utils.Serialize(customer)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.Data(http.StatusCreated, "application/json", serializedCustomer)
	})
}
