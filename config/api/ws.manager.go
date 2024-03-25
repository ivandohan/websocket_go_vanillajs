package api

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
)

var (
	webSocketUpgrader = websocket.Upgrader{
		CheckOrigin:     checkOrigin,
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	ErrorEventNotSupported = errors.New("this event type is not supported.")
)

type Manager struct {
	clients ClientList
	sync.RWMutex

	handlers map[string]func(event Event, c *Client) error
}

func NewManager() *Manager {
	m := &Manager{
		clients:  make(ClientList),
		handlers: make(map[string]func(event Event, c *Client) error),
	}

	m.setupEventHandlers()

	return m
}

func (m *Manager) setupEventHandlers() {
	m.handlers[EventSendMessage] = func(e Event, c *Client) error {
		fmt.Println("[INFO] [setupEventHandlers - Manager] :", e)
		return nil
	}
}

func (m *Manager) routeEvent(event Event, c *Client) error {
	// Check if Handler is present in Map
	if handler, ok := m.handlers[event.Type]; ok {
		// Execute the handler and return any err
		if err := handler(event, c); err != nil {
			return err
		}
		return nil
	} else {
		return ErrorEventNotSupported
	}
}

func (m *Manager) serveWS(w http.ResponseWriter, r *http.Request) {
	log.Println("New connection...")

	conn, err := webSocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[ERROR] [serveWS-Manager] :", err)
		return
	}

	client := NewClient(conn, m)

	m.addClient(client)

	go client.readMessages()
	go client.writeMessages()
}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.clients[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.clients[client]; ok {
		_ = client.connection.Close()

		delete(m.clients, client)
	}
}
