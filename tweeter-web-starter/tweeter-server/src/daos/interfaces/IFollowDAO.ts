import { DataPage } from "tweeter-shared";

export interface IFollowDAO {
  getFollowers(
    userAlias: string,
    lastItem: string | undefined,
    limit: number
  ): Promise<DataPage<string>>;
  getFollowees(
    userAlias: string,
    lastItem: string | undefined,
    limit: number
  ): Promise<DataPage<string>>;
  addFollow(follower: string, followee: string): Promise<void>;
  deleteFollow(follower: string, followee: string): Promise<void>;
  isFollower(user: string, selectedUser: string): Promise<boolean>;
  getFollowerCount(userAlias: string): Promise<number>;
  getFolloweeCount(userAlias: string): Promise<number>;
}
