import { FollowCountResponse, IsFollowerRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const [followerCount, followeeCount] = await userService.follow(
    request.authToken,
    request.selectedUser,
    request.user
  );

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount,
  };
};
