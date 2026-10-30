import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo />
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed sm:text-base">
              CeylonTrips is a premier Sri Lankan smart tourism platform engineered to deliver personalized itineraries, route optimization, and authentic island discoveries.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Personalized trips & unforgettable island discoveries</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm sm:text-base">Explore</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/destinations" className="hover:text-emerald-700 transition">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Cultural%20Heritage" className="hover:text-emerald-700 transition">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Beaches%20%26%20Coastal" className="hover:text-emerald-700 transition">
                  Beaches & Surfing
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Hill%20Country%20%26%20Tea" className="hover:text-emerald-700 transition">
                  Highland Tea Estates
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Wildlife%20%26%20Safari" className="hover:text-emerald-700 transition">
                  Wildlife Safaris
                </Link>
              </li>
            </ul>
          </div>

          {/* Planner & Account */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm sm:text-base">Trip Services</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/planner" className="hover:text-emerald-700 transition">
                  Smart Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-emerald-700 transition">
                  Saved Itineraries
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-emerald-700 transition">
                  Favorite Spots
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-700 transition">
                  Travel Guidelines
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-700 transition">
                  Support & Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Island Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm sm:text-base">Sri Lanka Hub</h4>
            <ul className="space-y-3 text-sm text-slate-600 sm:text-base">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Galle Face Center Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>info@ceylontrips.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 sm:text-sm">
          <p>© {new Date().getFullYear()} CeylonTrips. University Software Engineering Project.</p>
          <div className="flex items-center gap-6">
            <span>Built with MERN Stack</span>
            <span>•</span>
            <span>Leaflet & OpenStreetMap</span>
            <span>•</span>
            <span>JWT Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
