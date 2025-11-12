import { TweeterResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.unfollow(request.authToken, request.user);

  return {
    success: true,
    message: null,
  };
};
