import { AuthToken, User, Status, PagedUserItemRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./ServerFacade";

export class FollowService extends Service {
  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server

    const serverFacade = new ServerFacade();

    const request: PagedUserItemRequest = {
      userAlias: userAlias,
      token: authToken.token,
      pageSize: pageSize,
      lastItem: (lastItem ? lastItem?.dto : null) as User | null,
    };
    return await serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | User | null
  ): Promise<[User[], boolean]> {
    const serverFacade = new ServerFacade();

    const request: PagedUserItemRequest = {
      userAlias: userAlias,
      token: authToken.token,
      pageSize: pageSize,
      lastItem: (lastItem ? lastItem?.dto : null) as User | null,
    };
    return await serverFacade.getMoreFollowees(request);
  }
}
