import { User, FakeData, UserDto, StatusDto, DataPage } from "tweeter-shared";
import { Service } from "./Service";
import type { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { DAOFactory } from "../factories/DaoFactory";

export class FollowService extends Service {
  private _followDAO: IFollowDAO;
  private _authTokenDAO: IAuthtokenDAO;
  private _userDAO: IUserDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._followDAO = daoFactory.getFollowDAO();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
    this._userDAO = daoFactory.getUserDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(token);
      const [followerAliases, hasMore] = await this._followDAO.getFollowers(
        userAlias,
        lastItem?.alias,
        pageSize
      );
      let users: UserDto[] = [];
      if (followerAliases !== undefined) {
        users = await this.getUserDTOs(followerAliases);
      }
      return [users, hasMore];
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
      const [followeeAliases, hasMore] = await this._followDAO.getFollowees(
        userAlias,
        lastItem?.alias,
        pageSize
      );
      let users: UserDto[] = [];
      if (followeeAliases !== undefined) {
        users = await this.getUserDTOs(followeeAliases);
      }

      return [users, hasMore];
    } catch (error) {
      return [[], false];
    }
  }

  private async getUserDTOs(aliases: string[]) {
    const users: UserDto[] = [];
    for (const alias of aliases) {
      console.log(alias);
      const foundUser = await this._userDAO.getUserInformation(alias);
      if (foundUser) {
        users.push(foundUser);
      }
    }
    return users;
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
