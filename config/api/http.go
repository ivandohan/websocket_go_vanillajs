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
