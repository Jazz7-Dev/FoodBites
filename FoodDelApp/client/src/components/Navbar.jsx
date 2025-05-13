import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white p-4 flex items-center justify-between border-b border-green-100 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      {/* Company Logo/Name */}
      <div className="flex items-center ml-4">
        <h1
          className="text-2xl font-bold text-emerald-600 cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          FoodBites
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 mr-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-bold border-b-4 border-emerald-700 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/foods"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-bold border-b-4 border-emerald-700 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Menu
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-bold border-b-4 border-emerald-700 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Cart
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-bold border-b-4 border-emerald-700 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-bold border-b-4 border-emerald-700 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
