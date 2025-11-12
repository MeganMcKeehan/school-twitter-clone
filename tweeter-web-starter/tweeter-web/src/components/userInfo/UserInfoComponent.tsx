import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import useUserInfo from "./UserInfoHooks";
import useUserInfoActions from "../userInfo/UserInfoListenerHook";

import {
  UserInfoPresenter,
  UserInfoVeiw,
} from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees();
    setNumbFollowers();
  }, [displayedUser]);

  const listener: UserInfoVeiw = {
    displayErrorMessage: displayErrorMessage,
    setFolloweeCount: setFolloweeCount,
    setIsFollower: setIsFollower,
    setFollowerCount: setFollowerCount,
  };

  const [presenter] = useState(new UserInfoPresenter(listener));

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    presenter.setIsFollowerStatus(authToken, currentUser, displayedUser);
  };

  const setNumbFollowers = () => {
    presenter.setNumbFollowers(authToken!, displayedUser!);
  };
  const setNumbFollowees = () => {
    presenter.setNumbFollowees(authToken!, displayedUser!);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const messageId = displayInfoMessage(
      `Following ${displayedUser!.name}...`,
      3000
    );
    await presenter.followDisplayedUser(authToken!, displayedUser!);
    setIsLoading(false);
  };

  const unfollowDisplayedUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 3000);
    await presenter.unfollowDisplayedUser(authToken!, displayedUser!);
    setIsLoading(false);
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
