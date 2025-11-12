import { AuthToken } from "tweeter-shared";
import { UserService } from "../services/UserService";
import { Presenter, View } from "./Presenter";

export interface LogoutVeiw extends View {
  displayErrorMessage: (error: string) => void;
  clearUserInfo: () => void;
  deleteMessage: (messageId: string) => void;
  displayInfoMessage: (message: string, time: number) => string;
}

export class LogoutPresenter extends Presenter<LogoutVeiw> {
  private _userService: UserService;

  constructor(view: LogoutVeiw) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    this.doFailureReportingOperation("log user out", async () => {
      const loggingOutToastId = this.view.displayInfoMessage(
        "Logging Out...",
        0
      );
      await this.userService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
    });
  }
}
