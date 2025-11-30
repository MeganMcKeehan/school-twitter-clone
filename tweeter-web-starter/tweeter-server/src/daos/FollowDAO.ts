import {
  AttributeValue,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";

export class FollowDAO {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({});
  }
  public async getFollowers(
    alias: string
  ): Promise<Record<string, AttributeValue> | undefined> {
    const params: GetCommandInput = {
      TableName: "status",
      Key: { alias },
    };
    try {
      const data = await this.client.send(new GetItemCommand(params));
      console.log("result : " + JSON.stringify(data));
      return data.Item;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  public async getFollowees(
    alias: string
  ): Promise<Record<string, AttributeValue> | undefined> {
    const params: GetCommandInput = {
      TableName: "status",
      Key: { alias },
    };
    try {
      const data = await this.client.send(new GetItemCommand(params));
      console.log("result : " + JSON.stringify(data));
      return data.Item;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async addFollow(follower: string, followee: string): Promise<void> {
    const params = {
      TableName: "follows",
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

  public async deleteFollow(): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: "follows",
      Key: {},
    };
    try {
      const data = await this.client.send(new DeleteItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
