// src/components/MediaGrid.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- BDLV Explains: यह ग्रिड में दिखने वाला एक अकेला कार्ड है ---
const MediaCard = ({ item }) => (
  <Link to={`/details/${item.contentId}`} className="block group">
    <div className="relative rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg bg-gray-900">
      <img 
        src={item.posterUrl} 
        alt={item.title} 
        className="w-full h-auto object-cover aspect-[2/3]" 
        loading="lazy" // इमेज को लेज़ी लोड करता है ताकि परफॉरमेंस अच्छी रहे
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
        <p className="text-white text-sm font-bold line-clamp-2">{item.title}</p>
      </div>
    </div>
  </Link>
);

// --- BDLV Explains: यह पेज नंबर वाले बटनों को संभालता है ---
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    // सिर्फ मौजूदा पेज के आस-पास के कुछ नंबर ही दिखाएंगे
    const visiblePages = pageNumbers.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2));

    return (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-12 text-white">
            <button onClick={() => onPageChange(1)} className="p-2 rounded-md hover:bg-brand-green transition-colors disabled:opacity-50" disabled={currentPage === 1}>First</button>
            <button onClick={() => onPageChange(currentPage - 1)} className="p-2 rounded-md hover:bg-brand-green transition-colors disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
            
            {visiblePages.map(number => (
                <button 
                    key={number} 
                    onClick={() => onPageChange(number)} 
                    className={`px-4 py-2 rounded-md transition-colors font-semibold ${currentPage === number ? 'bg-animated-gradient' : 'bg-gray-800 hover:bg-brand-green'}`}
                >
                    {number}
                </button>
            ))}

            <button onClick={() => onPageChange(currentPage + 1)} className="p-2 rounded-md hover:bg-brand-green transition-colors disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => onPageChange(totalPages)} className="p-2 rounded-md hover:bg-brand-green transition-colors disabled:opacity-50" disabled={currentPage === totalPages}>Last</button>
        </div>
    );
};

// --- BDLV Explains: यह मुख्य कंपोनेंट है जो ग्रिड और पेजिनेशन को जोड़ता है ---
const MediaGrid = ({ title, items }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // पेज बदलते ही ऊपर स्क्रॉल करो
        }
    };

    // जब भी 'items' बदलें (जैसे नए सर्च रिजल्ट आने पर), तो पेज को 1 पर रीसेट कर दो
    useEffect(() => {
        setCurrentPage(1);
    }, [items]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl text-animated-gradient font-bold mb-8">{title}</h2>
            {items && items.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {paginatedItems.map(item => <MediaCard key={item.contentId} item={item} />)}
                    </div>
                    {totalPages > 1 && (
                        <PaginationControls 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={handlePageChange} 
                        />
                    )}
                </>
            ) : (
                <p className="text-gray-400 text-center text-lg">No content found matching your criteria.</p>
            )}
        </div>
    );
};

export default MediaGrid;