import React from "react";
import HeroSection from "../components/Hero";
import Description from "../components/Discription";

const Homepage = () => {
  return (
      <main className="space-y-20">
        <HeroSection />
        <Description />
      </main>
  );
};

export default Homepage;