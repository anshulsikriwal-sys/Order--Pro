import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

// Wraps /login and /register so a user who is already signed in
// cannot navigate back to them (including via the browser back button).
function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default GuestRoute;
