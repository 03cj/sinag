import { Building, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdviserLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility

  // Define the navigation items for the adviser
  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Interns', path: 'interns', icon: <GraduationCap size={20} /> },
    { name: 'HTE', path: 'hte', icon: <Building size={20} /> },
    { name: 'Reports', path: 'reports', icon: <FileText size={20} /> },
  ];

  // Handler for logout functionality
  const handleLogout = () => {
    console.log('Logging out adviser...');
    // In a real app, you would clear the user's session here.
    navigate('/pup-sinag'); // Redirect to the login route
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar: Full width, dark background */}
      <nav className="bg-red-900 text-white py-3 px-4 shadow-xl flex flex-col md:flex-row justify-between items-center z-10 ">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          {/* START LEFT GROUP: Logo + Main Nav Items */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:gap-8">
            {/* 1. Logo and Mobile Toggle (Always visible on the top row) */}
            <div className="flex justify-between w-full md:w-auto items-center">
              {/* Mobile Menu Button (Only Visible on Mobile) */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* 2. Main Nav Items (Desktop: Left-aligned, next to logo) */}
            <div className="hidden md:flex flex-row gap-4 items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  // Apply the transition class to the element
                  // and ensure the hover state only changes the colors
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-300 ease-in-out

         ${
           isActive
             ? ' text-yellow-300 font-bold shadow-inner' // Active state: Use the desired active colors
             : 'text-white hover:text-yellow-300 ' // Inactive state: Hover changes text and background colors
         }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
          {/* END LEFT GROUP */}

          {/* 3. Desktop Profile & Logout (Far Right) */}
          <div className="hidden md:flex items-center gap-4">
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
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition bg-transparent border-none cursor-pointer px-3 py-1 rounded-lg text-sm font-medium"
            >
              <LogOut size={20} />
              {/*Logout*/}
            </button>
          </div>

          {/* 4. Collapsible Mobile Menu (Full Width when open on mobile) */}
          <div
            className={`w-full transition-all duration-300 ease-in-out flex-col items-start space-y-1 mt-3 pt-3 border-t border-red-700
              ${isMenuOpen ? 'flex md:hidden' : 'hidden'}`}
          >
            {/* Main Nav Items (Mobile) */}
            <div className="w-full">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition w-full text-base font-medium
                    ${isActive ? 'bg-yellow-600 text-red-900 font-bold shadow-inner' : 'hover:bg-red-700 text-white'}`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Profile & Logout */}
            <div className="flex flex-col items-start space-y-1 w-full pt-2 border-t border-red-700">
              <NavLink
                to="profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700 transition w-full text-white text-base font-medium"
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 text-white hover:bg-red-700 transition bg-transparent border-none cursor-pointer px-4 py-2 rounded-lg w-full text-left text-base font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area remains constrained for better readability */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdviserLayout;
