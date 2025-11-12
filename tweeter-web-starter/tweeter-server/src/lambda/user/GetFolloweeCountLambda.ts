import { FollowCountResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService();
  const followeeCount = await userService.getFolloweeCount(
    request.authToken,
    request.user
  );

  return {
    followeeCount: followeeCount,
    success: true,
    message: null,
  };
};
