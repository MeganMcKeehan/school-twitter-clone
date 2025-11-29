import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  addStatus(newStatus: StatusDto): void;
  getStatus(): Promise<Record<string, AttributeValue> | undefined>;
}
