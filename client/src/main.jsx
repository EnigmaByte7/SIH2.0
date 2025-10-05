import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Corrected import
import './index.css';
import App from './App.jsx';

// Get the root element
const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  // Use React.StrictMode for development checks
  <React.StrictMode>
    {/* CRITICAL FIX: BrowserRouter provides the routing context for the entire application */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
