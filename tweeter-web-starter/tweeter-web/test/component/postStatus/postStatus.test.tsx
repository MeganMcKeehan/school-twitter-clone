import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { capture, instance, mock, verify } from "@typestrong/ts-mockito";

import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostPresenter } from "../../../src/presenter/PostPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHooks";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  default: jest.fn(),
}));

const mockUserInstance = new User("test", "test", "@test", "");

const mockAuthTokenInstance = new AuthToken("aaaa", 1519211809934);

describe("post status component", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the post status and clear buttons disabled", () => {
    const { postButton, clearButton } = renderLoginAndGetElement();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons if text field has text", async () => {
    const { user, postButton, clearButton, postFeild } =
      renderLoginAndGetElement();

    await user.type(postFeild, "a");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the sign in button if either feild is cleared", async () => {
    const { user, postButton, clearButton, postFeild } =
      renderLoginAndGetElement();

    await user.type(postFeild, "a");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postFeild);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenters postStatus method with the correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const post = "@test";

    const { user, postButton, postFeild } = renderLoginAndGetElement(
      mockPresenterInstance
    );

    await user.type(postFeild, post);

    await user.click(postButton);

    verify(
      mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)
    ).once();

    console.log(capture(mockPresenter.submitPost).last());
  });
});

const renderLogin = (presenter?: PostPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (presenter?: PostPresenter) => {
  const user = userEvent.setup();

  renderLogin(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postFeild = screen.getByLabelText("post text box");

  return { user, postButton, clearButton, postFeild };
};
