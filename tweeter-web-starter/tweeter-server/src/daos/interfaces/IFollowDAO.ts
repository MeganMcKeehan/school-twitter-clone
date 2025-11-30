import { UserDto } from "tweeter-shared";

export interface IFollowDAO {
  getFollowers(userAlias: string): UserDto[];
  getFollowees(userAlias: string): UserDto[];
  addFollow(follower: string, followee: string): void;
  deleteFollow(follower: string, followee: string): void;
  isFollower(user: string, selectedUser: string): boolean;
}
