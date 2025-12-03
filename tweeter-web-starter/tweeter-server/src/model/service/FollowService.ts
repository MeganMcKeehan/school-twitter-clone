import { User, FakeData, UserDto, StatusDto, DataPage } from "tweeter-shared";
import { Service } from "./Service";
import type { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { DAOFactory } from "../factories/DaoFactory";

export class FollowService extends Service {
  private _followDAO: IFollowDAO;
  private _authTokenDAO: IAuthtokenDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._followDAO = daoFactory.getFollowDAO();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(token);
      return this._followDAO.getFollowers(userAlias, lastItem?.alias, pageSize);
    } catch (error) {
      return [[], false];
    }
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(token);
      this._followDAO.getFollowees(userAlias, lastItem?.alias, pageSize);
      return;
    } catch (error) {
      return [[], false];
    }
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem as UserDto | null),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
