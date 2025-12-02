import { AuthtokenDAO } from "../../daos/AuthTokenDAO";
import { FollowDAO } from "../../daos/FollowDAO";
import { ImageDAO } from "../../daos/ImageDAO";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IImageDAO } from "../../daos/interfaces/IImageDAO";
import { IStatusDAO } from "../../daos/interfaces/IStatusDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";
import { StatusDAO } from "../../daos/StatusDAO";
import { UserDAO } from "../../daos/UserDAO";
import { DAOFactory } from "./DaoFactory";

export class DynamoDAOFactory extends DAOFactory {
  private _userDAO: IUserDAO | undefined;
  private _followDAO: IFollowDAO | undefined;
  private _authTokenDAO: IAuthtokenDAO | undefined;
  private _imageDAO: IImageDAO | undefined;
  private _statusDAO: IStatusDAO | undefined;

  public getUserDAO(): IUserDAO {
    if (!this._userDAO) {
      this._userDAO = new UserDAO();
    }
    return this._userDAO;
  }

  public getFollowDAO(): IFollowDAO {
    if (!this._followDAO) {
      this._followDAO = new FollowDAO();
    }
    return this._followDAO;
  }

  public getAuthTokenDAO(): IAuthtokenDAO {
    if (!this._authTokenDAO) {
      this._authTokenDAO = new AuthtokenDAO();
    }
    return this._authTokenDAO;
  }

  public getImageDAO(): IImageDAO {
    if (!this._imageDAO) {
      this._imageDAO = new ImageDAO();
    }
    return this._imageDAO;
  }

  public getStatusDAO(): IStatusDAO {
    if (!this._statusDAO) {
      this._statusDAO = new StatusDAO();
    }
    return this._statusDAO;
  }
}
