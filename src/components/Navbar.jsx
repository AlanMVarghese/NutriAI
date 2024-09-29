import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS for styling
import { CgProfile } from "react-icons/cg";


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      {/* Hamburger Menu */}
      <div className="hamburger-menu">
        <img src="src\images\logo.png" alt="" />
        {/* <GiHamburgerMenu fontSize="35px" /> */}
      </div>

      {/* Centered Title */}
      <h1 className="navbar-title">NutriAI</h1>

      {/* Profile Section with Dropdown */}
      <div className="profile" onClick={toggleDropdown}>
        <CgProfile fontSize="35px" />
        {isDropdownOpen && (
          <div className="dropdown">
            <ul>
              <li>Welcome Arun!</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
