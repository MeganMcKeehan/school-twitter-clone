import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillUserTableDao {
  //
  // Modify these values as needed to match your user table.
  //
  private readonly tableName = "user-table";
  private followTableName = "follow-count-table";
  private passwordTableName = "password-table";
  private readonly userAliasAttribute = "alias";
  private readonly userFirstNameAttribute = "firstName";
  private readonly userLastNameAttribute = "lastName";
  private readonly userImageUrlAttribute = "imageUrl";
  private readonly passwordHashAttribute = "password";
  private readonly followeeCountAttribute = "followee_count";
  private readonly followerCountAttribute = "follower_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUsers(userList: User[], password: string) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userParams = {
      RequestItems: {
        [this.tableName]: this.createPutUserRequestItems(
          userList,
          hashedPassword
        ),
      },
    };

    const passwordParams = {
      RequestItems: {
        [this.passwordTableName]: this.createPutPasswordRequestItems(
          userList,
          hashedPassword
        ),
      },
    };

    const followCountParams = {
      RequestItems: {
        [this.followTableName]: this.createPutFollowCountRequestItems(userList),
      },
    };

    try {
      const resp = await this.client.send(new BatchWriteCommand(userParams));
      await this.putUnprocessedItems(resp, userParams);
      const followresp = await this.client.send(
        new BatchWriteCommand(followCountParams)
      );
      await this.putUnprocessedItems(followresp, followCountParams);
      const passowrdresp = await this.client.send(
        new BatchWriteCommand(passwordParams)
      );
      await this.putUnprocessedItems(passowrdresp, passwordParams);
    } catch (err) {
      throw new Error(
        `Error while batch writing users with params: ${userParams.RequestItems[
          "user-table"
        ].toString()}: \n${err}`
      );
    }
  }

  private createPutUserRequestItems(userList: User[], hashedPassword: string) {
    return userList.map((user) =>
      this.createPutUserRequest(user, hashedPassword)
    );
  }

  private createPutPasswordRequestItems(
    userList: User[],
    hashedPassword: string
  ) {
    return userList.map((user) =>
      this.createPasswordPutRequest(user, hashedPassword)
    );
  }

  private createPutFollowCountRequestItems(userList: User[]) {
    return userList.map((user) => this.createFollowCountPutRequest(user));
  }

  private createPutUserRequest(user: User, hashedPassword: string) {
    const item = {
      [this.userAliasAttribute]: user.alias,
      [this.userFirstNameAttribute]: user.firstName,
      [this.userLastNameAttribute]: user.lastName,
      [this.passwordHashAttribute]: hashedPassword,
      [this.userImageUrlAttribute]: user.imageUrl,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  createFollowCountPutRequest(user: User) {
    const item = {
      ["user_alias"]: user.alias,
      [this.followerCountAttribute]: 0,
      [this.followeeCountAttribute]: 1,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  createPasswordPutRequest(user: User, hashedPassword: string) {
    const item = {
      [this.userAliasAttribute]: user.alias,
      [this.passwordHashAttribute]: hashedPassword,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 1000;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 10000) {
          delay += 1000;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed users.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }

  async increaseFollowersCount(alias: string, count: number): Promise<boolean> {
    const params = {
      TableName: this.followTableName,
      Key: { [this.userAliasAttribute]: alias },
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression:
        "SET " +
        this.followerCountAttribute +
        " = " +
        this.followerCountAttribute +
        " + :inc",
    };

    try {
      await this.client.send(new UpdateCommand(params));
      return true;
    } catch (err) {
      console.error("Error while updating followers count:", err);
      return false;
    }
  }
}
