package main

import (
	"database"
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"os"
)

// CRUD Route Handlers
func createDorpHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	var newDorp database.Dorp
	if err := decoder.Decode(&newDorp); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	database.DB.Create(&newDorp)
	res, err := json.Marshal(newDorp)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func deleteDorpHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var deletedDorp database.Dorp
	database.DB.Where("ID = ?", ps.ByName("dorpId")).Delete(&deletedDorp) // write now this returns a blank item not the deleted item
	res, err := json.Marshal(deletedDorp)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	w.Write(res)
}

func updateDorpHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	type body struct {
		Author  string
		Message string
	}
	var updates body
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&updates); err != nil {
		http.Error(w, err.Error(), 400)
	}

	var updatedDorp database.Dorp
	database.DB.Where("ID = ?", ps.ByName("dorpId")).First(&updatedDorp)
	updatedDorp.Author = updates.Author
	updatedDorp.Message = updates.Message
	database.DB.Save(&updatedDorp)
	res, err := json.Marshal(updatedDorp)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	w.Write(res)
}

func showDorpHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var dorp database.Dorp
	database.DB.Where("ID = ?", ps.ByName("dorpId")).First(&dorp)
	res, err := json.Marshal(dorp)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func indexDorpHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var dorps []database.Dorp
	database.DB.Find(&dorps)
	res, err := json.Marshal(dorps)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w, "This is the RESTful api")
}

func main() {
	defer database.DB.Close()

	// add router and routes
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.POST("/dorp", createDorpHandler)
	router.GET("/dorp/:dorpId", showDorpHandler)
	router.DELETE("/dorp/:dorpId", deleteDorpHandler)
	router.PUT("/dorp/:dorpId", updateDorpHandler)
	router.GET("/dorps", indexDorpHandler)

	// add database
	_, err := database.Init()
	if err != nil {
		log.Println("connection to DB failed, aborting...")
		log.Fatal(err)
	}

	log.Println("connected to DB")

	// print env
	env := os.Getenv("APP_ENV")
	if env == "production" {
		log.Println("Running api server in production mode")
	} else {
		log.Println("Running api server in dev mode")
	}

	http.ListenAndServe(":8080", router)
}
