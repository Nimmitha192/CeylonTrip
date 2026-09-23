import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Kandy from "../assets/pictures/Kandy.jpg";

const Description = () => {
  return (
    <>
      {/* ================ WHY CEYLONTRIP ============ */}
      <section className="px-4 py- mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="space-y-7 lg:col-span-6">
            <div>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-emerald-600">
                The CeylonTrip Advantage
              </span>

              <h2 className="text-3xl font-extrabold leading-tight font-display sm:text-4xl lg:text-5xl text-slate-900">
                Travel Sri Lanka
                <span className="block text-emerald-600">
                  Your Way
                </span>
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              From golden beaches and misty mountains to ancient cities and
              unforgettable wildlife experiences, Sri Lanka has something for
              every traveler.
            </p>

            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              CeylonTrip makes planning easier by helping you discover places
              that match your interests, create sensible travel routes, and
              build a trip that fits your time and budget.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4 pt-2">

              {/* Card 1 */}
              <div className="flex items-start gap-4 p-5 transition-all duration-300 bg-white border rounded-2xl border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                    Find Places You'll Love
                  </h4>

                  <p className="mt-1 text-xs leading-6 text-slate-500 sm:text-sm">
                    Discover beaches, mountains, wildlife, culture, and
                    adventure destinations based on your interests.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-start gap-4 p-5 transition-all duration-300 bg-white border rounded-2xl border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-sky-100 text-sky-600">
                  <MapPin className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                    Smarter Routes, Less Backtracking
                  </h4>

                  <p className="mt-1 text-xs leading-6 text-slate-500 sm:text-sm">
                    Destinations are arranged into a practical route to help
                    reduce unnecessary travel between locations.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-start gap-4 p-5 transition-all duration-300 bg-white border rounded-2xl border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-amber-100 text-amber-600">
                  <Award className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                    Plan Around Your Budget
                  </h4>

                  <p className="mt-1 text-xs leading-6 text-slate-500 sm:text-sm">
                    Get estimated costs for accommodation, transport, food,
                    and attraction entrance fees in Sri Lankan Rupees.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden border-8 border-white shadow-2xl rounded-3xl">
              <img
                src={Kandy}
                alt="Kandy, Sri Lanka"
                className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Image Text */}
              <div className="absolute bottom-6 right-6">
                <p className="text-xs font-semibold tracking-widest text-white uppercase">
                  Explore Sri Lanka
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl font-display">
                  Discover the Beauty of Ceylon
                </h3>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute hidden p-4 bg-white border shadow-xl sm:block -bottom-6 -left-6 rounded-2xl border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Smart Route Planning
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Your journey, organized
                  </p>
                </div>
              </div>
            </div>

            {/* Small Decorative Badge */}
            <div className="absolute flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white shadow-lg right-5 top-5 rounded-full text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Kandy
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ============= */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-emerald-600">
              Simple 3-Step Process
            </span>

            <h2 className="text-3xl font-extrabold font-display sm:text-4xl lg:text-5xl text-slate-900">
              How It Works
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              Create a personalized Sri Lankan travel plan in just a few
              simple steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Step 1 */}
            <div className="relative p-7 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-sm font-extrabold text-white rounded-xl bg-emerald-600">
                01
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900">
                Choose Your Preferences
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Select your trip duration, starting location, budget,
                traveler count, and interests such as wildlife, beaches,
                culture, or adventure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-7 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-sm font-extrabold text-white rounded-xl bg-emerald-600">
                02
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900">
                Generate Your Route
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                CeylonTrip evaluates destinations based on your preferences
                and creates an organized route designed to reduce unnecessary
                travel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-7 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-sm font-extrabold text-white rounded-xl bg-emerald-600">
                03
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900">
                Customize & Travel
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Explore your interactive map, review estimated costs, adjust
                destinations, and save your personalized travel plan.
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-extrabold text-white transition-all duration-300 rounded-xl bg-amber-400 hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Build My Itinerary
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-3 text-xs text-slate-500">
              Start planning your Sri Lankan adventure
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default Description;