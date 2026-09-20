import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import sriLanka1 from '../assets/Hero/Dondra.jpg';
import sriLanka2 from '../assets/Hero/elephants.jpg';
import sriLanka3 from '../assets/Hero/ella.jpg';
import sriLanka4 from '../assets/Hero/Mirissa.jpg';
import sriLanka5 from '../assets/Hero/Sigiriya.jpg';


export default function HeroSection() {
  // Background images
  const backgroundImages = [
    sriLanka1,
    sriLanka2,
    sriLanka3,
    sriLanka4,
    sriLanka5,
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => {
        return (previous + 1) % backgroundImages.length;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative flex items-center min-h-[85vh] overflow-hidden bg-slate-950 text-white">

      {/* ================= BACKGROUND IMAGES ================= */}
      <div className="absolute inset-0 z-0">

        {backgroundImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Sri Lanka scenic destination ${index + 1}`}
            className={`
              absolute inset-0
              w-full h-full
              object-cover object-center
              scale-105
              transition-opacity duration-1000 ease-in-out
              ${
                index === currentImage
                  ? 'opacity-100'
                  : 'opacity-0'
              }
            `}
          />
        ))}

        {/* Left dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

        {/* Bottom dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

      </div>


      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 w-full px-4 pt-8 pb-16 mx-auto text-left max-w-7xl sm:px-6 lg:px-8">

        <div className="max-w-2xl space-y-6">
        {/* ==== heading ==== */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
            Explore the Wonders of Sri Lanka
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] text-left">
            ආයුබෝවන්!
            <br />

            <span className="text-transparent bg-clip-text text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-emerald-400 to-emerald-300">
              Welcome to Sri Lanka
            </span>
          </h1>


          {/* Description */}
          <p className="max-w-xl text-base font-normal leading-relaxed text-left sm:text-lg text-slate-200">
              Discover Sri Lanka, plan unforgettable journeys, and explore the island your way.
              From ancient kingdoms and misty mountains to golden beaches and thrilling adventures, 
              experience the beauty of Sri Lanka like never before.
          </p>


          {/* Buttons */}
          <div className="flex flex-col items-stretch justify-start gap-4 pt-4 sm:flex-row sm:items-center">

            {/* Plan Trip */}
            <Link
              to="/planner"
              className=" inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500
                hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-base shadow-xl shadow-emerald-600/30
                hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition duration-200
              "
            >
              Plan My Trip
            </Link>

            {/* Explore */}
            <Link
              to="/destinations"
              className="
                inline-flex items-center justify-center gap-2 py-4 px-7 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md
                border border-white/20 text-white text-base font-semibold transition duration-200
              "
            >
              Explore 20+ Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20 text-slate-200">
            {/* Stat 1 */}
            <div className="text-left">

              <span className="block text-2xl font-bold text-white font-display">
                20+
              </span>

              <span className="text-xs text-slate-300">
                Curated Destinations
              </span>

            </div>

            {/* Stat 2 */}
            <div className="text-left">

              <span className="block text-2xl font-bold text-white font-display">
                9
              </span>

              <span className="text-xs text-slate-300">
                Provinces Covered
              </span>

            </div>


            {/* Stat 3 */}
            <div className="text-left">

              <span className="block text-2xl font-bold text-white font-display">
                100%
              </span>

              <span className="text-xs text-slate-300">
                Customized Routes
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================= IMAGE INDICATORS ================= */}
      <div className="absolute z-20 flex gap-2 bottom-8 sm:bottom-16 lg:bottom-16 right-8">

        {backgroundImages.map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            aria-label={`Show background image ${index + 1}`}
            className={`
              h-2
              rounded-full
              transition-all duration-300
              ${
                index === currentImage
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }
            `}
          />

        ))}

      </div>

    </section>
  );
}