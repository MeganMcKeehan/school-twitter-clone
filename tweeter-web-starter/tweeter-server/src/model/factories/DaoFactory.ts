import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { IFollowDAO } from "../../daos/interfaces/IFollowDAO";
import { IImageDAO } from "../../daos/interfaces/IImageDAO";
import { IPasswordDAO } from "../../daos/interfaces/IPasswordDAO";
import { IStatusDAO } from "../../daos/interfaces/IStatusDAO";
import { IUserDAO } from "../../daos/interfaces/IUserDAO";

export abstract class DAOFactory {
  public abstract getUserDAO(): IUserDAO;
  public abstract getFollowDAO(): IFollowDAO;
  public abstract getImageDAO(): IImageDAO;
  public abstract getStatusDAO(): IStatusDAO;
  public abstract getAuthTokenDAO(): IAuthtokenDAO;
  public abstract getPasswordDAO(): IPasswordDAO;
}
