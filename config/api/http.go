package api

import "net/http"

func SetUp() {
	wsManager := NewManager()
	defineRoutes(wsManager)
}

func defineRoutes(wsManager *Manager) {
	http.Handle("/", http.FileServer(http.Dir("./cmd/client")))
	http.HandleFunc("/ws", wsManager.serveWS)
}

func checkOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")

	switch origin {
	case "http:://localhost:8080":
		return true
	default:
		return false
	}
}
