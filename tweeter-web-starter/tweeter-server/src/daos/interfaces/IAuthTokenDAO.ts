import { AuthToken } from "tweeter-shared";

export interface IAuthtokenDAO {
  generateAuthToken(alias: string): AuthToken;

  isValidAuthToken(authToken: AuthToken | string): boolean;

  deleteAuthToken(authToken: AuthToken | string): void;

  removeExpiredTokens(): void;
}
