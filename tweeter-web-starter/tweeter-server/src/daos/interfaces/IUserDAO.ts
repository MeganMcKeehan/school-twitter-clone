import { User } from "tweeter-shared";

export interface IUserDAO {
  getUserInformation(alias: string): User;

  updateFollowerCount(): void;

  updateFolloweeCount(): void;

  addUser(): void;
}
