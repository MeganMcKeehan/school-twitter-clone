import { Status, FakeData, UserDto, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IStatusDAO } from "../../daos/interfaces/IStatusDAO";
import { DAOFactory } from "../factories/DaoFactory";
import { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IFeedDAO } from "../../daos/interfaces/IFeedDao";
import { AuthenticateService } from "./AuthenticateService";

export class StatusService extends Service {
  private _authTokenDAO: IAuthtokenDAO;
  private _statusDAO: IStatusDAO;
  private _followDAO: IFollowDAO;
  private _feedDAO: IFeedDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
    this._statusDAO = daoFactory.getStatusDAO();
    this._followDAO = daoFactory.getFollowDAO();
    this._feedDAO = daoFactory.getFeedDAO();
  }

  public async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(authToken);
      const dataPage = await this._feedDAO.getFeed(
        userAlias,
        lastItem,
        pageSize
      );
      return [dataPage.values, dataPage.hasMorePages];
    } catch (error) {
      return [[], false];
    }
  }

  public async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(authToken);
      const [values, hasMore] = await this._statusDAO.getStory(
        userAlias,
        lastItem,
        pageSize
      );
      console.log(values);
      return [values, hasMore];
    } catch {
      return [[], false];
    }
  }

  public async postStatus(
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    this._authTokenDAO.isValidAuthToken(authToken);
    if (!newStatus) {
      throw new Error("missing status");
    }
    const status = Status.fromDto(newStatus);
    this._statusDAO.addStatus(
      newStatus.user.alias,
      status!.toJson(),
      status!.timestamp.toString()
    );

    let hasMore = true;
    const followersAliases: string[] = [];
    let lastUser = undefined;
    while (hasMore) {
      let moreUsersAliases;
      console.log(hasMore);
      [moreUsersAliases, hasMore] = await this._followDAO.getFollowers(
        newStatus.user.alias,
        lastUser,
        10
      );
      console.log(moreUsersAliases);
      if (moreUsersAliases.length > 0) {
        followersAliases.push(...moreUsersAliases);
        lastUser = moreUsersAliases.at(-1);
        console.log(lastUser);
      }
    }

    for (const alias of followersAliases) {
      await this.updateFeed(alias, newStatus);
    }
  }

  private async updateFeed(alias: string, newStatus: StatusDto) {
    await this._feedDAO.updateFeed(
      alias,
      newStatus.timestamp.toString(),
      Status.fromDto(newStatus)!.toJson()
    );
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem as StatusDto | null),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
