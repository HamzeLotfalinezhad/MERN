import React from 'react';
import { useLocation } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';

const MainNavbar = () => {
  // const user = useSelector(selectUser); // Get user authentication state from Redux store
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : (
        <UserNavbar />
      )}
    </div>
  );
};

export default MainNavbar;
