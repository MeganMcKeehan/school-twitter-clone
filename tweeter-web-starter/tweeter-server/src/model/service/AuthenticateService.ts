import { Service } from "aws-sdk";
import { IAuthtokenDAO } from "../../daos/interfaces/IAuthTokenDAO";
import { DAOFactory } from "../factories/DaoFactory";
import { AuthToken } from "tweeter-shared";

export class AuthenticateService extends Service {
  private _authTokenDAO: IAuthtokenDAO;

  constructor(daoFactory: DAOFactory) {
    super();
    this._authTokenDAO = daoFactory.getAuthTokenDAO();
  }

  public async generateAuthToken(alias: string): Promise<string> {
    return await this._authTokenDAO.generateAuthToken(alias);
  }

  public async isValidAuthToken(
    authToken: AuthToken | string
  ): Promise<boolean> {
    const valid = await this._authTokenDAO.isValidAuthToken(authToken);
    if (valid) {
      this._authTokenDAO.updateAuthToken(authToken);
    } else {
      this.deleteAuthToken(authToken);
      throw new Error("invalid authToken");
    }
    return valid;
  }

  public async deleteAuthToken(authToken: AuthToken | string): Promise<void> {
    await this._authTokenDAO.deleteAuthToken(authToken);
  }
}
