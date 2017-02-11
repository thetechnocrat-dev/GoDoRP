package main

import (
	"github.com/McMenemy/GoDoRP_stack/routes"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"os"
)

func main() {
	router := httprouter.New()
	router.GET("/", routes.IndexHandler)
	router.OPTIONS("/*any", routes.CorsHandler)
	router.POST("/align", routes.AlignHandler)

	env := os.Getenv("APP_ENV")
	if env == "production" {
		log.Println("Running api server in production mode")
	} else {
		log.Println("Running api server in dev mode")
	}

	http.ListenAndServe(":8080", router)
}
