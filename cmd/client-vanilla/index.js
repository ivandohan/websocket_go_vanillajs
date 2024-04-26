class SendMessageEvent {
    constructor(message, from) {
        this.message = message;
        this.from = from;
    }
}

class NewMessageEvent {
    constructor(message, from, sent) {
        this.message = message;
        this.from = from;
        this.sent = sent;
    }
}

class ChangeRoomEvent {
    constructor(name) {
        this.name = name
    }
}

let selectedChat = "general"
let conn
let username

const login = () => {
    let loginData = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    }

    fetch("login", {
        method: "post",
        body: JSON.stringify(loginData),
        mode: "cors",
    }).then((response) => {
        if(response.ok) {
            return response.json()
        } else {
            throw "unauthorized"
        }
    }).then((data) => {
        connectWebSocket(data.otp)
        username = data.username
    }).catch((err) => {
        alert("[ERROR] [auth-ui JS]")
    })

    return false
}

const connectWebSocket = (otp) => {
    if(window["WebSocket"]) {
        console.log("Supports websocket!")

        conn = new WebSocket("wss://" + document.location.host + "/ws?otp=" + otp)

        conn.onopen = (event) => {
            document.getElementById("connection-header").innerHTML = "Connected to websocket: True"
        }

        conn.onclose = (event) => {
            document.getElementById("connection-header").innerHTML = "Connected to websocket: False"
        }

        conn.onmessage = (messageEvent) => {
            // console.log(messageEvent)

            const eventData = JSON.parse(messageEvent.data)

            const event = Object.assign(new Event, eventData)

            routeEvent(event)
        }
    } else {
        alert("Not supporting websockets!")
    }
}

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
            // console.log("new message-ui")
            const messageEvent = Object.assign(new NewMessageEvent, event.payload)
            appendChatMessage(messageEvent)
            break
        default:
            alert("Unsupported message-ui type!")
            break
    }
}

const appendChatMessage = (messageEvent) => {
    let date = new Date(messageEvent.sent)
    let senderName
    if(username === messageEvent.from) {
        senderName = "me"
    } else {
        senderName = messageEvent.from
    }

    const formattedMessage = `[${senderName}]${date.toLocaleString()}: ${messageEvent.message}`

    let textArea = document.getElementById("chatmessages")
    textArea.innerHTML = textArea.innerHTML + "\n" + formattedMessage
    textArea.scrollTop = textArea.scrollHeight
}

const changeChatRoom = () => {
    let newChat = document.getElementById("chatroom")
    if(newChat != null && newChat.value !== selectedChat) {
        // console.log(newChat)
        selectedChat = newChat.value

        let header = document.getElementById("chat-header")
        header.innerHTML = `Currently, in chat: ${selectedChat}`

        let changeEvent = new ChangeRoomEvent(selectedChat)
        sendEvent("change_room", changeEvent)

        let textArea = document.getElementById("chatmessages")
        textArea.innerHTML = `You changed room into: ${selectedChat}`
    }

    return false;
}


const sendMessage = () => {
    let newMessage = document.getElementById("message-ui")
    if(newMessage != null) {
        let outgoingEvent = new SendMessageEvent(newMessage.value, username)
        // console.log(conn)
        sendEvent("send_message", outgoingEvent)
    }

    return false
}

const sendEvent = (eventName, payload) => {
    const event = new Event(eventName, payload)

    console.log(event)

    conn.send(JSON.stringify(event))
}

window.onload = () => {
    document.getElementById("chatroom-selection").onsubmit = changeChatRoom
    document.getElementById("chatroom-message-ui").onsubmit = sendMessage
    document.getElementById("auth-ui-form").onsubmit = login
}