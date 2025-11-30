import { UserDto } from "tweeter-shared";

export interface IUserDAO {
  getUserInformation(alias: string): UserDto;

  updateFollowerCount(): void;

  updateFolloweeCount(): void;

  addUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string
  ): UserDto;
}
