import { TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (event: any): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  console.log(event);
  for (let i = 0; i < event.Records.length; ++i) {
    const request = JSON.parse(event.Records[i].body);
    console.log(request);
    if (request) {
      await statusService.postUpdateFeedMessages(
        request.postingUserAlias,
        request.statusDto
      );
    }
  }

  return { success: true, message: "success" };
};
