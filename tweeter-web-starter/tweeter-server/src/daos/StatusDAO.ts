import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { Status, StatusDto } from "tweeter-shared";

export class StatusDAO {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async addStatus(newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: "status",
      Item: {
        post: { S: newStatus.post },
        timestamp: { N: newStatus.timestamp },
        user: { S: newStatus.user.alias },
      },
    };
    try {
      const data = await this.client.send(new PutItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public async getStatus(
    alias: String
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
}
