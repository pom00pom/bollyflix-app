import React from 'react';
import { useParams } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';
const CategoryPage = ({ content }) => {
// --- BDLV Explains: URL से कैटेगरी का प्रकार (type) निकालो ---
// उदाहरण: अगर URL '/category/Movie' है, तो 'type' का मान 'Movie' होगा।
const { type } = useParams();
// --- BDLV Explains: सभी कंटेंट को फ़िल्टर करो जो इस प्रकार से मेल खाते हैं ---
const items = content.filter(c => c.type === type);

return (
    // pt-24 (padding-top) ताकि कंटेंट Navbar के पीछे न छिपे
    <div className="pt-24 min-h-screen">
        <MediaGrid 
            // टाइटल को डायनामिक बनाओ, जैसे 'All Movies' या 'All Web Series'
            title={`All ${type}s`} 
            items={items} 
        />
    </div>
);
};
export default CategoryPage;