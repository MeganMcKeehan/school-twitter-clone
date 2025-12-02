import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import { IAuthtokenDAO } from "./interfaces/IAuthTokenDAO";

export class AuthtokenDAO implements IAuthtokenDAO {
  private client: DynamoDBClient;

  private TABLE_NAME = "authtoken-table";
  private TIME_TILL_TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async generateAuthToken(alias: string): Promise<string> {
    const newAuthToken = AuthToken.Generate();
    const params: PutItemCommandInput = {
      TableName: this.TABLE_NAME,
      Item: {
        token: { S: newAuthToken.token },
        timestamp: { N: newAuthToken.timestamp.toString() },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      return newAuthToken.token;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  public async isValidAuthToken(
    authToken: AuthToken | string
  ): Promise<boolean> {
    let token: string;
    if (authToken instanceof AuthToken) {
      token = authToken.token;
    } else {
      token = authToken;
    }
    const params: GetCommandInput = {
      TableName: this.TABLE_NAME,
      Key: { token },
    };
    try {
      const data = await this.client.send(new GetItemCommand(params));
      if (!data.Item) {
        return false;
      }
      const timestamp = Number(data.Item["timestamp"].N);
      if (Date.now() < timestamp + this.TIME_TILL_TOKEN_EXPIRATION_MS) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  public async deleteAuthToken(authToken: AuthToken | string): Promise<void> {
    let token: string;
    if (authToken instanceof AuthToken) {
      token = authToken.token;
    } else {
      token = authToken;
    }
    const params: DeleteItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        followerAlias: { S: token },
      },
    };
    try {
      const data = await this.client.send(new DeleteItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async removeExpiredTokens(): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        followerAlias: { S: "aaaaa" },
      },
    };
    try {
      const data = await this.client.send(new DeleteItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
