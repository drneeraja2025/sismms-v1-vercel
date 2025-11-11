// GNA Code Governance Protocol: Main App Loader
// This file initializes React and renders the App.tsx component into index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Imports our core App/ProtectedRoute component (File 4)
// Note: We are assuming a basic CSS file exists, which Vercel will build.
import './index.css'; 

// Standard React 18 rendering sequence
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);