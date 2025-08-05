import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
// Adding for tracking of referral code
import ReactGa from 'react-ga4';

// ✅ Initialize GA4 with your ID to track the Referral Code as UTM medium and campaign
ReactGa.initialize('G-7M7G6QM7Q2');

// ✅ Track the initial pageview for REFERRAL
ReactGa.send('pageview');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);