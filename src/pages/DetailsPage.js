import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';
import PremiumVideoPlayer from '../components/PremiumVideoPlayer';
const DetailsPage = ({ content, links }) => {
const { contentId } = useParams();
const item = content.find(c => c.contentId === contentId);
// --- State Management ---
const [activeSeason, setActiveSeason] = useState('1');
const [showTrailer, setShowTrailer] = useState(false);
const [selectedMedia, setSelectedMedia] = useState(null); // For the video player modal
const [showDownloadModal, setShowDownloadModal] = useState(false); // For the download modal
const [selectedServer, setSelectedServer] = useState(null); // For the download modal
const [selectedEpisode, setSelectedEpisode] = useState(null);

// --- Data Processing (Memoized for Performance) ---
const relatedLinks = useMemo(() => links.filter(l => l.parentContentId === contentId), [contentId, links]);
const seasons = useMemo(() => [...new Set(relatedLinks.filter(l => l.seasonNumber && l.seasonNumber !== '_').map(l => l.seasonNumber))].sort((a, b) => parseInt(a) - parseInt(b)), [relatedLinks]);

const handleEpisodeSelect = (episodeKey) => {
    // अगर उसी एपिसोड पर दोबारा क्लिक किया जाता है, तो उसे बंद कर दो
    if (selectedEpisode === episodeKey) {
        setSelectedEpisode(null);
    } else {
        // वरना, नए एपिसोड को चुनो
        setSelectedEpisode(episodeKey);
    }
};

const handlePlayClick = (linkData) => {
    let subtitles = [];
    if (linkData.subtitles) {
        try {
            // --- BDLV Explains: यहाँ JSON टेक्स्ट को असली डेटा में बदला जा रहा है ---
            const parsedSubs = JSON.parse(linkData.subtitles);
            if (Array.isArray(parsedSubs)) {
                // --- BDLV Explains: यहाँ हम सीधे URL की जगह अपने proxy का URL बना रहे हैं ---
subtitles = parsedSubs.map(sub => ({
    src: `/netlify/functions/subtitle-proxy?url=${encodeURIComponent(sub.url)}`,
    lang: sub.lang,
    label: sub.label
}));
            }
        } catch (error) {
            console.error("Failed to parse subtitles JSON:", error);
        }
    }
    setSelectedMedia({
        src: linkData.streamUrl,
        subtitles: subtitles,
        title: linkData.episodeTitle && linkData.episodeTitle !== '_' ? `${linkData.episodeTitle} (${linkData.language} ${linkData.quality})` : `${item.title} (${linkData.language} ${linkData.quality})`
    });
};

const downloadLinks = useMemo(() => {
    if (!relatedLinks || relatedLinks.length === 0) return {};
    const firstLink = relatedLinks[0];
    const servers = {};
    for (const key in firstLink) {
        if (key.match(/^s\d+_\d+p$/) && firstLink[key]) {
            const [server, quality] = key.split('_');
            const serverNum = server.replace('s', '');
            if (!servers[serverNum]) servers[serverNum] = [];
            servers[serverNum].push({ quality, url: firstLink[key] });
        }
    }
    return servers;
}, [relatedLinks]);

if (!item) return <div className="text-white text-center py-20 min-h-screen">Content not found!</div>;
const recommendations = content.filter(recItem => recItem.contentId !== item.contentId && recItem.genre.includes(item.genre.split(',')[0].trim())).slice(0, 6);

return (
    <div className="container mx-auto px-4 py-24 text-white min-h-screen">
        {/* === Top Section: Details & Poster === */}
        <div className="md:flex gap-8">
            <img src={item.posterUrl} alt={item.title} className="w-48 md:w-64 h-auto rounded-lg mx-auto md:mx-0 shadow-lg" />
            <div className="mt-6 md:mt-0 flex-1">
                <h1 className="text-4xl font-bold">{item.title} ({item.releaseYear})</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-400">
                    <p>Rating: {item.rating}/10</p>
                    <p>|</p>
                    {item.genre.split(',').map(g => (
                        <Link key={g} to={`/genre/${g.trim()}`} className="bg-gray-700 text-xs px-2 py-1 rounded-md hover:bg-brand-green transition-colors">{g.trim()}</Link>
                    ))}
                </div>
                <p className="mt-4 max-w-2xl">{item.description}</p>
                <div className="mt-6 flex gap-4 items-center">
                    {item.trailerUrl && <button onClick={() => setShowTrailer(true)} className="bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-300">Watch Trailer</button>}
                    {Object.keys(downloadLinks).length > 0 && (
                        <button onClick={() => setShowDownloadModal(true)} className="bg-animated-gradient text-white font-bold py-2 px-6 rounded">Download</button>
                    )}
                </div>
            </div>
        </div>

        {/* === Screenshots Section === */}
        {/* === Screenshots Section (New Vertical Layout) === */}
<div className="mt-12">
    <h2 className="text-2xl font-bold mb-6 text-center uppercase hover-gradient-text">Screenshots</h2>
    {/* --- BDLV Explains: 'grid' को 'flex flex-col' से बदल दिया गया है --- */}
    <div className="flex flex-col items-center gap-8"> 
        {item.screenshots && item.screenshots.split(',').map((ss, i) => (
            <img key={i} src={ss.trim()} alt={`screenshot ${i + 1}`} className="rounded-lg w-full max-w-4xl h-auto object-contain shadow-lg" />
        ))}
    </div>
</div>

        {/* === Dynamic Player/Episode Section === */}
        {/* === Dynamic Player/Episode Section (New Premium Design) === */}
{/* === Dynamic Player/Episode Section (New Grid Layout) === */}
<div className="mt-16">
    <h2 className="text-3xl text-animated-gradient font-bold mb-6 text-center">
        {item.type === 'Movie' ? 'Watch Movie' : 'Seasons & Episodes'}
    </h2>
    <div className="max-w-4xl mx-auto bg-brand-dark border border-brand-green/30 rounded-lg shadow-2xl shadow-brand-green/10 p-6">
        {item.type !== 'Movie' && seasons.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-6 border-b-2 border-gray-700 pb-6">
                {seasons.map(season => (
                    <button key={season} onClick={() => { setActiveSeason(season); setSelectedEpisode(null); }} className={`py-2 px-6 font-semibold rounded-lg transition-all text-white ${activeSeason === season ? 'bg-animated-gradient' : 'bg-gray-800 hover:bg-gray-700'}`}>
                        Season {season}
                    </button>
                ))}
            </div>
        )}

        {/* --- BDLV Explains: यहाँ नया ग्रिड लेआउट है --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(() => {
                const linksToShow = item.type === 'Movie' ? relatedLinks : relatedLinks.filter(ep => ep.seasonNumber === activeSeason);
                
                // --- BDLV Explains: पहले सभी यूनिक एपिसोड्स को इकट्ठा करो ---
                const uniqueEpisodes = linksToShow.reduce((acc, link) => {
                    const key = link.episodeNumber || 'movie';
                    if (!acc[key]) {
                        acc[key] = { title: link.episodeTitle, links: [] };
                    }
                    acc[key].links.push(link);
                    return acc;
                }, {});

                return Object.keys(uniqueEpisodes).map(episodeKey => {
                    const episode = uniqueEpisodes[episodeKey];
                    return (
                        <button 
                            key={episodeKey} 
                            onClick={() => handleEpisodeSelect(episodeKey)} 
                            className={`p-3 rounded-lg text-center transition-colors ${selectedEpisode === episodeKey ? 'bg-animated-gradient text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
                        >
                            <p className="font-bold text-lg">{item.type === 'Movie' ? 'Play' : `E${episodeKey}`}</p>
                            <p className="text-sm text-gray-400 truncate">{episode.title !== '_' ? episode.title : (item.type === 'Movie' ? item.title : '')}</p>
                        </button>
                    );
                });
            })()}
        </div>

        {/* --- BDLV Explains: यह सेक्शन तभी दिखेगा जब कोई एपिसोड चुना गया हो --- */}
        {selectedEpisode && (
            <div className="mt-6 pt-6 border-t-2 border-gray-700">
                <h3 className="text-xl font-bold text-brand-green mb-4">
                    {item.type === 'Movie' ? 'Available in' : `Available Streams for Episode ${selectedEpisode}`}
                </h3>
                <div className="flex flex-wrap gap-3">
                    {relatedLinks
                        .filter(link => (link.episodeNumber || 'movie') === selectedEpisode)
                        .map(link => (
                            <button key={link.linkId} onClick={() => handlePlayClick(link)} className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-2 px-5 rounded-lg transition-all duration-300 hover:bg-animated-gradient hover:text-white hover:border-transparent hover:scale-105">
                                {link.language} {link.quality}
                            </button>
                        ))
                    }
                </div>
            </div>
        )}
    </div>
</div>

        {/* === Recommendations Section === */}
        {recommendations.length > 0 && <div className="mt-16"><MediaGrid title="You Might Also Like" items={recommendations} /></div>}

        {/* === Modals (Player, Trailer, Download) === */}
        {(showTrailer || selectedMedia) && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl">
                    <button onClick={() => { setShowTrailer(false); setSelectedMedia(null); }} className="absolute -top-10 right-0 text-white text-3xl font-bold">&times;</button>
                    {showTrailer && <iframe className="w-full aspect-video" src={`https://www.youtube.com/embed/${item.trailerUrl}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                    {selectedMedia && <div><h3 className="text-xl mb-4 text-white">Playing: {selectedMedia.title}</h3><PremiumVideoPlayer src={selectedMedia.src} subtitles={selectedMedia.subtitles} />
</div>}
                </div>
            </div>
        )}
        {/* --- BDLV Explains: यह है नया, प्रीमियम और एनिमेटed डाउनलोड पॉप-अप --- */}
{showDownloadModal && (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-brand-dark border border-brand-green/30 rounded-lg shadow-2xl shadow-brand-green/10 p-6 w-full max-w-md relative transition-all duration-300">
            <button 
                onClick={() => { setShowDownloadModal(false); setSelectedServer(null); }} 
                className="absolute -top-3 -right-3 text-white bg-gray-800 border-2 border-red-500 rounded-full w-9 h-9 flex items-center justify-center text-2xl font-bold transition-transform hover:scale-110"
            >&times;</button>
            
            {!selectedServer ? (
                <div>
                    <h3 className="text-2xl font-bold text-animated-gradient mb-6 text-center">Select a Server</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.keys(downloadLinks).map(serverNum => (
                            <button 
                                key={serverNum} 
                                onClick={() => setSelectedServer(serverNum)}
                                className="bg-transparent border-2 border-brand-green text-brand-green font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-animated-gradient hover:text-white hover:border-transparent hover:scale-105"
                            >
                                Server {serverNum}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-bold text-animated-gradient mb-6 text-center">Server {selectedServer} - Select Quality</h3>
                    <div className="flex flex-col gap-3">
                        {downloadLinks[selectedServer].map(({ quality, url }) => (
                            <a 
                                key={quality}
                                href={url}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-animated-gradient hover:scale-105 text-center flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                {quality}
                            </a>
                        ))}
                    </div>
                    <button 
                        onClick={() => setSelectedServer(null)}
                        className="text-gray-400 hover:text-white transition-colors mt-6 w-full text-center flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Servers
                    </button>
                </div>
            )}
        </div>
    </div>
)}
    </div>
);
};
export default DetailsPage;