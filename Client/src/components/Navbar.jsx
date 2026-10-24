
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ShieldCheck,
  Luggage,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Destinations", path: "/destinations" },
  { name: "Trip Planner", path: "/planner" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ===== NEW: auth + user dropdown =====
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const dropdownItemClass =
    "flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition";
  // ===== END NEW =====

  const DesktopClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold transition rounded-lg ${
      isActive
        ? "text-primary"
        : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
    }`;

  const mobileClass = ({ isActive }) =>
    `block px-3 py-3 text-base font-semibold rounded-lg transition ${
      isActive
        ? "text-primary bg-slate-100"
        : "text-slate-800 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-[9999] bg-white border-b border-slate-300">

      {/* ================= NAVBAR ================= */}
      <div className="max-w-full px-4 mx-auto sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-18">

          {/* ================= LOGO ================= */}
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center group"
          >
            <BrandLogo />
          </NavLink>


          {/* ================= DESKTOP NAV ================= */}
          <nav className="items-center hidden gap-1 lg:flex lg:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={DesktopClass}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>


          {/* ================= LOGIN / REGISTER ================= */}
          <div className="items-center hidden gap-3 lg:flex">

            {isAuthenticated ? (
              /* ===== NEW: logged-in area (favorites + user dropdown) ===== */
              <div className="flex items-center gap-3">

                <NavLink
                  to="/favorites"
                  className="relative p-2.5 transition rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  title="My Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {user?.favorites?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                      {user.favorites.length}
                    </span>
                  )}
                </NavLink>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 transition bg-white border rounded-full border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  >
                    <img
                      src={
                        user?.profileImage ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={user?.name}
                      className="object-cover w-8 h-8 border rounded-full border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 z-50 w-56 py-2 mt-2 bg-white border shadow-xl rounded-2xl border-slate-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold truncate text-slate-800">{user?.name}</p>
                        <p className="text-xs truncate text-slate-500">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <NavLink
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className={dropdownItemClass}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </NavLink>
                        <NavLink
                          to="/my-trips"
                          onClick={() => setUserDropdownOpen(false)}
                          className={dropdownItemClass}
                        >
                          <Luggage className="w-4 h-4" />
                          My Trips
                        </NavLink>
                        <NavLink
                          to="/favorites"
                          onClick={() => setUserDropdownOpen(false)}
                          className={dropdownItemClass}
                        >
                          <Heart className="w-4 h-4" />
                          Favorites
                        </NavLink>
                        <NavLink
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className={dropdownItemClass}
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </NavLink>

                        {isAdmin && (
                          <NavLink
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold transition text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Admin Console
                          </NavLink>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center w-full gap-2.5 px-4 py-2 text-sm transition text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              /* ===== END NEW ===== */
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-50 transition sm:text-base"
                >
                  Log In
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition sm:text-base"
                >
                  Register
                </NavLink>
              </>
            )}

          </div>


          {/* ================= MOBILE BUTTON ================= */}
          <div className="flex items-center lg:hidden">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 transition rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>

        </div>
      </div>


      {/*================ MOBILE MENU ==================*/}

      {mobileMenuOpen && (
        <div
          className="fixed top-18 left-0 bottom-0 z-[10000] w-64 max-w-full bg-white !opacity-100 isolate border-r border-slate-200 shadow-xl lg:hidden overflow-y-auto">

          {/* Menu Links */}
          <div className="px-4 pt-4 space-y-2 bg-white">

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={mobileClass}
              >
                {item.name === "About"
                  ? "About Sri Lanka"
                  : item.name}
              </NavLink>
            ))}

          </div>


          {/* Login / Register */}
          <div className="px-4 pt-4 mt-4 space-y-2 bg-white border-t border-slate-200">

            {isAuthenticated ? (
              /* ===== NEW: logged-in links (mobile) ===== */
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/my-trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  My Trips
                </NavLink>
                <NavLink
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Favorites ({user?.favorites?.length || 0})
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Profile Settings
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold rounded-lg text-emerald-800 bg-emerald-50"
                  >
                    Admin Console
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-sm font-bold text-left rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
              /* ===== END NEW ===== */
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-sm font-bold text-center transition rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 sm:text-base">
                  Log In
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-sm font-bold text-center text-white transition rounded-xl bg-emerald-600 hover:bg-emerald-700 sm:text-base">
                  Register
                </NavLink>
              </>
            )}

          </div>

        </div>
      )}

    </header>
  );
};

export default Navbar;
