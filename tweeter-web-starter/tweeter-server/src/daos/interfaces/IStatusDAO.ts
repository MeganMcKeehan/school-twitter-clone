import { DataPage, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  addStatus(alias: string, post: string): Promise<void>;
  getStory(
    alias: string,
    lastItem: StatusDto | null,
    limit: number
  ): Promise<DataPage<StatusDto>>;
}
