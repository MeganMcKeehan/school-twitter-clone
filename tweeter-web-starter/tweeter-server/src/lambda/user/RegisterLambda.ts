import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const [user, authtoken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    user: user,
    authToken: authtoken,
    success: true,
    message: null,
  };
};
