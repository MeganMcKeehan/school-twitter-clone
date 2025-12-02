import { FollowCountResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: UserRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
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
