import { IsFollowerRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: IsFollowerRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.unfollow(
    request.authToken,
    request.selectedUser,
    request.user
  );

  return {
    success: true,
    message: null,
  };
};
