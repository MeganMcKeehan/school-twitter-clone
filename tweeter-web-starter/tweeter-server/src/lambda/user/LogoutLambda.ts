import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  await userService.logout(request.authtoken);

  return {
    success: true,
    message: null,
  };
};
