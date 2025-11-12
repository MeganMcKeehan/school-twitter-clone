import { AuthToken, User, FakeData } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHooks";
import useUserInfoActions from "../userInfo/UserInfoListenerHook";
import { useMessageActions } from "../toaster/MessageHooks";
import { useNavigate } from "react-router-dom";

interface UserNavigationListener {
  navigateToUser: (event: React.MouseEvent, location: string) => void;
}

export const UserNavigationHook = (): UserNavigationListener => {
  const { setDisplayedUser } = useUserInfoActions();
  const { authToken, displayedUser } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const navigateToUser = async (
    event: React.MouseEvent,
    location: string
  ): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const sanitizedAlias = alias.split("/").at(1);
      const toUser = sanitizedAlias
        ? await getUser(authToken!, sanitizedAlias)
        : await getUser(authToken!, alias);

      const sanitizedLocation = location.split("/").at(0);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${sanitizedLocation}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return { navigateToUser: navigateToUser };
};
