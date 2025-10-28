import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // AuthProvider को import करें

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* App को AuthProvider से लपेट दें */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);