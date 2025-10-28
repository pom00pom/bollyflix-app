// src/pages/GenrePage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';

const GenrePage = ({ content }) => {
    // --- BDLV Explains: URL से जॉनर का नाम निकालो ---
    // उदाहरण: अगर URL '/genre/Action' है, तो 'genreName' का मान 'Action' होगा।
    const { genreName } = useParams();

    // --- BDLV Explains: सभी कंटेंट को फ़िल्टर करो ---
    const filteredItems = content.filter(item => 
        // हर आइटम के 'genre' वाली स्ट्रिंग को छोटे अक्षरों में बदलो
        // और देखो कि क्या उसमें URL से आया 'genreName' (छोटे अक्षरों में) मौजूद है।
        // यह "Action, Thriller" जैसी स्ट्रिंग में भी 'Action' को ढूंढ लेगा।
        item.genre.toLowerCase().includes(genreName.toLowerCase())
    );

    return (
        <div className="pt-24 min-h-screen">
            <MediaGrid 
                // टाइटल को डायनामिक बनाओ, जैसे 'Content in: Action'
                title={`Content in: ${genreName}`} 
                items={filteredItems} 
            />
        </div>
    );
};

export default GenrePage;