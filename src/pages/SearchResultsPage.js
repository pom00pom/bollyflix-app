// src/pages/SearchResultsPage.js

import React from 'react';
import MediaGrid from '../components/MediaGrid';

const SearchResultsPage = ({ content, query }) => {
    
    // --- BDLV Explains: यहाँ सर्च का मुख्य लॉजिक है ---
    const filteredItems = query 
        ? content.filter(item => 
            // हर आइटम के टाइटल को छोटे अक्षरों में बदलो और देखो कि क्या उसमें
            // सर्च टेक्स्ट (query) छोटे अक्षरों में मौजूद है।
            item.title.toLowerCase().includes(query.toLowerCase())
          ) 
        : []; // अगर कोई query नहीं है, तो खाली लिस्ट दिखाओ

    return (
        <div className="pt-24 min-h-screen">
            <MediaGrid 
                // अगर query है, तो टाइटल में दिखाओ कि किसके लिए रिजल्ट्स हैं
                // वरना, यूज़र को सर्च करने के लिए कहो
                title={query ? `Results for "${query}"` : 'Please enter a search term'} 
                items={filteredItems} 
            />
        </div>
    );
};

export default SearchResultsPage;