import { AuthToken } from "tweeter-shared";

export interface IAuthtokenDAO {
  generateAuthToken(alias: string): Promise<string>;

  isValidAuthToken(authToken: AuthToken | string): Promise<boolean>;

  deleteAuthToken(authToken: AuthToken | string): Promise<void>;

  removeExpiredTokens(): Promise<void>;
}
