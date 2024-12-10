import { Link } from "react-router";
import { useAuth } from "../AuthProvider/AuthProvider";

const PrivateRoute = ({ element }) => {
  const { authState } = useAuth();

  return authState.loggedIn ? (
    element
  ) : (
    <div>
      Not logged in.{" "}
      <Link to={`/login${window.location.search}`}>Login to view data</Link>
    </div>
  );
};

export default PrivateRoute;
