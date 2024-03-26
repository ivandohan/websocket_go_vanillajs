package http

import (
	"context"
	"fmt"
	"net/http"
	ascii "websocket-message-sample/assets"
	wsConf "websocket-message-sample/config/api/ws"
)

func SetUp(ctx context.Context) {
	wsManager := wsConf.NewManager(ctx)
	defineRoutes(wsManager)

	fmt.Println(asciiForStartingConsole())

	fmt.Println("Starting up server...")
	fmt.Println("Server running on http://localhost:8080")
	fmt.Println("[SERVER LOG] -->")
}

func defineRoutes(wsManager *wsConf.Manager) {
	http.Handle("/", http.FileServer(http.Dir("./cmd/client")))
	http.HandleFunc("/ws", wsManager.ServeWS)
	http.HandleFunc("/login", wsManager.LoginManager)

	http.HandleFunc("/debug", func(w http.ResponseWriter, r *http.Request) {
		_, _ = fmt.Fprint(w, len(wsManager.Clients))
	})
}

func asciiForStartingConsole() string {
	return ascii.Cat()
}
