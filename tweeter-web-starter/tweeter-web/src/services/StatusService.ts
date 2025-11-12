import {
  AuthToken,
  Status,
  User,
  PagedStatusItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./ServerFacade";

export class StatusService extends Service {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | User | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server

    const serverFacade = new ServerFacade();

    const request: PagedStatusItemRequest = {
      userAlias: userAlias,
      token: authToken.token,
      pageSize: pageSize,
      lastItem: (lastItem ? lastItem?.dto : null) as Status | null,
    };

    return await serverFacade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | User | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const serverFacade = new ServerFacade();

    const request: PagedStatusItemRequest = {
      userAlias: userAlias,
      token: authToken.token,
      pageSize: pageSize,
      lastItem: (lastItem ? lastItem?.dto : null) as Status | null,
    };

    return await serverFacade.getMoreStatusItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    //await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status

    const serverFacade = new ServerFacade();

    const request: PostStatusRequest = {
      authtoken: authToken.token,
      statusDto: newStatus.dto,
    };

    await serverFacade.postStatus(request);
  }
}
