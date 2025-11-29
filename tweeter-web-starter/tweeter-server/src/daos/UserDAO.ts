import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";

export class UserDAO {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async getUserInformation(
    alias: string
  ): Promise<Record<string, AttributeValue> | undefined> {
    const params: GetCommandInput = {
      TableName: "users",
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

  public async addUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string
  ) {
    const params = {
      TableName: "users",
      Item: {
        firstName: { S: firstName },
        lastName: { S: lastName },
        alias: { S: alias },
        password: { S: password },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
