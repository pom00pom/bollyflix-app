// src/components/Footer.js

import React from 'react';
import { config } from '../config';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 text-center p-6 mt-12 border-t border-gray-800">
      <p>&copy; {new Date().getFullYear()} {config.appName}. All Rights Reserved.</p>
      <p className="text-sm mt-2">Designed for a premium viewing experience.</p>
    </footer>
  );
};

export default Footer;