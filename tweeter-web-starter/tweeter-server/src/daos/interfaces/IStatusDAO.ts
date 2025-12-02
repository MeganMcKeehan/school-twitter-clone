import { DataPage, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  addStatus(newStatus: StatusDto): Promise<void>;
  getStory(
    alias: string,
    lastItem: StatusDto | null,
    limit: number
  ): Promise<DataPage<StatusDto>>;
  getFeed(
    lastItem: StatusDto | null,
    limit: number
  ): Promise<DataPage<StatusDto>>;
}
