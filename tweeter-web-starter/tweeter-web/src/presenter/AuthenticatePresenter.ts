import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../services/UserService";
import { View, Presenter } from "./Presenter";

export interface AuthenticateVeiw extends View {
  navigate: (url: string) => void;
  logInUser: (user: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export abstract class AuthenticatePresenter<
  T extends AuthenticateVeiw
> extends Presenter<T> {
  private _userService: UserService;

  constructor(view: T) {
    super(view);
    this._userService = new UserService();
  }

  protected get userService() {
    return this._userService;
  }

  public async doAuthenticateAndNavigate(
    authenticate: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string | undefined
  ) {
    this.doFailureReportingOperation(
      this.getOperationDescription(),
      async () => {
        const [user, authToken] = await authenticate();

        this.view.logInUser(user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      }
    );
  }

  protected abstract getOperationDescription(): string;
}
