import { LoginResponse, LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.authtoken);

  return {
    success: true,
    message: null,
  };
};
