import { AuthToken } from "tweeter-shared";

export interface AuthtokenDAO {
  generateAuthToken(alias: string): AuthToken;

  isValidAuthToken(alias: string, authToken: AuthToken): boolean;

  deleteAuthToken(authToken: AuthToken): void;

  removeExpiredTokens(): void;
}
