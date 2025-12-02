import { UserDto } from "tweeter-shared";

export interface IUserDAO {
  getUserInformation(alias: string): Promise<UserDto>;

  addUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ): Promise<void>;
}
