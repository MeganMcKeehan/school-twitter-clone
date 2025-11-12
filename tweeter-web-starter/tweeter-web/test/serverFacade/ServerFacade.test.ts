import {
  PagedUserItemRequest,
  RegisterRequest,
  User,
  UserRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../src/services/ServerFacade";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import "isomorphic-fetch";

describe("server facade", () => {
  let serverFacade: ServerFacade;
  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("registers a user", async () => {
    const registerRequest: RegisterRequest = {
      firstName: "test",
      lastName: "test",
      alias: "test",
      password: "test",
      userImageBytes: "aaaaaaa",
      imageFileExtension: ".png",
    };
    const [user, authToken] = await serverFacade.register(registerRequest);
    verify(user);
  });

  it("gets followers", async () => {
    const getFolowersRequest: PagedUserItemRequest = {
      userAlias: "@amy",
      token: "aaaa",
      pageSize: 10,
      lastItem: null,
    };
    const [user, authToken] = await serverFacade.getMoreFollowers(
      getFolowersRequest
    );
    verify(user);
  });

  it("gets follower count", async () => {
    const user = new User(
      "Amy",
      "Ames",
      "@amy",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
    );
    const getFolowersRequest: UserRequest = {
      user: user.dto,
      authToken: "aaaa",
    };
    const count = await serverFacade.getFollowerCount(getFolowersRequest);
    verify(count);
  });
});
