import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const user = await userService.getUser(request.authtoken, request.alias);

  return {
    user: user,
    success: true,
    message: null,
  };
};
