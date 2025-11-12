import { useContext } from "react";
import { UserInfoContext } from "./UserInfoContexts";

const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export default useUserInfo;
