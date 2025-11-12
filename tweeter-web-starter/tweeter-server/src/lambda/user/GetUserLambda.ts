import {
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  UserRequest,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.authtoken, request.alias);

  return {
    user: user,
    success: true,
    message: null,
  };
};
