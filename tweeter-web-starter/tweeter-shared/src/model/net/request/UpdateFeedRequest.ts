import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UpdateFeedRequest extends TweeterRequest {
  readonly userAlias: string;
  readonly statusDto: StatusDto;
}
