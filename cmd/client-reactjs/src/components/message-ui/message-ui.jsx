import './message-ui.css';


const MessageUi = ({
    isLogin,
    usernameValue,
    passwordValue,
    messageValue,
                           selectedRoom,
                           isConnected,
                           onChangeChatRoom,
                           onClickChangeChatRoom,
    onChangeSendMessage,
    onClickSendMessage,

    onChangeLoginUsername,
    onChangeLoginPassword,
    onClickLogin,

    messages,
}) => {
    return (
        <section className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    Websocket Sample
                </div>
                <div className="msger-header-attributes">
                    {
                        isConnected ?
                            <div className="header-attribute-wrapper">
                                <div className="header-attribute solid-border bg-chatroom">
                                    {selectedRoom}
                                </div>
                                <div className="header-attribute solid-border bg-connected">
                                    Connected
                                </div>
                            </div>
                            :
                            <div className="header-attribute solid-border bg-disconnected">
                                Disconnected
                            </div>
                    }

                </div>
            </header>

            <main className="msger-chat">
                {
                    messages.length === 0 ?
                        isLogin ? <div className="msger-session-holder">
                            <div>
                                No messages found.
                            </div>
                    </div>
                            : <div className="msger-session-holder">
                            <div>
                                Login first.
                            </div>
                            </div>
                            :
                        messages.map((message) => {
                            if (message["sender"] === "me") {
                                return (
                                    <div key={message["id"]} className="msg right-msg">

                                        <div className="msg-bubble">
                                            <div className="msg-info">
                                                <div className="msg-info-name">Me</div>
                                                <div className="msg-info-time">[trouble]</div>
                                            </div>

                                            <div className="chatbox-item-content-wrapper">
                                                {message["message"]}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={message["key"]} className="msg left-msg">

                                        <div className="msg-bubble">
                                            <div className="msg-info">
                                                <div className="msg-info-name">{message["sender"]}</div>
                                                <div className="msg-info-time">[trouble]</div>
                                            </div>

                                            <div className="msg-text">
                                                {message["message"]}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                }
            </main>

            {
                isLogin ?
                    <div className="msger-inputarea">
                        <input id="login-send-message" type="text" className="msger-input" placeholder="Enter your message..."
                               value={messageValue} autoComplete="off" onChange={onChangeSendMessage}/>
                        <button type="reset" className="msger-send-btn" onClick={onClickSendMessage}>Send</button>
                    </div>
                    :
                    <div className="msger-loginarea">
                        <input id="login-username" type="text" className="msger-input" placeholder="Enter your username..."
                               value={usernameValue} autoComplete="off" onChange={onChangeLoginUsername}/>

                        <input id="login-password" type="text" className="msger-input" placeholder="Enter your password..."
                               value={passwordValue} autoComplete="off" onChange={onChangeLoginPassword}/>

                        <button type="reset" className="msger-login-btn" onClick={onClickLogin}>Login</button>
                    </div>
            }


        </section>
    );
}

export default MessageUi;