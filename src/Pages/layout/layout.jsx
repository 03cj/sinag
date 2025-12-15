import { Outlet, useLocation } from 'react-router-dom'; // <-- useLocation imported
import Header from '../../Components/Header';
import { useAuth } from '../../Context/AuthContext'; // <-- useAuth imported

const layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // Get authentication status

  const LOGIN_PATH = '/login'; // Base path for all login forms

  // The Header shows only if the user is logged in AND is not on any /login route.
  // We use .includes(LOGIN_PATH) to catch /login/user, /login/coordinator, etc.
  const shouldShowHeader = isAuthenticated && !location.pathname.includes(LOGIN_PATH);

  return (
    <>
      {/* Conditionally render the Header */}
      {shouldShowHeader && <Header />}

      {/* Outlet renders the specific page component */}
      <Outlet />
    </>
  );
};

export default layout;
