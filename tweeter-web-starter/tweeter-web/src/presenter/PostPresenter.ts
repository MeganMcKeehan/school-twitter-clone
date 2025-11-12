import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../services/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostVeiw extends View {
  displayErrorMessage: (error: string) => void;
  displayInfoMessage: (message: string, time: number) => string;
  deleteMessage: (messageId: string) => void;
  setPost: (message: string) => void;
}

export class PostPresenter extends Presenter<PostVeiw> {
  _statusService: StatusService;

  constructor(view: PostVeiw) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation("post the status", async () => {
      const postToastId = this.view.displayInfoMessage("Posting status...", 0);
      const status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.deleteMessage(postToastId);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    });
  }
}
