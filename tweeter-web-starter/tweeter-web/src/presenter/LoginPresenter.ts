import {
  AuthenticatePresenter,
  AuthenticateVeiw,
} from "./AuthenticatePresenter";

export class LoginPresenter extends AuthenticatePresenter<AuthenticateVeiw> {
  constructor(view: AuthenticateVeiw) {
    super(view);
  }
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    this.doAuthenticateAndNavigate(
      async () => {
        return this.userService.login(alias, password);
      },
      rememberMe,
      originalUrl
    );
  }

  protected getOperationDescription(): string {
    return "log user in";
  }
}
