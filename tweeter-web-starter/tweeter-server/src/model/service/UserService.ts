import { Buffer } from "buffer";
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { IImageDAO } from "../../daos/interfaces/IImageDAO";
import { IFollowDAO } from "../../daos/interfaces/IFollowDAO";

export class UserService extends Service {
  private _userDAO: IUserDAO;
  private _authTokenDAO: IAuthtokenDAO;
  private _imageDao: IImageDAO;
  private _followDAO: IFollowDAO;

  constructor(
    userDAO: IUserDAO,
    authtokenDAO: IAuthtokenDAO,
    imageDAO: IImageDAO,
    followDAO: IFollowDAO,
  ) {
    super();
    this._userDAO = userDAO;
    this._authTokenDAO = authtokenDAO;
    this._imageDao = imageDAO;
    this._followDAO = followDAO;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    try {
      const user = await this._userDAO.getUserInformation(alias);
      if (password === user.password){
        const authToken = await this._authTokenDAO.generateAuthToken(alias);
        return [user,authToken.token]
      }

      throw new Error("Invalid alias or password");
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
    const aliasTaken = this._userDAO.getUserInformation(alias);
    if (aliasTaken){
      throw new Error("alias taken");
    }

    const newUser =  this._userDAO.addUser(firstName, lastName, alias, password);

    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    this._imageDao.putImage(alias+imageFileExtension, imageStringBase64);

    
    if (newUser === null) {
      throw new Error("Invalid registration");
    }

    const token = this._authTokenDAO.generateAuthToken(alias)

    return [newUser, token.token];
  }

  public async logout(authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async getUser(
    authToken: string,
    alias: string
  ): Promise<UserDto | null> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._userDAO.getUserInformation(alias);
  }

  public async getFollowerCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._followDAO.getFollowers(user.alias).length;
  }

  public async getFolloweeCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    await this._authTokenDAO.isValidAuthToken(authToken);
    return await this._followDAO.getFollowees(user.alias).length;
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
    this._followDAO.addFollow(user.alias,userToFollow.alias)

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: string,
    userToUnfollow: UserDto,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this._followDAO.deleteFollow(user.alias,userToUnfollow.alias)

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
