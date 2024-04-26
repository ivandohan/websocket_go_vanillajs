import ConfettiExplosion from "react-confetti-explosion";
import carAuth from "../car-auth.jpeg";

const AuthInputProgress = ({
  yippiFunc,
  isYippi,
  loginFormUsername,
  loginFormPassword,
  onChangeLoginUsername,
  onChangeLoginPassword,
  setIsLogin,
                           }) => {

  const Login = () => {
    yippiFunc(true)
    setTimeout(() => {
      setIsLogin(true)
    }, 4500)
  }

  return (
    <div className="c-formContainer">
      <div className="c-welcome">
        {
          isYippi && <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
          />
        }
        <img className="c-welcome__img" src={carAuth} alt=""/>
      </div>
      <form className="c-form" action="">
        <div className="c-form__group">
          <label className="c-form__label" htmlFor="region">
            <input
              type="text"
              id="region"
              className="c-form__input"
              placeholder=" "
              required
              autoComplete="off"
            />

            <label className="c-form__next" htmlFor="progress2" role="button">
              <span className="c-form__nextIcon"></span>
            </label>

            <span className="c-form__groupLabel">What's your region?</span>
            <b className="c-form__border"></b>
          </label>
        </div>

        <div className="c-form__group">
          <label className="c-form__label" htmlFor="username">
            <input
              type="text"
              id="username"
              className="c-form__input"
              placeholder=" "
              required
              autoComplete="off"
              value={loginFormUsername}
              onChange={onChangeLoginUsername}
            />

            <label className="c-form__next" htmlFor="progress3" role="button">
              <span className="c-form__nextIcon"></span>
            </label>

            <span className="c-form__groupLabel">Type your username...</span>
            <b className="c-form__border"></b>
          </label>
        </div>

        <div className="c-form__group">
          <label className="c-form__label" htmlFor="fpass">
            <input
              type="password"
              id="fpass"
              className="c-form__input"
              placeholder=" "
              autoComplete="off"
              required
              value={loginFormPassword}
              onChange={onChangeLoginPassword}
            />

            <label className="c-form__next" htmlFor="finish" role="button" onClick={Login}>
              <span className="c-form__nextIcon"></span>
            </label>

            <span className="c-form__groupLabel">Type your password...</span>
            <b className="c-form__border"></b>
          </label>
        </div>

        <label className="c-form__toggle" htmlFor="start">Login<span
          className="c-form__toggleIcon"></span></label>
      </form>
    </div>
  )
}

export default AuthInputProgress;