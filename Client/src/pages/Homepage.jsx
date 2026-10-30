import React from "react";
import HeroSection from "../components/Hero";
import Description from "../components/Discription";
import { HomeDiscovery, HomeExtras } from "../components/HomeSections";

const Homepage = () => {
  return (
      <div className="space-y-20">
        <HeroSection />
        <HomeDiscovery />
        <Description />
        <HomeExtras />
      </div>
  );
};

export default Homepage;
