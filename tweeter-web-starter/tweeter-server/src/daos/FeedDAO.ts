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

  constructor(db: DynamoDBClient) {
    this.client = db;
  }

  public async updateFeed(
    alias: string,
    timestamp: string,
    post: string
  ): Promise<void> {
    console.log("updateFeed: " + alias + " " + timestamp + " " + post);
    const params: PutItemInput = {
      TableName: this.TABLE_NAME,
      Item: {
        post: { S: post },
        timestamp: { S: timestamp },
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
              ["post"]: Status.fromDto(lastItem)?.toJson,
              ["timestamp"]: Status.fromDto(lastItem)?.timestamp.toString(),
              [this.USER_ALIAS]: lastItem.user,
            },
    };

    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    if (data.Items) {
      for (const item of data.Items) {
        const post = item["post"].S;
        if (post != null) {
          const status = Status.fromJson(post);
          items.push(status!.dto);
        }
      }
    }

    return new DataPage<StatusDto>(items, hasMorePages);
  }
}
