// src/pages/CommunityPage.js - THE FINAL, CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';
import WarpSpeed from '../components/WarpSpeed';

// --- यह एक छोटा कंपोनेंट है जो सिर्फ पोल के अंदर का कंटेंट दिखाता है ---
const PollContent = ({ poll, allContent, isModal }) => {
    const [votedPolls, setVotedPolls] = useState({});
    
    useEffect(() => {
        const hasVoted = localStorage.getItem(`voted_${poll.id}`);
        if (hasVoted) { setVotedPolls(prev => ({ ...prev, [poll.id]: true })); }
    }, [poll.id]);

    const handleVote = async (pollId, optionId) => {
        if (votedPolls[pollId]) { alert("You have already voted in this poll."); return; }
        const pollRef = doc(db, "polls", pollId);
        try {
            await updateDoc(pollRef, { [`options.${optionId}`]: increment(1) });
            localStorage.setItem(`voted_${pollId}`, 'true');
            setVotedPolls(prev => ({ ...prev, [pollId]: true }));
            alert("Thank you for your vote!");
        } catch(error) { console.error("Error voting:", error); alert("Failed to vote. Please try again."); }
    };

    const pollOptions = Object.entries(poll.options || {})
        .map(([contentId, votes]) => {
            const contentDetails = allContent.find(item => item.contentId === contentId);
            return { ...(contentDetails || {}), votes, contentId };
        })
        .filter(item => item.title)
        .sort((a, b) => b.votes - a.votes);

    return (
        <div>
            <h2 className={`text-2xl font-bold text-center mb-6 text-animated-gradient ${isModal ? 'text-3xl' : ''}`}>{poll.title}</h2>
            <div className="space-y-4">
                {pollOptions.map(item => (
                    <div key={item.contentId} className="bg-gray-800 bg-opacity-70 rounded-lg p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-grow min-w-0">
                            <Link to={`/details/${item.contentId}`} onClick={(e) => e.stopPropagation()}><img src={item.posterUrl} alt={item.title} className="w-12 h-20 object-cover rounded-md flex-shrink-0" /></Link>
                            <div className="flex-grow min-w-0">
                                <Link to={`/details/${item.contentId}`} onClick={(e) => e.stopPropagation()}><h3 className="text-lg font-semibold hover:text-purple-400 truncate">{item.title}</h3></Link>
                                <p className="text-sm text-gray-400">Current Votes: {item.votes}</p>
                            </div>
                        </div>
                        {isModal && (<button onClick={() => handleVote(poll.id, item.contentId)} disabled={votedPolls[poll.id]} className="bg-purple-600 text-white font-bold py-2 px-5 rounded-lg transition-colors hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0">Vote</button>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- यह छोटा, कॉम्पैक्ट पोल कार्ड है (अपग्रेडेड) ---
const PollCard = ({ poll, allContent, onSelect }) => {
    const firstOptionId = Object.keys(poll.options)[0];
    const posterItem = allContent.find(item => item.contentId === firstOptionId);

    return (
        // --- The Fix is Here! ---
        <div 
            onClick={onSelect} 
            className="block group aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer border border-white/10 hover:border-purple-500/50 pointer-events-auto"
        >
            <div className="relative w-full h-full">
                {posterItem ? (
                    <img src={posterItem.posterUrl} alt="Poll cover" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
                ) : (
                    <div className="w-full h-full bg-gray-800"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-white text-lg font-bold">{poll.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">Click to view poll</p>
                </div>
            </div>
        </div>
    );
};

// --- वीकली विनर्स का कंपोनेंट ---
const WinnerCircle = ({ title, items }) => (
    <div>
        <h2 className="text-3xl font-semibold mb-6 text-center">{title}</h2>
        {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((item, index) => (
                    <div key={item.contentId} className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-center relative transform hover:scale-105 transition-transform duration-300">
                        <span className={`absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center text-xl font-bold rounded-full border-2 border-black ${
                            index === 0 ? 'bg-yellow-400 text-black' : 
                            index === 1 ? 'bg-gray-300 text-black' : 
                            'bg-yellow-600 text-white'
                        }`}>#{index + 1}</span>
                        <Link to={`/details/${item.contentId}`}>
                            <img src={item.posterUrl} alt={item.title} className="w-40 h-60 mx-auto rounded-md mb-4" />
                            <h3 className="text-lg font-bold hover:text-purple-400">{item.title}</h3>
                        </Link>
                        <p className="text-gray-400">{item.votes} Votes</p>
                    </div>
                ))}
            </div>
        ) : <p className="text-gray-500 text-center">Voting is still open. No winners yet!</p>}
    </div>
);

// --- यह मुख्य CommunityPage कंपोनेंट है ---
const CommunityPage = ({ allContent }) => {
    const [polls, setPolls] = useState([]);
    const [weeklyWinners, setWeeklyWinners] = useState({ movies: [], series: [], shows: [] });
    const [loading, setLoading] = useState(true);
    const [selectedPoll, setSelectedPoll] = useState(null);

    useEffect(() => {
        const pollsRef = collection(db, "polls");
        const dailyQuery = query(pollsRef, where("type", "==", "daily"), where("isActive", "==", true));
        const unsubDaily = onSnapshot(dailyQuery, (querySnapshot) => {
            setPolls(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const weeklyQuery = query(pollsRef, where("type", "==", "weekly"));
        const unsubWeekly = onSnapshot(weeklyQuery, (querySnapshot) => {
            let winners = { movies: [], series: [], shows: [] };
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const options = Object.entries(data.options || {})
                                    .sort(([,a],[,b]) => b - a).slice(0, 3)
                                    .map(([contentId, votes]) => {
                                        const details = allContent.find(c => c.contentId === contentId);
                                        return { ...(details || {}), votes, contentId };
                                    }).filter(item => item.title);
                if (doc.id.includes('movies')) winners.movies = options;
                if (doc.id.includes('series')) winners.series = options;
                if (doc.id.includes('tv_shows')) winners.shows = options;
            });
            setWeeklyWinners(winners);
            setLoading(false);
        });
        return () => { unsubDaily(); unsubWeekly(); };
    }, [allContent]);

    if (loading) return <div className="min-h-screen"><WarpSpeed /><LoadingSpinner /></div>;
    
    return (
        <div className="min-h-screen">
            <WarpSpeed />
            <div className={`fixed inset-0 z-20 transition-opacity duration-300 ${selectedPoll ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`} onClick={() => setSelectedPoll(null)}></div>
            
            {/* --- The Fix is Here! --- */}
            <div className="relative z-10 pt-24 pb-20 content-on-top min-h-screen container mx-auto px-4 text-white">
                <h1 className="text-4xl font-bold text-center mb-12 text-animated-gradient">Community Polls</h1>
                {polls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {polls.map(poll => (
                            <PollCard key={poll.id} poll={poll} allContent={allContent} onSelect={() => setSelectedPoll(poll)} />
                        ))}
                    </div>
                ) : ( <div className="text-center text-2xl text-gray-500 my-20">No active polls right now.</div> )}

                <div className="mt-20 border-t border-gray-700 pt-12">
                    <h1 className="text-4xl font-bold text-center mb-12 text-animated-gradient">This Week's Top Contenders</h1>
                    <div className="space-y-12">
                        <WinnerCircle title="Top 3 Movies" items={weeklyWinners.movies} />
                        <WinnerCircle title="Top 3 Web Series" items={weeklyWinners.series} />
                        <WinnerCircle title="Top 3 TV Shows" items={weeklyWinners.shows} />
                    </div>
                </div>
            </div>

            {selectedPoll && (
                <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
                    <div className={`bg-black bg-opacity-70 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-white/20 w-full max-w-2xl transition-all duration-300 transform ${selectedPoll ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedPoll(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl z-10">&times;</button>
                        <PollContent poll={selectedPoll} allContent={allContent} isModal={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;