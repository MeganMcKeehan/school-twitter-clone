import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected async getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFeedItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load feed";
  }
}
