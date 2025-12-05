import { LoginRequest, LoginResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  try {
    const [user, authtoken] = await userService.login(
      request.alias,
      request.password
    );

    return {
      user: user,
      authToken: authtoken,
      success: true,
      message: null,
    };
  } catch {
    return {
      user: new User("", "", "", "").dto,
      authToken: "authtoken",
      success: false,
      message: "Invalid alias or password",
    };
  }
};
