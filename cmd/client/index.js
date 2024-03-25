let selectedChat = "general"
let conn

class Event {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}

const routeEvent = (event) => {
    if(event.type === undefined) {
        alert("No 'type' field in event.")
    }

    switch(event.type) {
        case "new_message":
            console.log("new message")
            break
        default:
            alert("Unsupported message type!")
    }
}

const changeChatRoom = () => {
    let newChat = document.getElementById("chatroom")
    if(newChat != null && newChat.value !== selectedChat) {
        console.log(newChat)
    }

    return false;
}


const sendMessage = () => {
    let newMessage = document.getElementById("message")
    if(newMessage != null) {
        // console.log(conn)
        sendEvent("send_message", newMessage.value)
    }

    return false
}

const sendEvent = (eventName, payload) => {
    const event = new Event(eventName, payload)
    conn.send(JSON.stringify(event))
}

window.onload = () => {
    document.getElementById("chatroom-selection").onsubmit = changeChatRoom
    document.getElementById("chatroom-message").onsubmit = sendMessage

    if(window["WebSocket"]) {
        console.info("Supports websocket!")

        conn = new WebSocket("ws://" + document.location.host + "/ws")

        conn.onmessage = (messageEvent) => {
            console.log(messageEvent)

            const eventData = JSON.parse(messageEvent.data)
            const event = Object.assign(new Event, eventData)

            routeEvent(event)
        }
    } else {
        alert("Not supporting websocket!")
    }
}