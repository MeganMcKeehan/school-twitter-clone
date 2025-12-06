export interface IFollowCountDAO {
  getFollowerCount(userAlias: string): Promise<number>;
  getFolloweeCount(userAlias: string): Promise<number>;
  getFollowCounts(userAlias: string): Promise<[number, number]>;
  setFollowCounts(
    userAlias: string,
    followeeCount: number,
    followerCount: number
  ): Promise<[number, number]>;
  incrementFolloweeCount(userAlias: string): Promise<void>;
  incrementFollowerCount(userAlias: string): Promise<void>;
  decrementFolloweeCount(userAlias: string): Promise<void>;
  decrementFollowerCount(userAlias: string): Promise<void>;
}
