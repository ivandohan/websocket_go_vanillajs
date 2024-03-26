package main

import (
	"context"
	"log"
	"net/http"
	httpconf "websocket-message-sample/config/api/http"
)

func main() {
	rootCtx := context.Background()
	ctx, cancel := context.WithCancel(rootCtx)

	defer cancel()

	httpconf.SetUp(ctx)

	err := http.ListenAndServeTLS(":8080", "./cmd/security/server.crt", "./cmd/security/server.key", nil)
	if err != nil {
		log.Fatal("[ERROR] [main api] :", err)
	}
}
