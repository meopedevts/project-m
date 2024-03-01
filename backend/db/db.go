package db

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func DbFactory() *pgxpool.Pool {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	poolConfig, err := pgxpool.ParseConfig("postgres://project:project1211@192.168.100.3:5432/project-db")
	if err != nil {
		log.Fatal(err.Error())
	}
	poolConfig.MaxConns = 20
	poolConfig.MinConns = 5

	conn, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		log.Fatal(err.Error())
	}

	return conn
}
