import React from "react";
import { Routes, Route } from 'react-router-dom';

// Public Components (Your existing landing page components)
import Hero from "./components/Hero";
import Features from "./components/Features";
import Faq from "./components/Faq";
import About from "./components/About";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Authentication & Protected Components (Must be created/available)
import ProtectedRoute from './components/ProtectedRoute'; // Created in previous step
import LoginPage from './components/LoginPage'; // Created in previous step
import HomePage from './pages/HomePage'; // Created in previous step
import Dashboard from './pages/Dashboard'; // Target for the protected content

// --- 1. Component to render the full public landing page structure ---
const LandingView = () => (
    // This renders all your original components sequentially, preserving styling
    <>
        <Navbar />
        <Hero />
        <Features />
        <Faq />
        <About />
        <Footer />
    </>
);

const App = () => {
  return (
    <Routes>
      
      {/* ---------------------------------------------------- */}
      {/* PUBLIC ROUTES (Landing Page and Login Form) */}
      
      {/* Renders all public components on the root path */}
      <Route path="/" element={<LandingView />} />
      
      {/* Renders the Login Form component */}
      <Route path="/login" element={<LoginPage />} />
      
      
      {/* ---------------------------------------------------- */}
      {/* PROTECTED ROUTES: Only accessible after successful authentication */}
      
      {/* The ProtectedRoute checks localStorage and redirects unauthorized users to /login */}
      <Route element={<ProtectedRoute redirectPath="/login" />}>
        
        {/* Protected Hub: Appears immediately after login */}
        <Route path="/home" element={<HomePage />} /> 
        
        {/* Protected Operation: Real-time dashboard */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        
      </Route>
      
      {/* FALLBACK Route */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      
    </Routes>
  );
}

export default App;
