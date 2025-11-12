import { useContext } from "react";
import { UserInfoActionsContext } from "./UserInfoContexts";
import { AuthToken, User } from "tweeter-shared";

interface UserActions {
  logInUser: (user: User, authToken: AuthToken, rememberMe: boolean) => void;
  setDisplayedUser: (user: User) => void;
  clearUserInfo: () => void;
}

const useUserInfoActions = (): UserActions => {
  const { updateUserInfo, setDisplayedUser, clearUserInfo } = useContext(
    UserInfoActionsContext
  );
  return {
    logInUser: (user: User, authToken: AuthToken, rememberMe: boolean) =>
      updateUserInfo(user, user, authToken, rememberMe),
    setDisplayedUser: setDisplayedUser,
    clearUserInfo: clearUserInfo,
  };
};
export default useUserInfoActions;
