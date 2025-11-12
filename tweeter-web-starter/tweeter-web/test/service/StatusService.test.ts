import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import "isomorphic-fetch";
import { StatusService } from "../../src/services/StatusService";
import { AuthToken } from "tweeter-shared";

describe("Status Service", () => {
  let serverFacade: StatusService;
  beforeEach(() => {
    serverFacade = new StatusService();
  });

  it("gets stories", async () => {
    const [user, authToken] = await serverFacade.loadMoreStoryItems(
      new AuthToken("aaa", Date.now()),
      "@amy",
      10,
      null
    );
    verify(authToken == true);
  });
});
