// src/Header.jsx
import pup_1904 from '../assets/pup_1904.png';

function Header() {
  return (
    <header className="flex items-start p-4 bg-red-900 shadow-md">
      {/* Logo */}
      <img src={pup_1904} alt="PUP Logo" className="w-16 h-16 mr-4" />

      {/* Text block */}
      <div className="text-white text-left leading-tight">
        <h1 className="text-lg font-bold">
           Polytechnic University of the Philippines
        </h1>
        <h6 className="text-xs italic">
          The Country's 1st PolytechnicU
        </h6>
        <h3 className="text-sm font-semibold">
         PUP System for Internship Navigation and Guidance (SINAG)
        </h3>
        
      </div>
    </header>
  );
}

export default Header;
