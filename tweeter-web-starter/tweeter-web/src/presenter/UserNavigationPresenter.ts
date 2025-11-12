import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../services/UserService";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(veiw: UserNavigationView) {
    super(veiw);
    this.userService = new UserService();
  }

  public async navigateToUser(
    username: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation("get user", async () => {
      const alias = this.extractAlias(username);

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    });
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
