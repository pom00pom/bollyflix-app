// src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; // बैनर स्लाइडशो के लिए लाइब्रेरी
import MediaGrid from '../components/MediaGrid';

// react-slick की CSS फाइल्स को इम्पोर्ट करना ज़रूरी है
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = ({ content }) => {
    // --- BDLV Explains: उन सभी आइटम को फ़िल्टर करो जिन्हें बैनर में दिखाना है ---
    const featuredItems = content.filter(c => c.isFeatured && c.isFeatured.toLowerCase() === 'yes');

    // --- BDLV Explains: स्लाइडर की सेटिंग्स ---
    const sliderSettings = {
        dots: true, // नीचे छोटे डॉट दिखाओ
        infinite: true, // अंतहीन लूप
        fade: true, // एक स्लाइड से दूसरी में फेड इफ़ेक्ट
        speed: 1000, // फेड होने की स्पीड (ms)
        slidesToShow: 1, // एक बार में एक स्लाइड दिखाओ
        slidesToScroll: 1,
        autoplay: true, // अपने आप चले
        autoplaySpeed: 4000, // हर 4 सेकंड में स्लाइड बदले
        cssEase: "linear",
        arrows: false // साइड के तीर (arrows) छिपा दो
    };

    // --- BDLV Explains: अलग-अलग सेक्शन के लिए कंटेंट को फ़िल्टर करो ---
    const movies = content.filter(c => c.type === 'Movie');
    const series = content.filter(c => c.type === 'Web Series');
    const anime = content.filter(c => c.type === 'Anime');

    return (
        // pt-16 (padding-top: 4rem) इसलिए ताकि कंटेंट Navbar के पीछे न छिपे
        <div className="pt-16">
            
            {/* === फीचर्ड बैनर स्लाइडशो === */}
            {featuredItems.length > 0 && (
                <Slider {...sliderSettings}>
                    {featuredItems.map(item => (
                        <div key={item.contentId} className="relative h-[50vh] md:h-[70vh] w-full text-white">
                            {/* बैनर की इमेज */}
                            <img 
                                src={item.bannerUrl || item.posterUrl} // अगर बैनर नहीं है तो पोस्टर दिखा दो
                                alt={item.title} 
                                className="absolute inset-0 w-full h-full object-cover opacity-40" 
                            />
                            {/* ऊपर और नीचे डार्क ग्रेडिएंट ताकि टेक्स्ट आसानी से दिखे */}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black"></div>
                            
                            {/* बैनर का कंटेंट (टाइटल, कहानी, बटन) */}
                            <div className="relative z-10 flex flex-col justify-end h-full container mx-auto p-4 md:p-8">
                                <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{item.title}</h1>
                                <p className="max-w-xl text-lg mb-6 line-clamp-3 drop-shadow-md">{item.description}</p>
                                <Link 
                                    to={`/details/${item.contentId}`} 
                                    className="bg-animated-gradient text-white font-bold py-3 px-8 rounded-lg w-fit transition-transform hover:scale-105"
                                >
                                    More Info
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}

            {/* === नीचे के सेक्शन्स === */}
            {/* MediaGrid कंपोनेंट का इस्तेमाल करके अलग-अलग ग्रिड बनाओ */}
            <MediaGrid title="Latest Movies" items={movies} />
            <MediaGrid title="Popular Series" items={series} />
            <MediaGrid title="Featured Anime" items={anime} />
        </div>
    );
};

export default HomePage;