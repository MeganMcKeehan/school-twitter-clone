import { FollowCountResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: UserRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
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
