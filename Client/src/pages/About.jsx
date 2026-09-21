import React from 'react';
import {
  Compass,
  Shield,
  Award,
  MapPin,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import sriLanka6 from '../assets/talpe.jpg';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 ">
      <div className="text-center space-y-4">
        <span className="text-2xl font-bold tracking-wider text-slate-700 block">
          About&nbsp;
          <span className="text-2xl font-bold tracking-tight text-orange-500">
            Ceylon
            <span className="text-yellow-500">
              Trips
            </span>
          </span>
        </span>

        {/* ======== Descriptio ========*/}
        <div className="w-full text-center space-y-6">

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-emerald-600 tracking-tight">
            Discover Sri Lanka. Plan Your Journey.
            <br />
            Create Unforgettable Memories
          </h1>

          <p className="w-full text-base text-slate-600 leading-relaxed">
            CeylonTrip is a smart travel planning platform designed to help
            travelers discover the beauty of Sri Lanka and create personalized
            travel itineraries with ease. From ancient cultural sites and
            golden beaches to misty mountains, wildlife parks, and vibrant
            cities, CeylonTrip brings Sri Lanka's diverse travel experiences
            together in one platform. Our goal is to make trip planning
            simple, personalized, and efficient while helping travelers
            discover destinations that match their interests, available time,
            and budget.
          </p>
        </div>
    </div>

    <div className="rounded-3xl overflow-hidden shadow-card border border-slate-200 h-80 sm:h-100 relative">
        <img
            src={sriLanka6}
            alt="Sigiriya Fortress Sri Lanka"
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8">
            <p className="text-white text-sm font-medium">
                Golden sands, turquoise waters, hidden coves, and some of Asia’s most beautiful tropical beaches.
            </p>
        </div>
    </div>


        {/* ===== Technical Highlights ======== */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 space-y-3 bg-slate-50 border rounded-2xl border-slate-200 shadow-soft">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900">Smart Trip Planning</h3>
            <p className="text-xs leading-relaxed text-slate-600">
                CeylonTrip simplifies travel planning by considering your interests, budget, available time, destination popularity, ratings, and travel distances to create a personalized and convenient journey across Sri Lanka.
            </p>
        </div>

        <div className="p-6 space-y-3  bg-slate-50 border rounded-2xl border-slate-200 shadow-soft">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ocean-50 text-ocean-600">
                <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900">Discover Destinations on the Map</h3>
            <p className="text-xs leading-relaxed text-slate-600">
                Explore Sri Lankan destinations through an interactive map. CeylonTrip helps users discover nearby attractions, understand locations, visualize their journey, and follow an organized travel route easily.
            </p>
        </div>

        <div className="p-6 space-y-3 bg-slate-50 border rounded-2xl border-slate-200 shadow-soft">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
                <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900">AI & Intelligent Itinerary Optimization</h3>
            <p className="text-xs leading-relaxed text-slate-600">
                Haversine distance matrix with greedy Nearest-Neighbor heuristics to eliminate inefficient geographic zig-zagging between coastal and hill country destinations.
            </p>
        </div>
      </div>

      {/* Sri Lanka Travel Advice */}
      <div className="p-8 space-y-6 text-slate-800 border rounded-3xl bg-slate-50 border-slate-200">
        <div className="space-y-2">
            <span className="block text-xs font-bold tracking-wider uppercase text-emerald-600">
                Essential Traveler Insights
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
                Practical Tips for Exploring the Pearl of the Indian Ocean
            </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed sm:grid-cols-2 text-slate-600">
            <div className="p-4 space-y-1 border rounded-xl bg-white border-slate-200">
                <h4 className="text-sm font-bold text-slate-700">Monsoon Seasons</h4>
                <p>
                    The southwest monsoon brings rain to the south and west coasts (May–Sept), while the northeast monsoon affects the north and east (Oct–Jan). Sri Lanka is truly a year-round destination!
                </p>
            </div>

            <div className="p-4 space-y-1 border rounded-xl bg-white border-slate-200">
            <   h4 className="text-sm font-bold text-slate-700">Sacred Shrine Etiquette</h4>
                <p>
                    When visiting temples, dress modestly with shoulders and knees covered. Remove shoes and hats before entering sacred premises.
                </p>
            </div>

          <div className="p-4 space-y-1 border rounded-xl bg-white border-slate-200">
            <h4 className="text-sm font-bold text-slate-700">Scenic Train Travel</h4>
            <p>
                The railway from Kandy to Ella is celebrated as one of the world’s most scenic train rides. Book reserved seats early or travel in 2nd/3rd class for authentic open-door mountain breezes.
            </p>
          </div>

          <div className="p-4 space-y-1 border rounded-xl bg-white border-slate-200">
            <h4 className="text-sm font-bold text-slate-700">Currency & Local Payments</h4>
            <p>
              Sri Lankan Rupee (LKR) is the official currency. Major hotels accept cards, while local tuk-tuks, street food stalls, and entrance counters require cash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

