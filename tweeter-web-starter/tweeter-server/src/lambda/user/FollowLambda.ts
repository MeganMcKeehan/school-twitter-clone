import {
  FollowCountResponse,
  TweeterResponse,
  UserRequest,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.follow(
    request.authToken,
    request.user
  );

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount,
  };
};
