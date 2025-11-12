import { Buffer } from "buffer";
import {
  User,
  AuthToken,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  GetUserRequest,
  UserRequest,
  IsFollowerRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./ServerFacade";

export class UserService extends Service {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server

    const serverFacade = new ServerFacade();

    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    return await serverFacade.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const serverFacade = new ServerFacade();

    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };

    return await serverFacade.register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const serverFacade = new ServerFacade();

    const request: LogoutRequest = {
      authtoken: authToken.token,
    };

    await serverFacade.logout(request);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const serverFacade = new ServerFacade();

    const request: GetUserRequest = {
      authtoken: authToken.token,
      alias: alias,
    };

    return await serverFacade.getUser(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const serverFacade = new ServerFacade();

    const request: UserRequest = {
      authToken: authToken.token,
      user: user.dto,
    };

    return await serverFacade.getFollowerCount(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const serverFacade = new ServerFacade();

    const request: UserRequest = {
      authToken: authToken.token,
      user: user.dto,
    };

    return await serverFacade.getFolloweeCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const serverFacade = new ServerFacade();

    const request: IsFollowerRequest = {
      authToken: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };

    return await serverFacade.isFollower(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const serverFacade = new ServerFacade();

    const request: UserRequest = {
      authToken: authToken.token,
      user: userToFollow.dto,
    };

    return await serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const serverFacade = new ServerFacade();

    const request: UserRequest = {
      authToken: authToken.token,
      user: userToUnfollow.dto,
    };

    return await serverFacade.follow(request);
  }
}
