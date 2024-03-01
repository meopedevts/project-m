package main

import (
	"github.com/meopedevts/project-m/db"
	"github.com/meopedevts/project-m/routing"
)

func main() {
	conn := db.DbFactory()

	routing.OpenHandlers(conn)
}
