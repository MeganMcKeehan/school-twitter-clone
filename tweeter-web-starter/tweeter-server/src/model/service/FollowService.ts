import { User, FakeData, UserDto, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import type { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";

export class FollowService extends Service {
  private _followDAO: IFollowDAO;
  private _userDAO: IUserDAO;
  private _authTokenDAO: IAuthtokenDAO;

  constructor(
    followDAO: IFollowDAO,
    userDAO: IUserDAO,
    authtokenDAO: IAuthtokenDAO
  ) {
    super();
    this._followDAO = followDAO;
    this._userDAO = userDAO;
    this._authTokenDAO = authtokenDAO;
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this._authTokenDAO.isValidAuthToken(token);
      const allFollowers = await this._followDAO.getFollowers(userAlias);
      const indexToStartSearchAt = lastItem
        ? allFollowers.indexOf(lastItem)
        : 0;

      const nextBatch: UserDto[] = [];
      for (
        let i = indexToStartSearchAt;
        i < indexToStartSearchAt + pageSize;
        i++
      ) {
        nextBatch.push(allFollowers[i]);
      }

      return [nextBatch, true];
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
      this._authTokenDAO.isValidAuthToken(token);
      const allFollowees = this._followDAO.getFollowees(userAlias);
      const indexToStartSearchAt = lastItem
        ? allFollowees.indexOf(lastItem)
        : 0;

      const nextBatch: UserDto[] = [];
      for (
        let i = indexToStartSearchAt;
        i < indexToStartSearchAt + pageSize;
        i++
      ) {
        nextBatch.push(allFollowees[i]);
      }

      return [nextBatch, true];
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
