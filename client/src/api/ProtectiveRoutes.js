import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/UserSlice";


const ProtectiveRoutes = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const user = useSelector(selectUser); // store user auth check
  const isAdminRoute = currentPath.startsWith('/admin');

  //prevent admin to go to user urls after login as admin
  if (user && user.isAdmin && !isAdminRoute) return <Navigate to="/admin/profile" />

  // prevent user to go to admin urls after login as user
  if (user && !user.isAdmin && isAdminRoute) return <Navigate to="/user/profile" />

  if (!isAdminRoute) {
    if (currentPath !== "/user/login" && currentPath !== "/user/register") {
      if (!user) return <Navigate to="/user/login" />
    }
    if (currentPath === "/user/login" || currentPath === "/user/register") {
      if (user) return <Navigate to="/user/profile" />
    }
  }

  if (isAdminRoute) {
    if (currentPath !== "/admin/login" && currentPath !== "/admin/register") {
      if (!user) return <Navigate to="/admin/login" />
    }
    if (currentPath === "/admin/login" || currentPath === "/admin/register") {
      if (user) return <Navigate to="/admin/profile" />
    }
  }

  return children;
}

export default ProtectiveRoutes;  