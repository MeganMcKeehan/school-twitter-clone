import {
  DynamoDBClient,
  PutItemCommand,
  PutItemInput,
} from "@aws-sdk/client-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DataPage, Status, StatusDto } from "tweeter-shared";
import { IStatusDAO } from "./interfaces/IStatusDAO";

export class StatusDAO implements IStatusDAO {
  private client: DynamoDBClient;
  private TABLE_NAME = "status-table";
  private USER_ALIAS: string = "user_alias";
  private TIMESTAMP: string = "timestamp";

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async addStatus(newStatus: StatusDto): Promise<void> {
    const params: PutItemInput = {
      TableName: this.TABLE_NAME,
      Item: {
        post: { S: newStatus.post },
        timestamp: { S: newStatus?.timestamp.toString() },
        user_alias: { S: newStatus?.user?.alias },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      console.log("result : ", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async getStory(
    alias: string,
    lastItem: StatusDto | null = null,
    limit: number = 10
  ): Promise<DataPage<StatusDto>> {
    const params = {
      KeyConditionExpression: this.USER_ALIAS + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              ["post"]: lastItem.post,
              [this.USER_ALIAS]: lastItem.user,
              [this.TIMESTAMP]: lastItem.timestamp.toString(),
            },
    };

    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Status(item["post"], item[this.USER_ALIAS], item[this.TIMESTAMP])
          .dto
      )
    );

    return new DataPage<StatusDto>(items, hasMorePages);
  }

  public async getFeed(
    lastItem: StatusDto | null = null,
    limit: number = 10
  ): Promise<DataPage<StatusDto>> {
    const params: QueryCommandInput = {
      TableName: this.TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              ["post"]: lastItem.post,
              [this.USER_ALIAS]: lastItem.user,
              [this.TIMESTAMP]: lastItem.timestamp.toString(),
            },
    };

    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Status(item["post"], item[this.USER_ALIAS], item[this.TIMESTAMP])
          .dto
      )
    );

    return new DataPage<StatusDto>(items, hasMorePages);
  }
}
