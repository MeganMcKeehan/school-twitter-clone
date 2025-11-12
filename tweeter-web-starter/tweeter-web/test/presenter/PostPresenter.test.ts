import { AuthToken, User } from "tweeter-shared";
import { PostVeiw, PostPresenter } from "../../src/presenter/PostPresenter";

import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/services/StatusService";

describe("logoutPresenter", () => {
  let mockPostVeiw: PostVeiw;
  let postPresenter: PostPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("", Date.now());
  const user = new User("jelly", "car", "@banana", "");

  beforeEach(() => {
    mockPostVeiw = mock<PostVeiw>();
    const mockPostVeiwInstance = instance(mockPostVeiw);

    const postPresenterSpy = spy(new PostPresenter(mockPostVeiwInstance));
    postPresenter = instance(postPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to dispay a posting status message", async () => {
    await postPresenter.submitPost("post", user, authToken);
    verify(mockPostVeiw.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("calls post staus on the status service with the correct authtoken", async () => {
    await postPresenter.submitPost("post", user, authToken);
    verify(mockStatusService.postStatus(authToken, anything())).once();
  });

  it("tells the view to clear the last info message, clear the post, and display status posted message when the post status is successful", async () => {
    await postPresenter.submitPost("post", user, authToken);

    verify(mockPostVeiw.deleteMessage(anything())).once();
    verify(mockPostVeiw.setPost("")).once();
    verify(mockPostVeiw.displayInfoMessage("Status posted!", 2000)).once();

    verify(mockPostVeiw.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and tells it to clear the last info message, and doesnt clear the post or display a status posted message when the post status is not successful", async () => {
    const error = new Error("an error occured");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postPresenter.submitPost("post", user, authToken);

    verify(mockPostVeiw.displayErrorMessage(anything())).once();

    verify(mockPostVeiw.deleteMessage(anything())).never();
    verify(mockPostVeiw.setPost("")).never();
  });
});
