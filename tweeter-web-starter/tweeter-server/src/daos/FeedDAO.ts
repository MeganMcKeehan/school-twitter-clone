import {
  DynamoDBClient,
  PutItemCommand,
  PutItemInput,
} from "@aws-sdk/client-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DataPage, Status, StatusDto } from "tweeter-shared";
import { IFeedDAO } from "./interfaces/IFeedDao";

export class FeedDAO implements IFeedDAO {
  private client: DynamoDBClient;
  private TABLE_NAME = "feed-table";
  private USER_ALIAS: string = "user_alias";
  private TIMESTAMP: string = "timestamp";

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async updateFeed(alias: string, status: StatusDto): Promise<void> {
    const params: PutItemInput = {
      TableName: this.TABLE_NAME,
      Item: {
        post: { S: Status.fromDto(status)!.toJson() },
        user_alias: { S: alias },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      console.log("result : ", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async getFeed(
    alias: string,
    lastItem: StatusDto | null = null,
    limit: number = 10
  ): Promise<DataPage<StatusDto>> {
    const params: QueryCommandInput = {
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
    data.Items?.forEach((item) => {
      if (item) {
        items.push(Status.fromJson(item["post"].S)!.dto);
      }
    });

    return new DataPage<StatusDto>(items, hasMorePages);
  }
}
