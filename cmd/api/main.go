package main

import (
	"log"
	"net/http"
	"websocket-message-sample/config/api"
)

func main() {
	api.SetUp()

	log.Fatal(http.ListenAndServe(":8080", nil))
}
