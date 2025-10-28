// src/components/PremiumVideoPlayer.js - The new, reliable version with ReactPlayer

import React from 'react';
import ReactPlayer from 'react-player';

const PremiumVideoPlayer = ({ src, subtitles }) => {
  
  // --- BDLV Explains: ReactPlayer को सबटाइटल के लिए इस खास फॉर्मेट में डेटा चाहिए ---
  const tracks = subtitles.map((sub, index) => ({
    kind: 'subtitles',
    src: sub.src,
    srcLang: sub.lang,
    label: sub.label,
    default: index === 0, // पहले सबटाइटल को डिफ़ॉल्ट बनाओ
  }));

  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={src} // वीडियो का URL
        width='100%'
        height='100%'
        playing={true} // ऑटो-प्ले
        controls={true} // प्लेयर के कंट्रोल्स दिखाओ
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous' // CORS के लिए यह ज़रूरी है
            },
            tracks: tracks // यहाँ सबटाइटल का डेटा पास करो
          }
        }}
      />
      {/* --- BDLV Explains: ReactPlayer को रिस्पॉन्सिव बनाने के लिए यह CSS ज़रूरी है --- */}
      <style jsx>{`
        .player-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 255, 191, 0.1);
        }
        .react-player {
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default PremiumVideoPlayer;