import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Faq from "./components/Faq";
import About from "./components/About";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AnalysisDashboard from "./components/AnalysisDashboard";

const App = () => {
  return (
    <>
    <Navbar />
      <Hero />
      <Features />
      <Faq />
      <About />
      <Footer />
    </>
  );
}

export default App;