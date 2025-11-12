import {
  AuthToken,
  FollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterResponse,
  User,
  UserDto,
  UserRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://jvtk31s8d0.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getFolloweeCount(request: UserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      FollowCountResponse
    >(request, "/followee/count");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const count: number | null =
      response.success && response.followeeCount
        ? response.followeeCount
        : null;

    // Handle errors
    if (response.success) {
      if (count == null) {
        throw new Error(`No followees found`);
      } else {
        return count;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getFollowerCount(request: UserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      FollowCountResponse
    >(request, "/follower/count");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const count: number | null =
      response.success && response.followerCount
        ? response.followerCount
        : null;

    // Handle errors
    if (response.success) {
      if (count == null) {
        throw new Error(`No followers found`);
      } else {
        return count;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/list-feed");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreStatusItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/list-story");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async follow(request: UserRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      FollowCountResponse
    >(request, "/user/follow");

    // Handle errors
    if (response.success) {
      return [response.followerCount ?? 0, response.followeeCount ?? 0];
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async unfollow(request: UserRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      TweeterResponse
    >(request, "/user/unfollow");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async isFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/isfollower");

    // Handle errors
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    const item: User | null =
      response.success && response.user
        ? (User.fromDto(response.user) as User)
        : null;

    console.log(response);
    console.log(User.fromDto(response.user));

    // Handle errors
    if (response.success) {
      if (item == null) {
        throw new Error(`user not found`);
      } else {
        return item;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const item: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    console.log(response);
    console.log(User.fromDto(response.user));

    // Handle errors
    if (response.success) {
      if (item == null) {
        throw new Error(`user not found`);
      } else {
        return [item, AuthToken.Generate()];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/user/register");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const item: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    // Handle errors
    if (response.success) {
      if (item == null) {
        throw new Error(`failed to register`);
      } else {
        return [item, AuthToken.Generate()];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }
}
