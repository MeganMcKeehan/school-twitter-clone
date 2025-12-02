import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  Select,
} from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DataPage } from "tweeter-shared";
import { IFollowDAO } from "./interfaces/IFollowDAO";

export class FollowDAO implements IFollowDAO {
  private client: DynamoDBClient;

  private TABLE_NAME = "follow-table";
  private PRIMARY_KEY = "follower_handle";
  private SECONDARY_KEY = "followee_handle";

  constructor() {
    this.client = new DynamoDBClient({});
  }
  public async getFollowers(
    alias: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<DataPage<string>> {
    const params = {
      KeyConditionExpression: this.PRIMARY_KEY + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              ["alias"]: lastItem,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item["alias"]));

    return new DataPage<string>(items, hasMorePages);
  }
  public async getFollowees(
    alias: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<DataPage<string>> {
    const params = {
      KeyConditionExpression: this.SECONDARY_KEY + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.TABLE_NAME,
      IndexName: "follows-index",
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              ["alias"]: lastItem,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item["alias"]));

    return new DataPage<string>(items, hasMorePages);
  }

  async addFollow(follower: string, followee: string): Promise<void> {
    const params = {
      TableName: this.TABLE_NAME,
      Item: {
        followerAlias: { S: follower },
        followeeAlias: { S: followee },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async deleteFollow(user: string, selectedUser: string): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        follower_handle: { S: user },
        followee_handle: { S: selectedUser },
      },
    };
    try {
      const data = await this.client.send(new DeleteItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async isFollower(
    user: string,
    selectedUser: string
  ): Promise<boolean> {
    const params: GetItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        followee_handle: { S: selectedUser },
        follower_handle: { S: user },
      },
    };

    try {
      const data = await this.client.send(new GetItemCommand(params));
      return data ? true : false;
    } catch {
      return false;
    }
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    const params = {
      KeyConditionExpression: this.SECONDARY_KEY + " = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      TableName: this.TABLE_NAME,
      IndexName: "follows-index",
      Select: Select.COUNT,
    };
    try {
      const data = await this.client.send(new QueryCommand(params));
      return data.Count || 0;
    } catch {
      return 0;
    }
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    const params = {
      KeyConditionExpression: this.PRIMARY_KEY + " = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      TableName: this.TABLE_NAME,
      Select: Select.COUNT,
    };
    try {
      const data = await this.client.send(new QueryCommand(params));
      return data.Count || 0;
    } catch {
      return 0;
    }
  }
}
