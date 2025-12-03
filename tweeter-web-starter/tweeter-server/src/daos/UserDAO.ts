import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { IUserDAO } from "./interfaces/IUserDAO";
import { User, UserDto } from "tweeter-shared";

export class UserDAO implements IUserDAO {
  private client: DynamoDBClient;

  private TABLE_NAME = "user-table";

  constructor(db: DynamoDBClient) {
    this.client = db;
  }

  public async getUserInformation(alias: string): Promise<UserDto | undefined> {
    const params: GetCommandInput = {
      TableName: this.TABLE_NAME,
      Key: { alias: { S: alias } },
    };
    try {
      const data = await this.client.send(new GetItemCommand(params));
      console.log("result : ", data);
      if (
        !!data?.Item &&
        !!data.Item["firstName"]?.S &&
        !!data.Item["lastName"]?.S &&
        !!data.Item["imageUrl"]?.S
      ) {
        return new User(
          data.Item["firstName"].S,
          data.Item["lastName"].S,
          alias,
          data.Item["imageUrl"].S
        ).dto;
      }
    } catch (error) {
      console.error("Error retrieving user: ", error);
      return new User("", "", "", "");
    }
  }

  public async addUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ) {
    const params = {
      TableName: this.TABLE_NAME,
      Item: {
        firstName: { S: firstName },
        lastName: { S: lastName },
        alias: { S: alias },
        imageUrl: { S: imageUrl },
      },
    };
    try {
      await this.client.send(new PutItemCommand(params));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
