import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { IoAirplaneSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

// Pages where navbar should be hidden (full-screen auth pages)
const hideNavbarPaths = ["/role", "/passenger/register", "/passenger/login", "/admin/login"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isPassengerLoggedIn, isAnyUserLoggedIn, passenger, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth flow pages for a cleaner look
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    ...(isAuthenticated
      ? [{ to: "/admin/dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <IoAirplaneSharp className="text-white text-lg -rotate-45" />
            </div>
            <span className="text-xl font-bold text-gradient tracking-tight">
              AeroNotify
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "bg-primary-500/20 text-primary-300"
                    : "text-dark-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* User info + Sign Out */}
            {isAnyUserLoggedIn ? (
              <>
                {isPassengerLoggedIn && !isAuthenticated && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20">
                    {passenger?.email}
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-danger-400 hover:bg-danger-500/10 transition-all duration-300 cursor-pointer"
                >
                  <MdLogout />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/role"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium gradient-primary text-white hover:opacity-90 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-300 hover:text-white transition-colors p-2 cursor-pointer"
          >
            {isOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-1 glass-light">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.to)
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-dark-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAnyUserLoggedIn ? (
            <button
              onClick={() => { handleSignOut(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-danger-400 hover:bg-danger-500/10 transition-all duration-300 cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/role"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-500/10 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
