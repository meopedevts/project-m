package routing

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/meopedevts/project-m/router"
)

func OpenHandlers(db *pgxpool.Pool) {
	routing := gin.Default()
	routing.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	})
	router.RegisterUser(routing, db)
	router.LoginUser(routing, db)
	router.AuthVerify(routing, db)
	router.PostCustomer(routing, db)
	router.GetCustomer(routing, db)
	router.GetAllCustomers(routing, db)
	router.PutCustomer(routing, db)
	router.DeleteCustomer(routing, db)

	routing.Run(":8080")
}
