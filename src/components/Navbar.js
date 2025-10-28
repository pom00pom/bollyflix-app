// src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../config';

const Navbar = ({ searchQuery, setSearchQuery, genres }) => {
  const navigate = useNavigate();

  // --- BDLV Explains: यह फंक्शन सर्च बार में हर बदलाव को संभालता है ---
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query); // App.js में स्टेट को अपडेट करता है

    // अगर यूज़र ने कुछ लिखा है, तो सर्च पेज पर ले जाओ
    if (query) {
      navigate('/search');
    } else {
      // अगर सर्च बॉक्स खाली है, तो होम पेज पर वापस आ जाओ
      navigate('/');
    }
  };

  return (
    <nav className="bg-brand-dark bg-opacity-70 backdrop-blur-md p-4 fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        {/* === Left Side: Logo & Main Links === */}
        <div className="flex items-center gap-6">
          <Link 
              to="/" 
              onClick={() => setSearchQuery('')} // लोगो पर क्लिक करने से सर्च खाली हो जाएगा
              className="text-animated-gradient text-2xl md:text-3xl font-bold tracking-wider uppercase flex-shrink-0"
          >
            {config.appName}
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 text-white">
              <Link to="/category/Movie" className="text-white hover-gradient-text transition-colors font-semibold">Movies</Link>
              <Link to="/category/Web Series" className="text-white hover-gradient-text transition-colors font-semibold">Web Series</Link>
              {/* --- BDLV Explains: TV Shows को Anime से बदल दिया गया है --- */}
              <Link to="/category/Anime" className="text-white hover-gradient-text transition-colors font-semibold">Anime</Link>

              {/* === Dynamic Genres Dropdown === */}
              <div className="relative group">
                  <button className="text-white hover-gradient-text transition-colors font-semibold flex items-center py-2">
                      Genres
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
                      <div className="w-48 bg-gray-800 rounded-lg shadow-lg p-2 max-h-96 overflow-y-auto">
                          {genres && genres.map(genre => (
                              <Link key={genre} to={`/genre/${genre}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-green hover:text-white rounded-md transition-colors">
                                  {genre}
                              </Link>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
        </div>
        
        {/* === Right Side: Search & Telegram Icon === */}
        <div className="flex items-center gap-4">
          <div className="w-full max-w-xs md:max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
            />
          </div>

          {/* --- BDLV Explains: Login आइकॉन को Telegram आइकॉन से बदल दिया है --- */}
          {/* यह एक 'a' टैग है क्योंकि यह एक बाहरी (external) लिंक है */}
          <a href="https://t.me/FlixUniverseOfficial" target="_blank" rel="noopener noreferrer" title="Join our Telegram Channel" className="text-white hover:text-brand-green transition-colors">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.28 1.13-1.04 1.4-1.74.88L14.25 16l-4.12 3.9c-.78.76-1.36.37-1.57-.55z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;