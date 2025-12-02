import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/factories/dynamoFactory";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const followService = new FollowService(daoFactory);
  const userService = new UserService(daoFactory);
  const [items, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  const users: UserDto[] = [];
  for (const item in items) {
    const foundUser = await userService.getUser(request.token, item);
    if (foundUser) {
      users.push(foundUser);
    }
  }
  return {
    success: true,
    message: null,
    items: users,
    hasMore: hasMore,
  };
};
