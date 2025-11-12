import { Status } from "tweeter-shared";
import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import { UserNavigationHook } from "../userNavHook/userNavigationHook";

interface Props {
  value: Status;
  location: string;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = UserNavigationHook();

  const user = props.value.user;
  const status = props.value;

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {user.firstName} {user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={user.alias}
                onClick={(event) => navigateToUser(event, props.location)}
              >
                {user.alias}
              </Link>
            </h2>
            {status && (
              <>
                {status.formattedDate}
                <br />
                <Post status={status} featurePath={props.location} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
