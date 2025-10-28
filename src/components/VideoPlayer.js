// src/components/VideoPlayer.js - The Smart Player

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

// --- BDLV Explains: यह प्लेयर अब 'src' के साथ 'subtitles' की एक लिस्ट भी लेता है ---
const VideoPlayer = ({ src, subtitles }) => {
  const videoRef = useRef(null);

  // भाषा कोड को इंसानी भाषा में बदलने के लिए एक छोटा हेल्पर फंक्शन
  const getLanguageLabel = (sub) => {
    // अगर शीट में label दिया है, तो उसे इस्तेमाल करो, वरना lang कोड से बनाओ
    if (sub.label) return sub.label;
    
    const langMap = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ja': 'Japanese',
      'es': 'Spanish',
    };
    return langMap[sub.lang.toLowerCase()] || sub.lang.toUpperCase();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // --- यहाँ है स्ट्रीमिंग का जादू ---
    // 1. चेक करो कि क्या यह m3u8 (HLS) लिंक है
    const isM3U8 = src.toLowerCase().endsWith('.m3u8');

    if (isM3U8) {
      // 2. अगर हाँ, तो hls.js का इस्तेमाल करो
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // iOS/Safari जैसे कुछ ब्राउज़र HLS को बिना hls.js के भी चला सकते हैं
        video.src = src;
      }
    } else {
      // 3. अगर नहीं (यानी यह .mp4 या कुछ और है), तो सीधा ब्राउज़र को दे दो
      video.src = src;
    }

  }, [src]); // यह कोड तब चलेगा जब वीडियो का 'src' बदलेगा

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-brand-green/20">
      <video ref={videoRef} controls autoPlay className="w-full h-full" crossOrigin="anonymous">
        
        {/* --- BDLV Explains: यहाँ सबटाइटल का जादू हो रहा है --- */}
        {/* हम सबटाइटल की लिस्ट पर लूप करके हर एक के लिए एक <track> एलिमेंट बना रहे हैं */}
        {subtitles && subtitles.map((sub, index) => (
          <track
            key={index}
            kind="subtitles"
            src={sub.src} // सबटाइटल फाइल का URL
            srcLang={sub.lang} // भाषा का कोड (जैसे 'en', 'hi')
            label={getLanguageLabel(sub)} // प्लेयर में दिखने वाला नाम
            default={index === 0} // पहले सबटाइटल को डिफ़ॉल्ट बना दो
          />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;