import { Buffer } from "buffer";
import { User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { IImageDAO } from "../../daos/interfaces/IImageDAO";
import { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { DAOFactory } from "../factories/DaoFactory";
import { IPasswordDAO } from "../../daos/interfaces/IPasswordDAO";

export class UserService extends Service {
  private _userDAO: IUserDAO;
  private _authTokenDAO: IAuthtokenDAO;
  private _imageDao: IImageDAO;
  private _followDAO: IFollowDAO;
  private _passwordDAO: IPasswordDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._userDAO = daoFactory.getUserDAO();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
    this._imageDao = daoFactory.getImageDAO();
    this._followDAO = daoFactory.getFollowDAO();
    this._passwordDAO = daoFactory.getPasswordDAO();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    try {
      const foundPassword = await this._passwordDAO.getPassword(alias);
      if (password === foundPassword) {
        const user = await this._userDAO.getUserInformation(alias);
        if (user === undefined) {
          throw new Error("user not found");
        }
        const authToken = await this._authTokenDAO.generateAuthToken(alias);
        return [user, authToken];
      }

      throw new Error("Invalid alias or password");
    } catch (error) {
      throw error;
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    const aliasTaken = await this._userDAO.getUserInformation(alias);
    if (aliasTaken?.alias == alias) {
      throw new Error("alias taken");
    }

    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const imageUrl = await this._imageDao.putImage(
      alias + "." + imageFileExtension,
      imageStringBase64
    );

    this._userDAO.addUser(firstName, lastName, alias, imageUrl);
    this._passwordDAO.addPassword(alias, password);

    const token = await this._authTokenDAO.generateAuthToken(alias);

    const newUser = new User(firstName, lastName, alias, imageUrl);

    return [newUser.dto, token];
  }

  public async logout(authToken: string): Promise<void> {
    await this._authTokenDAO.deleteAuthToken(authToken);
  }

  public async getUser(
    authToken: string,
    alias: string
  ): Promise<UserDto | null> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return (await this._userDAO.getUserInformation(alias)) || null;
  }

  public async getFollowerCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._followDAO.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._followDAO.getFolloweeCount(user.alias);
  }

  public async getIsFollowerStatus(
    authToken: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._followDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async follow(
    authToken: string,
    userToFollow: UserDto,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this._followDAO.addFollow(user.alias, userToFollow.alias);

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: string,
    userToUnfollow: UserDto,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this._followDAO.deleteFollow(user.alias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }
}
