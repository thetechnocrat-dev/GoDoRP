package main

import (
	"github.com/McMenemy/GoDoRP_stack/api/routes"
	"github.com/McMenemy/GoDoRP_stack/api/services/database"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"os"
)

func main() {
	defer database.DB.Close()
	router := httprouter.New()
	router.GET("/", routes.IndexHandler)
	router.GET("/dbTest", routes.DbTestHandler)

	_, err := database.Init()
	if err != nil {
		log.Println("connection to DB failed, aborting...")
		log.Fatal(err)
	}

	log.Println("connected to DB")

	env := os.Getenv("APP_ENV")
	if env == "production" {
		log.Println("Running api server in production mode")
	} else {
		log.Println("Running api server in dev mode")
	}

	http.ListenAndServe(":8080", router)
}
