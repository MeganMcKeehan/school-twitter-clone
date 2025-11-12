import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFeilds from "../AuthenticationFeilds";
import { useMessageActions } from "../../toaster/MessageHooks";
import { AuthenticateVeiw } from "../../../presenter/AuthenticatePresenter";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import useUserInfoActions from "../../userInfo/UserInfoListenerHook";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { logInUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: AuthenticateVeiw = {
    displayErrorMessage: displayErrorMessage,
    logInUser: logInUser,
    navigate: navigate,
  };

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async () => {
    setIsLoading(true);
    await presenter.doLogin(alias, password, rememberMe, props.originalUrl);
    setIsLoading(false);
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFeilds
        onEnter={loginOnEnter}
        setAlias={setAlias}
        setPassword={setPassword}
      ></AuthenticationFeilds>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
