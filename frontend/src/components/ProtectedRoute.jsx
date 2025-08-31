import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace/>;
  return children;

  //if token is not found, it navigates to the "/login" route, but in that hum ek state prop bhi store kar rahe 
  // hai which contains the route the user was tring to hit in the from key, so that when login is complete,
  // we can acces that route and send the user automatically to it as now we have that link in state prop.

  // The replace prop is a boolean. When set, it tells the browser to replace the current entry in the history 
  // stack instead of pushing a new one. This means the user won't be able to hit the "back" button to return 
  // to the protected page they were just redirected from.
}