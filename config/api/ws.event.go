package api

import "encoding/json"

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

const (
	EventSendMessage = "send_message"
)

type SendMessageEvent struct {
	Message string `json:"message"`
	From    string `json:"from"`
}
