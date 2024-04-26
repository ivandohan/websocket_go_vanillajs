import './App.css';
import MessageUi from "./components/message-ui/message-ui";
import AuthUi from "./components/auth-ui/auth-ui";
import {useState} from "react";

const App = () => {
  const [isLogin, setIslogin] = useState(false)
  const [loginFormUsername, setUsername] = useState("");
  const [loginFormPassword, setPassword] = useState("");
  const onChangeLoginUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  }

  const onChangeLoginPassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  }

  return (
    <div className="App">
      {
        isLogin ?
          <MessageUi />
          :
          <AuthUi
            loginFormUsername={loginFormUsername}
            loginFormPassword={loginFormPassword}
            onChangeLoginUsername={onChangeLoginUsername}
            onChangeLoginPassword={onChangeLoginPassword}
            setIsLogin={setIslogin}
          />
      }
    </div>
  );
}

export default App;
