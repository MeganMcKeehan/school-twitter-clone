import { IsFollowerRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export const handler = async (
  request: IsFollowerRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
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
