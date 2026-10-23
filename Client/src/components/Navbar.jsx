import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Destinations", path: "/destinations" },
  { name: "Trip Planner", path: "/planner" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="px-4 mx-auto max-w-full sm:px-6 lg:px-10">
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

          </div>


          {/* ================= MOBILE BUTTON ================= */}
          <div className="flex items-center lg:hidden">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
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

            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-center rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition sm:text-base">
              Log In
            </NavLink>

            <NavLink
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-center rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition sm:text-base">
              Register
            </NavLink>

          </div>

        </div>
      )}

    </header>
  );
};

export default Navbar;
