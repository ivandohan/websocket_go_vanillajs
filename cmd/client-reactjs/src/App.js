import './App.css';
import {useState} from "react";
import MessageUi from "./components/message-ui/message-ui";
import { v4 as uuid } from "uuid";

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

class Event {
  constructor(type, payload) {
    this.type = type
    this.payload = payload
  }
}

const App = () => {
  let currUsername
  let messages = []
  const [isLogin, setIsLogin] = useState(false)
  const [loginFormUsername, setUsername] = useState("");
  const [loginFormPassword, setPassword] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [conn, setConn] = useState(null)
  const [fixedMessage, setFixedMessage] = useState([])


  // Notify components to update

  // Helper
  const sendEvent = (eventName, payload, conn) => {
    const event = new Event(eventName, payload);

    console.log(event)

    conn.send(JSON.stringify(event));
  }

  const onChangeChatRoom = (e) => {
    e.preventDefault();
    setSelectedRoom(e.target.value);
  }

  const onChangeSendMessage = (e) => {
    e.preventDefault();
    setNewMessage(e.target.value);
  }

  const onChangeLoginUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  }

  const onChangeLoginPassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  }


  // Main Utilities
  const connectWebSocket = (otp) => {
    let conn
    if(window["WebSocket"]) {
      console.log("Supports websockets!");

      conn = new WebSocket("wss://localhost:8080/ws?otp=" + otp)

      conn.onopen = (event) => {
        setIsConnected(true);
      }

      conn.onclose = (event) => {
        setIsConnected(false);
      }

      conn.onmessage = (messageEvent) => {
        const eventData = JSON.parse(messageEvent.data);
        const event = Object.assign(new Event, eventData);

        routeEvent(event);
      }
    } else {
      alert("Not supporting websockets yet!");
    }

    return conn
  }

  const routeEvent = (event) => {
    if(event.type === undefined) {
      alert("[ERROR] [routeEvent] : No 'type' field in event.");
    }

    switch (event.type) {
      case "new_message":
        const messageEvent = Object.assign(new NewMessageEvent, event.payload);
        appendChatMessage(messageEvent);
        break;
      default:
        alert("Unsupported message-ui type!");
        break;
    }
  }

  const appendChatMessage = (messageEvent) => {
    let date = new Date(messageEvent.sent)
    let senderName

    if(currUsername === messageEvent.from) {
      senderName = "me"
    } else {
      senderName = messageEvent.from
    }

    const smallID = uuid().slice(0, 8);

    console.log(`CurrUsername : ${currUsername}`)
    console.log(`SenderName : ${senderName}`)


    let formattedMessage = {
      "id": `msg${smallID}`,
      "sender": senderName,
      "date-time": date.toLocaleString(),
      "message": messageEvent.message
    }

    console.log(`Messages : ${messages.length}`)

    messages = [...messages, formattedMessage]
    setFixedMessage(messages)
  }

  const onClickChangeChatRoom = () => {
    let changeEvent = new ChangeRoomEvent(selectedRoom)
    sendEvent("change_room", changeEvent)

    return false;
  }

  const onClickSendMessage = () => {
    if(newMessage !== "") {
      let outgoingEvent = new SendMessageEvent(newMessage, currentUsername)
      console.log(`Current: ${currentUsername}`)
      sendEvent("send_message", outgoingEvent, conn)
    }

    setNewMessage("")

    return false;
  }

  const onClickLogin = () => {
    let loginData = {
      "username": loginFormUsername,
      "password": loginFormPassword,
    }

    fetch("https://localhost:8080/login", {
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
      setIsLogin(!isLogin)
      setConn(connectWebSocket(data.otp))
      console.log(`data.username ${data.username}`)
      setCurrentUsername(data.username)
      currUsername = data.username
    }).catch((err) => {
      alert("[ERROR] [fetch JS]")
      console.log(err)
    })

    setPassword("")
    setUsername("")

    return false;
  }


  return (
      <div className="App">
        <MessageUi
            isLogin={isLogin}
            isConnected={isConnected}
            selectedRoom={selectedRoom}

            usernameValue={loginFormUsername}
            passwordValue={loginFormPassword}
            messageValue={newMessage}

            onChangeChatRoom={onChangeChatRoom}
            onClickChangeChatRoom={onClickChangeChatRoom}

            onChangeSendMessage={onChangeSendMessage}
            onClickSendMessage={onClickSendMessage}

            onChangeLoginUsername={onChangeLoginUsername}
            onChangeLoginPassword={onChangeLoginPassword}
            onClickLogin={onClickLogin}

            messages={fixedMessage}
        />
      </div>
  );
}

export default App;
