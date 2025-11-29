import { User } from "tweeter-shared";

export interface FollowDAO {
  getFollowers(): User[];
  getFollowees(): User[];
  addFollow(): void;
  updateFollow(): void;
  deleteFollow(): void;
}
