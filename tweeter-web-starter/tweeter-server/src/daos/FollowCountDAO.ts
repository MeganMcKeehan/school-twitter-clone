import {
  DynamoDBClient,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  GetCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

export class FollowCountDAO {
  private client: DynamoDBClient;
  private TABLE_NAME = "follow-count-table";
  private FOLLOWEE_COUNT = "followee_count";
  private FOLLOWER_COUNT = "follower_count";

  constructor(db: DynamoDBClient) {
    this.client = db;
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    try {
      const data = await this.getFollowCountsGeneric(userAlias);
      return Number(data.Item?.follower_count?.N) || 0;
    } catch {
      return 0;
    }
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    try {
      const data = await this.getFollowCountsGeneric(userAlias);
      return Number(data.Item?.followee_count?.N) || 0;
    } catch {
      return 0;
    }
  }

  public async getFollowCounts(
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    try {
      const data = await this.getFollowCountsGeneric(userAlias);
      return [
        Number(data.Item?.follower_count?.N) || 0,
        Number(data.Item?.followee_count?.N) || 0,
      ];
    } catch {
      return [0, 0];
    }
  }

  public async setFollowCounts(
    userAlias: string,
    followeeCount: number,
    followerCount: number
  ): Promise<[number, number]> {
    const params: PutItemCommandInput = {
      Item: {
        user_alias: { S: userAlias },
        followee_count: { N: followeeCount.toString() },
        follower_count: { N: followerCount.toString() },
      },
      TableName: this.TABLE_NAME,
    };
    try {
      await this.client.send(new PutItemCommand(params));
      return [followeeCount, followerCount];
    } catch {
      return [0, 0];
    }
  }

  public async incrementFolloweeCount(userAlias: string): Promise<void> {
    await this.genericIncrement(userAlias, this.FOLLOWEE_COUNT, 1);
  }

  public async decrementFolloweeCount(userAlias: string): Promise<void> {
    await this.genericIncrement(userAlias, this.FOLLOWEE_COUNT, -1);
  }

  public async incrementFollowerCount(userAlias: string): Promise<void> {
    await this.genericIncrement(userAlias, this.FOLLOWER_COUNT, 1);
  }

  public async decrementFollowerCount(userAlias: string): Promise<void> {
    await this.genericIncrement(userAlias, this.FOLLOWER_COUNT, -1);
  }

  private async getFollowCountsGeneric(
    userAlias: string
  ): Promise<GetCommandOutput> {
    const params: GetItemCommandInput = {
      Key: { user_alias: { S: userAlias } },
      TableName: this.TABLE_NAME,
    };
    return await this.client.send(new GetCommand(params));
  }

  private async genericIncrement(
    userAlias: string,
    attributeToIncrement: string,
    incrementAmount: number
  ) {
    const params: UpdateCommandInput = {
      TableName: this.TABLE_NAME,
      Key: { ["user_alias"]: userAlias },
      ExpressionAttributeValues: { ":inc": incrementAmount },
      UpdateExpression:
        "SET " +
        attributeToIncrement +
        " = " +
        attributeToIncrement +
        " + :inc",
    };
    await this.client.send(new UpdateCommand(params));
  }
}
