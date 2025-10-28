// src/components/LoadingSpinner.js

import React from 'react';

const LoadingSpinner = () => {
  return (
    // --- BDLV Explains: बैकग्राउंड और बॉर्डर का रंग नई हरी थीम के अनुसार है ---
    <div className="flex justify-center items-center h-screen bg-brand-dark">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-green"></div>
    </div>
  );
};

export default LoadingSpinner;