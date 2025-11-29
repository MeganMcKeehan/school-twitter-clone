import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class databaseConnection {
  private client = new DynamoDBClient({});

  public docClient = DynamoDBDocumentClient.from(this.client);
}
