import './user-interface.css';


const UserInterface = ({
    isLogin,
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
        <div className="center">
            <h3 id="chat-header">
                Currently, in chat: {selectedRoom}
            </h3>
            <h3 id="connection-header">
                Connected to websocket: {isConnected.toString()}
            </h3>
            {
                isLogin ?
                    <div>
                        <div id="chatroom-selection">
                            <label htmlFor="chatroom">Chatroom</label>
                            <input type="text" name="chatroom" id="chatroom" autoComplete="off"
                                   onChange={onChangeChatRoom}/>
                            <br/><br/>
                            <button type="submit" onClick={onClickChangeChatRoom}>Submit</button>
                        </div>

                        <br/>

                        <div>
                            {
                                messages.length === 0 ?
                                    <div>
                                        None
                                    </div> :
                                    messages.map((message) => {
                                        return (<div key={message["id"]}>
                                            {`[${message["sender"]}] ${message["date-time"].toLocaleString()}: ${message["message"]}`}
                                        </div>)
                                    })

                            }
                        </div>

                        {/*{`[${message["sender"]}] ${message["date-time"].toLocaleString()}: ${message["message"]}`}*/}


                        <br/>

                        <div id="chatroom-message">
                            <label htmlFor="message">Message</label>
                            <input type="text" name="message" id="message" autoComplete="off"
                                   onChange={onChangeSendMessage}/><br/><br/>
                            <button type="submit" onClick={onClickSendMessage}>Submit</button>
                        </div>
                    </div> :
                    <div className="login">
                        <div id="login-form">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" placeholder="Input your username..."
                                   autoComplete="off" onChange={onChangeLoginUsername}/>

                            <label htmlFor="password">Password</label>
                            <input type="text" name="password" id="password" placeholder="Input your password..."
                                   autoComplete="off" onChange={onChangeLoginPassword}/>

                            <button type="submit" onClick={onClickLogin}>Submit</button>
                        </div>
                    </div>


            }

        </div>
    );
}

export default UserInterface;