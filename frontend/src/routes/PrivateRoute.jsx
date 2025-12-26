import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

function PrivateRoute({ allowedRoles }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or <Spinner /> if needed

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login"  replace/>;
  }

  return <Outlet />;
}

export default PrivateRoute;
