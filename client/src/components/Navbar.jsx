import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
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
            FoodBites</h1>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        {!menuOpen && (
          <button
            className="md:hidden mr-4 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:space-x-6 mr-4">
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

      {/* Mobile Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 border-b border-green-100 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-emerald-600 cursor-pointer"
            onClick={() => {
              window.location.href = "/";
              setMenuOpen(false);
            }}
          >
            FoodBites
          </h1>
          <button
            className="focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 font-bold border-l-4 border-emerald-700 pl-2 transition-all duration-200'
                : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/foods"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 font-bold border-l-4 border-emerald-700 pl-2 transition-all duration-200'
                : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
            }
            onClick={() => setMenuOpen(false)}
          >
            Menu
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 font-bold border-l-4 border-emerald-700 pl-2 transition-all duration-200'
                : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
            }
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 font-bold border-l-4 border-emerald-700 pl-2 transition-all duration-200'
                : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
            }
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 font-bold border-l-4 border-emerald-700 pl-2 transition-all duration-200'
                : 'text-gray-600 hover:text-emerald-500 transition-colors duration-200'
            }
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
