package routes

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func IndexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w, "This is the RESTful api")
}
