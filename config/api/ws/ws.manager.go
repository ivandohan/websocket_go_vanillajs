package ws

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
	"time"
	"websocket-message-sample/entity/login"
	wsentity "websocket-message-sample/entity/ws"
)

type EventHandler func(event wsentity.Event, c *Client) error

var (
	webSocketUpgrader = websocket.Upgrader{
		CheckOrigin:     CheckOrigin,
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	ErrorEventNotSupported = errors.New("this event type is not supported.")
)

func CheckOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")

	fmt.Println("[INFO] [checkOrigin - HTTP] :", origin)

	switch origin {
	case "https://localhost:8080":
		return true
	default:
		return false
	}
}

type Manager struct {
	Clients ClientList
	sync.RWMutex
	handlers map[string]EventHandler
	otps     RetentionMap
}

func NewManager(ctx context.Context) *Manager {
	m := &Manager{
		Clients:  make(ClientList),
		handlers: make(map[string]EventHandler),
		otps:     NewRetentionMap(ctx, time.Second*5),
	}

	m.setupEventHandlers()

	return m
}

func SendMessageHandler(event wsentity.Event, c *Client) error {
	var chatEvent wsentity.SendMessageEvent
	if err := json.Unmarshal(event.Payload, &chatEvent); err != nil {
		return fmt.Errorf("[ERROR] [SendMessageHandler - Manager] : %v\n", err)
	}

	var broadMessage wsentity.NewMessageEvent

	broadMessage.Sent = time.Now()
	broadMessage.Message = chatEvent.Message
	broadMessage.From = chatEvent.From

	data, err := json.Marshal(broadMessage)
	if err != nil {
		return fmt.Errorf("[ERROR] [SendMessageHandler - Manager] : Failed to marshal broadcast message, %v\n", err)
	}

	var outgoingEvent wsentity.Event
	outgoingEvent.Payload = data
	outgoingEvent.Type = wsentity.EventNewMessage

	for client := range c.manager.Clients {
		if client.chatroom == c.chatroom {
			client.egress <- outgoingEvent
		}
	}

	return nil
}

func ChatRoomHandler(event wsentity.Event, c *Client) error {
	var changeRoomEvent wsentity.ChangeRoomEvent
	if err := json.Unmarshal(event.Payload, &changeRoomEvent); err != nil {
		return fmt.Errorf("[ERROR] [ChatRoomHandler - Manager] : Bad payload in request, %v", err)
	}

	c.chatroom = changeRoomEvent.Name

	return nil
}

func (m *Manager) LoginManager(w http.ResponseWriter, r *http.Request) {
	var loginRequest login.UserLoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		http.Error(w, "[ERROR] [LoginManager - WsManager]"+err.Error(), http.StatusBadRequest)
		return
	}

	if loginRequest.Username == "dohan" && loginRequest.Password == "dohanwiuwiu" {
		otp := m.otps.NewOTP()

		response := login.UserLoginResponse{
			OTP: otp.Key,
		}

		data, err := json.Marshal(response)
		if err != nil {
			log.Println("[ERROR] [LoginManager - Manager] :", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(data)

		return
	}

	w.WriteHeader(http.StatusUnauthorized)
}

func (m *Manager) setupEventHandlers() {
	m.handlers[wsentity.EventSendMessage] = SendMessageHandler
	m.handlers[wsentity.EventChangeRoom] = ChatRoomHandler
}

func (m *Manager) routeEvent(event wsentity.Event, c *Client) error {
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

func (m *Manager) ServeWS(w http.ResponseWriter, r *http.Request) {
	otp := r.URL.Query().Get("otp")
	if otp == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !m.otps.VerifyOTP(otp) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	log.Println("New connection...")

	conn, err := webSocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[ERROR] [serveWS - Manager]", err)
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

	m.Clients[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.Clients[client]; ok {
		_ = client.connection.Close()

		delete(m.Clients, client)
	}
}
