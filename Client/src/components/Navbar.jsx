import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
    `block px-3 py-2 text-base font-semibold rounded-lg ${
      isActive
        ? "text-primary"
        : "text-slate-800 hover:bg-slate-50"
    }`;


  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md border-slate-300">
      <div className="px-4 mx-auto max-w-full sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-18">

          {/* -------------------- Logo ------------------ */}
          <NavLink to="/" className="flex items-center group">
            
            <div className="flex items-center justify-center">
              <img
                src="/sri-lanka-map.png"
                alt="Sri Lanka"
                className="w-14 h-14 object-contain shrink-0"
              />
            </div>

            <div>
              <span className="flex items-center text-2xl font-bold tracking-tight text-orange-500">
                Ceylon
                <span className="text-yellow-500">
                  Trips
                </span>
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-600 uppercase -mt-1">
                Sri Lanka Travel Planner
              </span>
            </div>
          </NavLink>

          {/*-------------------dedktop navigation---------------*/}

          <nav className="items-center hidden gap-1 md:flex lg:gap-2">
            {navItems.map((item)=>(
              <NavLink 
              key={item.path}
              to={item.path}
              className={DesktopClass}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/*---------------login/register ------------------ */}

          <div className="item bg-center hidden gap-3 md:flex">
            <NavLink
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 border border-transparent hover:bg-slate-50 hover:border-slate-300 shadow-sm transition"
            >
              Log In
            </NavLink>

            <NavLink
              to="/register"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 shadow-sm transition"
            >
              Register
            </NavLink>
          </div>

          {/* ------------ mobile menu open/cloce buttuons--------- */}

          <div className="flex items-center gap-2 md:hidden">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
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
      
      {/* ------------ mobile menu---------------------- */}
      <div
        className={`fixed top-19 left-0 z-50 w-54 h-full px-4 pt-3 pb-6 space-y-2 bg-white  md:hidden transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

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


        <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">

          <NavLink
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-center rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
          >
            Log In
          </NavLink>

          <NavLink
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-center rounded-xl text-sm font-bold bg-slate-900 text-white"
          >
            Register
          </NavLink>

        </div>
        </div>
    </header>
  );
};

export default Navbar;