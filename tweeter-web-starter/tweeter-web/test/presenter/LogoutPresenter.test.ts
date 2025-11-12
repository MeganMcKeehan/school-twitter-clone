import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutVeiw,
} from "../../src/presenter/LogoutPresenter";

import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/services/UserService";

describe("logoutPresenter", () => {
  let mockLogoutVeiw: LogoutVeiw;
  let logoutPresenter: LogoutPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("", Date.now());

  beforeEach(() => {
    mockLogoutVeiw = mock<LogoutVeiw>();
    const mockLogoutVeiwInstance = instance(mockLogoutVeiw);

    const logoutPresenterSpy = spy(new LogoutPresenter(mockLogoutVeiwInstance));
    logoutPresenter = instance(logoutPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(logoutPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to dispay a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutVeiw.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct authtoken", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to clear the last info message and clear the user info when the logout is successful", async () => {
    await logoutPresenter.logOut(authToken);

    verify(mockLogoutVeiw.deleteMessage(anything())).once();
    verify(mockLogoutVeiw.clearUserInfo()).once();

    verify(mockLogoutVeiw.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when the logout is not successful", async () => {
    const error = new Error("an error occured");
    when(mockUserService.logout(anything())).thenThrow(error);

    await logoutPresenter.logOut(authToken);

    verify(mockLogoutVeiw.displayErrorMessage(anything())).once();

    verify(mockLogoutVeiw.deleteMessage(anything())).never();
    verify(mockLogoutVeiw.clearUserInfo()).never();
  });
});
