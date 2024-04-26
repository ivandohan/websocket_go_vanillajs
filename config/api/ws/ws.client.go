package ws

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"time"
	wsentity "websocket-message-sample/entity/ws"
)

type ClientList map[*Client]bool

var (
	pongWait     = 10 * time.Second
	pingInterval = (pongWait * 9) / 10
)

type Client struct {
	connection *websocket.Conn
	manager    *Manager

	// egress is used to avoid concurrent writes on the websocket
	egress chan wsentity.Event

	chatroom string
}

func NewClient(conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		connection: conn,
		manager:    manager,
		egress:     make(chan wsentity.Event),
	}
}

func (c *Client) readMessages() {
	defer func() {
		// Graceful close connection once this function is done
		c.manager.removeClient(c)
	}()

	c.connection.SetReadLimit(512)

	if err := c.connection.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		log.Println("[ERROR] [readMessages - PingPong] :", err)
		return
	}

	c.connection.SetPongHandler(c.pongHandler)

	// Read next messages in queue in the connection
	for {
		_, payload, err := c.connection.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading message-ui: %v\n", err)
			}

			break
		}

		var request wsentity.Event
		if err := json.Unmarshal(payload, &request); err != nil {
			log.Println("[ERROR] [readMessages - Client] :", err)
			break
		}

		log.Println("[INFO] [readMessage - Client] Request contains:", request)

		if err := c.manager.routeEvent(request, c); err != nil {
			log.Println("[ERROR] [readMessages - Client] Error handling message-ui :", err)
		}
		//fmt.Println("[INFO] [readMessages - Client] Message Type:", messageType)
		fmt.Println("[INFO] [readMessages - Client] Payload:", string(payload))
	}
}

func (c *Client) pongHandler(pongMsg string) error {
	// Current time + Pong Wait time
	log.Println("pong")
	return c.connection.SetReadDeadline(time.Now().Add(pongWait))
}

func (c *Client) writeMessages() {
	ticker := time.NewTicker(pingInterval)

	defer func() {
		ticker.Stop()
		c.manager.removeClient(c)
	}()

	for {
		select {
		case message, ok := <-c.egress:
			{
				// Manager has closed this connection channel, so notify the frontend
				if !ok {
					if err := c.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
						log.Println("[ERROR] [writeMessages - Client] :", err)
					}
					return
				}

				data, err := json.Marshal(message)
				if err != nil {
					log.Println("[ERROR] [writeMessages - Client] :", err)
					return
				}

				// Else, write regular message-ui to the connection
				if err := c.connection.WriteMessage(websocket.TextMessage, data); err != nil {
					log.Println("[ERROR] [writeMessages - Client] :", err)
				}

				log.Println("[PROCESS] [writeMessages - Client] : Sent message-ui")
			}
		case <-ticker.C:
			{
				log.Println("[TICKER] Ping")

				if err := c.connection.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
					log.Println("[ERROR] [writeMessages - Pingpong] : ", err)
					return
				}
			}
		}
	}
}
