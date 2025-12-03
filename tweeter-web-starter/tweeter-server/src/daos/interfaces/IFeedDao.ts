import { DataPage, StatusDto } from "tweeter-shared";

export interface IFeedDAO {
  updateFeed(alias: string, status: StatusDto): Promise<void>;
  getFeed(
    alias: string,
    lastItem: StatusDto | null,
    limit: number
  ): Promise<DataPage<StatusDto>>;
}
