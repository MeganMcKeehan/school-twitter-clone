import { TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (event: any): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  for (let i = 0; i < event.Records.length; ++i) {
    const { request } = event.Records[i];

    await statusService.updateFeed(request.userAlias, request.statusDto);
  }

  return { success: true, message: "success" };
};
