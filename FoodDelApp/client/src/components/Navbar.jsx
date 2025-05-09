import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-green-100">
      {/* Company Logo/Name */}
      <div className="flex items-center ml-4">
        <h1 className="text-2xl font-bold text-emerald-600">FoodBites</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 mr-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/foods"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Menu
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Cart
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1 transition-all duration-200'
              : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1 transition-all duration-200'
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