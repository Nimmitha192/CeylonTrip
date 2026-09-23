import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import About from "./pages/About";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;