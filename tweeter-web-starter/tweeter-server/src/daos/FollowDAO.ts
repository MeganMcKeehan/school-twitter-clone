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
  private FOLLOWER_ALIAS = "follower_handle";
  private FOLLWEE_ALIAS = "followee_handle";
  constructor(db: DynamoDBClient) {
    this.client = db;
  }

  public async getFollowers(
    alias: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.FOLLOWER_ALIAS + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.FOLLOWER_ALIAS]: lastItem,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    if (data.Items) {
      data.Items?.forEach((item) => items.push(item[this.FOLLWEE_ALIAS]));
    }

    return [items, hasMorePages];
  }
  public async getFollowees(
    alias: string,
    lastItem: string | undefined = undefined,
    limit: number = 10
  ): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.FOLLWEE_ALIAS + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.TABLE_NAME,
      IndexName: "follows-index",
      Limit: limit,
      ExclusiveStartKey:
        lastItem === undefined // this has a type error if undefined
          ? undefined
          : {
              [this.FOLLWEE_ALIAS]: lastItem,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    console.log(data);
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    if (data.Items) {
      data.Items?.forEach((item) => items.push(item[this.FOLLOWER_ALIAS]));
    }

    return [items, hasMorePages];
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
      console.log("result : " + data);
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
      console.log("result : " + data);
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
      KeyConditionExpression: this.FOLLWEE_ALIAS + " = :alias",
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
      KeyConditionExpression: this.FOLLOWER_ALIAS + " = :alias",
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
