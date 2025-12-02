import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const isFollower = await userService.getIsFollowerStatus(
    request.authToken,
    request.user,
    request.selectedUser
  );

  return {
    isFollower: isFollower,
    success: true,
    message: null,
  };
};
