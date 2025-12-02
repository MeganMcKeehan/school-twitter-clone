import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { IUserDAO } from "./interfaces/IUserDAO";
import { User, UserDto } from "tweeter-shared";

export class UserDAO implements IUserDAO {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({});
  }

  public async getUserInformation(alias: string): Promise<UserDto> {
    const params: GetCommandInput = {
      TableName: "users",
      Key: { alias },
    };
    try {
      const data = await this.client.send(new GetItemCommand(params));
      console.log("result : " + JSON.stringify(data));
      if (
        data.Item &&
        data.Item["firstName"].S &&
        data.Item["lastName"].S &&
        data.Item["imageUrl"].S
      ) {
        return new User(
          data.Item["firstName"].S,
          data.Item["lastName"].S,
          alias,
          data.Item["imageUrl"].S
        );
      }
      return new User("", "", "", "");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  public async addUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    password: string
  ) {
    const params = {
      TableName: "users",
      Item: {
        firstName: { S: firstName },
        lastName: { S: lastName },
        alias: { S: alias },
        imageUrl: { S: imageUrl },
        password: { S: password },
      },
    };
    try {
      await this.client.send(new PutItemCommand(params));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
