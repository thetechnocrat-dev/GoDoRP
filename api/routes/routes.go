package routes

import (
	"fmt"
	"github.com/McMenemy/GoDoRP_stack/api/services/database"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func DbTestHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var lastDorp database.Dorp
	database.DB.Last(&lastDorp)
	fmt.Fprintf(w, "Author : %s, Message: %s", lastDorp.Author, lastDorp.Message)
}

func IndexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w, "This is the RESTful api")
}
