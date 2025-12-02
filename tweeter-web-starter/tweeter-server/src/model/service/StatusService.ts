import { Status, FakeData, UserDto, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IStatusDAO } from "../../daos/interfaces/IStatusDAO";
import { DAOFactory } from "../factories/DaoFactory";

export class StatusService extends Service {
  private _authTokenDAO: IAuthtokenDAO;
  private _statusDAO: IStatusDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
    this._statusDAO = daoFactory.getStatusDAO();
  }

  public async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(authToken);
      const dataPage = await this._statusDAO.getFeed(lastItem, pageSize);
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
      let thisLastItem;
      if (lastItem === null) {
        thisLastItem = undefined;
      } else {
        thisLastItem = lastItem;
      }
      const page = await this._statusDAO.getStory(
        userAlias,
        thisLastItem!,
        pageSize
      );
      return [page.values, page.hasMorePages];
    } catch {
      return [[], false];
    }
  }

  public async postStatus(
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    this._authTokenDAO.isValidAuthToken(authToken);
    this._statusDAO.addStatus(newStatus);
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
