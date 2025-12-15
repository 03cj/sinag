import { Building, FileText, GraduationCap, LayoutDashboard, LogOut, Presentation, User } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const CoordinatorLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Advisers', path: 'adviser', icon: <Presentation size={20} /> },
    { name: 'HTE', path: 'HTE', icon: <Building size={20} /> },
    { name: 'Interns', path: 'interns', icon: <GraduationCap size={20} /> },
    { name: 'Reports', path: 'reports', icon: <FileText size={20} /> },
  ];

  const handleLogout = () => {
    console.log('Logging out...');

    navigate('/pup-sinag');
  };

  return (
    <div>
      <nav className="bg-red-900 text-white py-2 px-4 md:py-3 md:px-6 shadow-md flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-x-2 gap-y-1 md:gap-6 items-center mb-2 md:mb-0">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                // Define base classes, transition, and default text color (e.g., white)
                `flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 rounded-md transition-colors duration-200 
     ${
       isActive
         ? // Active State: Yellow background (bg-yellow-300) and Dark Text (text-gray-900)
           ' text-yellow-300 font-bold'
         : // Inactive State: Default Text (text-white) and Yellow Hover Background
           'text-white hover:text-yellow-300'
     }`
              }
            >
              {item.icon}
              <span className="text-sm md:text-base">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition text-sm font-medium
     ${
       isActive
         ? 'text-yellow-400 font-bold' // <-- Active state: Set color to yellow-400 and bold the text
         : 'text-white hover:text-yellow-400' // <-- Inactive state: Default to white, hover changes to yellow-400
     }`
            }
          >
            <User size={20} />
            {/*Profile*/}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-yellow-300 transition bg-transparent border-none cursor-pointer p-0"
          >
            <LogOut size={20} />
            <span className="text-sm md:text-base">{/*Logout*/}</span>
          </button>
        </div>
      </nav>

      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CoordinatorLayout;
