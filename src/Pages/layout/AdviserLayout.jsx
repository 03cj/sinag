import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom'; // Import useNavigate for redirection
import { User, LayoutDashboard, GraduationCap, Plus, Building, FileText, LogOut } from 'lucide-react'; // Import LogOut icon

const AdviserLayout = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Define the navigation items for the adviser
  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Interns', path: 'interns', icon: <GraduationCap size={20} /> },
    { name: 'Companies', path: 'companies', icon: <Building size={20} /> },
    { name: 'Reports', path: 'reports', icon: <FileText size={20} /> },
    
  ];

  // Handler for logout functionality
  const handleLogout = () => {
    console.log("Logging out adviser...");
   
    navigate('/pup-sinag'); // Redirect to the pup-sinag route
  };

  return (
    <div>
    <nav className="bg-red-900 text-white py-2 px-4 md:py-3 md:px-6 shadow-md flex flex-wrap justify-between items-center mt-5">
    
      <div className="flex flex-wrap gap-x-2 gap-y-1 md:gap-6 items-center mb-2 md:mb-0">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
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
        {/* Profile link:
            mt-2 md:mt-0: Adds top margin on small screens if the nav items wrap. */}
        <NavLink
          to="profile"
          className="flex items-center gap-2 hover:text-yellow-300 transition"
        >
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

export default AdviserLayout;
