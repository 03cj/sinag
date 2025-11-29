import { LogOut, User } from 'lucide-react'; // LayoutDashboard is now included again
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const SupervisorNav = () => {
  const navigate = useNavigate();

  // 1. **Correction:** Define the Dashboard item in navItems.
  //    Using path="." targets the index route of the current parent path.
  const navItems = [];

  // Handler for logout functionality
  const handleLogout = () => {
    console.log('Logging out supervisor...');
    // You should also clear authentication tokens/state here
    navigate('/pup-sinag'); // Redirect to the login route
  };

  return (
    <div>
      <nav className="bg-red-900 text-white py-2 px-4 md:py-3 md:px-6 shadow-md flex flex-wrap justify-between items-center mt-5">
        {/* Static Dashboard Title/Brand Area */}
        <div className="flex items-center">
          <span className="text-xl font-bold italic text-yellow-400">Supervisor Dashboard</span>
        </div>

        {/* Navigation Links container */}
        <div className="flex flex-wrap gap-x-2 gap-y-1 md:gap-6 items-center mb-2 md:mb-0">
          {/* 2. **Correction:** This map now renders the Dashboard NavLink. */}
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              // The `end` prop is crucial for index routes (like Dashboard)
              to={item.path}
              end={item.path === '.'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 rounded-md hover:bg-yellow-600 transition ${
                  isActive ? 'bg-red-700' : ''
                }`
              }
            >
              {item.icon}
              <span className="text-sm md:text-base">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Profile and Logout links container */}
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          {/* Profile link: */}
          <NavLink to="profile" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <User size={24} />
            <span className="text-sm md:text-base">Profile</span>
          </NavLink>

          {/* Logout Button/Link */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-yellow-300 transition bg-transparent border-none cursor-pointer p-0"
          >
            <LogOut size={24} />
            <span className="text-sm md:text-base">Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SupervisorNav;
