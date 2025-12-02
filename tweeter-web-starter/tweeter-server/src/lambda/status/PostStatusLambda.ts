import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  await statusService.postStatus(request.authtoken, request.statusDto);

  return { success: true, message: "success" };
};
