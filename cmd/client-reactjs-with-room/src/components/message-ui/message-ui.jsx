import "./message-ui.css";

const MessageUi = () => {
    return (
        <div id="container">
            <aside>
                <header>
                    <input type="text" placeholder="search room..." />
                </header>
                <ul>
                    <li>
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
                            <div>
                                <h2>General</h2>
                                <h3>
                                    <span class="status green"></span>
                                    Active
                                </h3>
                            </div>
                    </li>
                </ul>
            </aside>
            <main>
                <header>
                    {/*<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />*/}
                        <div>
                            <h2>General Room</h2>
                            <h3>already 1902 messages</h3>
                        </div>
                        {/*<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_star.png" alt="" />*/}
                </header>
                <ul id="chat">
                    <li class="you">
                        <div class="entete">
                            <span class="status green"></span>
                            <h2>Samue</h2>
                            <h3>10:12AM, Today</h3>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                    </li>
                    <li class="me">
                        <div class="entete">
                            <h3>10:12AM, Today</h3>
                            <h2>Samue</h2>
                            <span class="status blue"></span>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                    </li>
                    <li class="me">
                        <div class="entete">
                            <h3>10:12AM, Today</h3>
                            <h2>Samue</h2>
                            <span class="status blue"></span>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            OK
                        </div>
                    </li>
                    <li class="you">
                        <div class="entete">
                            <span class="status green"></span>
                            <h2>Samue</h2>
                            <h3>10:12AM, Today</h3>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                    </li>
                    <li class="me">
                        <div class="entete">
                            <h3>10:12AM, Today</h3>
                            <h2>Samue</h2>
                            <span class="status blue"></span>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            Lorem ipsum dolor sit assssssssssssss, sssssssssssssssssssssssssss , ss ssssssssssssssssssss, sssssssssssssssss, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                    </li>
                    <li class="me">
                        <div class="entete">
                            <h3>10:12AM, Today</h3>
                            <h2>Samue</h2>
                            <span class="status blue"></span>
                        </div>
                        <div class="triangle"></div>
                        <div class="message">
                            OK
                        </div>
                    </li>
                </ul>
                <footer>
                    <textarea placeholder="Type your message"></textarea>
                    {/*<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt="" />*/}
                    {/*    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt="" />*/}
                    <div className="send-message-button-wrapper">
                        <button className="send-message-button">Send</button>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default MessageUi;