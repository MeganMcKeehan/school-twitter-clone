import { FollowCountResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService();
  const followerCount = await userService.getFollowerCount(
    request.authToken,
    request.user
  );

  return {
    followerCount: followerCount,
    success: true,
    message: null,
  };
};
