import { GetCommandInput, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { IPasswordDAO } from "./interfaces/IPasswordDAO";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

export class PasswordDAO implements IPasswordDAO {
  private client: DynamoDBClient;

  private TABLE_NAME = "password-table";

  constructor() {
    this.client = new DynamoDBClient({});
  }
  public async getPassword(alias: string): Promise<string> {
    const params: GetCommandInput = {
      TableName: this.TABLE_NAME,
      Key: { alias: { S: alias } },
    };
    const data = await this.client.send(new GetItemCommand(params));
    console.log("result : ", data);

    const foundPassword = data.Item ? data.Item["password"]?.S : "";

    return foundPassword || "";
  }

  public async addPassword(alias: string, password: string): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.TABLE_NAME,
      Item: {
        alias: { S: alias },
        password: { S: password },
      },
    };
    await this.client.send(new PutItemCommand(params));
  }
}
