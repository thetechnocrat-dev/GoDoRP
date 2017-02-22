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
	setCors(w)
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
	setCors(w)
	var deletedDorp database.Dorp
	database.DB.Where("ID = ?", ps.ByName("dorpId")).Delete(&deletedDorp) // write now this returns a blank item not the deleted item
	res, err := json.Marshal(deletedDorp)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	w.Write(res)
}

func updateDorpHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	setCors(w)
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
	setCors(w)
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
	setCors(w)
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
	setCors(w)
	fmt.Fprintf(w, "This is the RESTful api")
}

// used for COR preflight checks
func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
}

// util
func getFrontendUrl() string {
	if os.Getenv("APP_ENV") == "production" {
		return "http://localhost:3000" // change this to production domain
	} else {
		return "http://localhost:3000"
	}
}

func setCors(w http.ResponseWriter) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// Temporary Canary test to make sure Travis-CI is working
func Canary(word string) string {
	return word
}

func main() {
	defer database.DB.Close()

	// add router and routes
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.POST("/dorps", createDorpHandler)
	router.GET("/dorps/:dorpId", showDorpHandler)
	router.DELETE("/dorps/:dorpId", deleteDorpHandler)
	router.PUT("/dorps/:dorpId", updateDorpHandler)
	router.GET("/dorps", indexDorpHandler)
	router.OPTIONS("/*any", corsHandler)

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
