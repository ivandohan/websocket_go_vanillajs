import "./auth-ui.css";
import carAuth from "./car-auth.jpeg";
import ConfettiExplosion from "react-confetti-explosion";
import {useEffect, useState} from "react";
import AuthInputProgress from "./auth-input-progress/auth-input-progress";

const AuthUi = ({
  loginFormUsername,
  loginFormPassword,
  onChangeLoginUsername,
  onChangeLoginPassword,
  setIsLogin,
                }) => {
    const [isYippi, setIsYippi] = useState(false)

    const yippiii = (value) => {
        setIsYippi(value)
    }

    useEffect(() => {
        setIsYippi(false)
    }, []);

    return(
      <div className="auth-wrapper">
          <input className="c-checkbox" type="checkbox" id="start"/>
          <input className="c-checkbox" type="checkbox" id="progress2"/>
          <input className="c-checkbox" type="checkbox" id="progress3"/>
          <input className="c-checkbox" type="checkbox" id="finish"/>

          <div className="c-form__progress"></div>

          <AuthInputProgress
            yippiFunc={yippiii}
            isYippi={isYippi}
            loginFormUsername={loginFormUsername}
            loginFormPassword={loginFormPassword}
            onChangeLoginUsername={onChangeLoginUsername}
            onChangeLoginPassword={onChangeLoginPassword}
            setIsLogin={setIsLogin}
          />
      </div>
    );
}

export default AuthUi;