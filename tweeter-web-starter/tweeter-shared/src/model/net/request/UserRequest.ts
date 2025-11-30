import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UserRequest extends TweeterRequest {
  readonly authToken: string;
  readonly user: UserDto;
}
