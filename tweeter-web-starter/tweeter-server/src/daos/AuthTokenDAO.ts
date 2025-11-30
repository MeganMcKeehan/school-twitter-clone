import { AuthToken } from "tweeter-shared";

export class AuthtokenDAO {
  private _db: any;

  constructor(db: any) {
    this._db = db;
  }

  public generateAuthToken(alias: string) {}

  public isValidAuthToken(authToken: AuthToken | string) {}

  public deleteAuthToken(authToken: AuthToken | string) {}

  public removeExpiredTokens() {}
}
