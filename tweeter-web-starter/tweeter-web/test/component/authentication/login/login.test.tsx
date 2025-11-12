import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("login component", () => {
  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and paswords fields have text", async () => {
    const { user, signInButton, aliasFeild, passwordFeild } =
      renderLoginAndGetElement("/");

    await user.type(aliasFeild, "a");
    await user.type(passwordFeild, "b");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either feild is cleared", async () => {
    const { user, signInButton, aliasFeild, passwordFeild } =
      renderLoginAndGetElement("/");

    await user.type(aliasFeild, "a");
    await user.type(passwordFeild, "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasFeild);
    expect(signInButton).toBeDisabled();

    await user.type(aliasFeild, "a");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordFeild);
    expect(signInButton).toBeDisabled();
  });

  it("call the presenters login method with the correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someUrl.com";
    const alias = "@test";
    const password = "test";

    const { user, signInButton, aliasFeild, passwordFeild } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasFeild, alias);
    await user.type(passwordFeild, password);

    await user.click(signInButton);

    verify(
      mockPresenter.doLogin(alias, password, anything(), originalUrl)
    ).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasFeild = screen.getByLabelText("alias");
  const passwordFeild = screen.getByLabelText("password");

  return { user, signInButton, aliasFeild, passwordFeild };
};
