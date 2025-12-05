import { User } from "tweeter-shared";
import { Link } from "react-router-dom";
import { UserNavigationHook } from "../userNavHook/userNavigationHook";

interface Props {
  value: User;
  location: string;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = UserNavigationHook();

  const user = props.value;
  const alias = user.alias.includes("@") ? user.alias : "@" + user.alias;

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
                to={alias}
                onClick={(event) => navigateToUser(event, props.location)}
              >
                {alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
