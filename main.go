package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/submit", submitHandler).Methods("POST")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./")))
	log.Fatal(http.ListenAndServe(":8080", router))
}

func getClient() (*sheets.Service, error) {
	// Read the JSON key file you downloaded from the Google Developers Console
	file, err := os.ReadFile("./assets/vendor/nextgen-form/credentials.json")
	if err != nil {
		return nil, err
	}

	// Parse the JSON key data
	config, err := google.JWTConfigFromJSON(file, sheets.SpreadsheetsScope)
	if err != nil {
		return nil, err
	}

	client := config.Client(context.Background())

	// Create a Google Sheets service client
	srv, err := sheets.NewService(context.Background(), option.WithHTTPClient(client))
	if err != nil {
		return nil, err
	}

	return srv, nil
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Initialize the Google Sheets service client
	srv, err := getClient()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Parse JSON data from the request body
	var data map[string]interface{}
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Specify the spreadsheet ID and range
	spreadsheetID := "1u0uMuGDdUoU2odtwKuUot_UDqPNLndJWRl6U73lJXHY"
	rangeName := "Sheet1"

	// Convert the data to a slice of interfaces
	values := []interface{}{data["first_name"], data["last_name"], data["company_name"], data["business_email"], data["country"], data["phone_number"], data["message"] }

	// Create a value range for the data
	valueRange := &sheets.ValueRange{
		Values: [][]interface{}{values},
	}

	// Update the spreadsheet with the form data
	_, err = srv.Spreadsheets.Values.Append(spreadsheetID, rangeName, valueRange).ValueInputOption("RAW").Context(r.Context()).Do()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return a success response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data submitted successfully!"))
}
