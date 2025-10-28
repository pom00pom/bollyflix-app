// src/App.js - The Brain of the Application

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { config } from './config';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Page Components
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import GenrePage from './pages/GenrePage';

// --- BDLV Explains: यह फंक्शन Google Sheet से आए CSV टेक्स्ट को JSON में बदलता है ---
const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].trim().split(',');
    return lines.slice(1).map(line => {
        const values = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim());
        return headers.reduce((obj, header, i) => {
            const cleanHeader = header.trim();
            const cleanValue = values[i] && values[i].startsWith('"') && values[i].endsWith('"') ? values[i].slice(1, -1) : values[i];
            obj[cleanHeader] = cleanValue || '';
            return obj;
        }, {});
    });
};

// --- BDLV Explains: यह कंपोनेंट डेटा को लोड करता है और सभी पेजों को मैनेज करता है ---
const AppLayout = () => {
    const [content, setContent] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Navbar में Genres ड्रॉपडाउन के लिए सभी Genres को इकट्ठा करो
    const allGenres = [...new Set(content.flatMap(item => item.genre.split(',').map(g => g.trim())))].sort();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // दोनों शीट्स से डेटा एक साथ मंगाओ ताकि समय बचे
                const [contentRes, linksRes] = await Promise.all([
                    fetch(config.mainContentSheetUrl),
                    fetch(config.episodesAndLinksSheetUrl)
                ]);
                const contentText = await contentRes.text();
                const linksText = await linksRes.text();

                setContent(parseCSV(contentText));
                setLinks(parseCSV(linksText));

            } catch (error) {
                console.error("Failed to fetch data from Google Sheets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // [] का मतलब है कि यह सिर्फ एक बार चलेगा, जब ऐप लोड होगा

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-brand-dark min-h-screen text-white">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} genres={allGenres} />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage content={content} />} />
                    <Route path="/details/:contentId" element={<DetailsPage content={content} links={links} />} />
                    <Route path="/category/:type" element={<CategoryPage content={content} />} />
                    <Route path="/search" element={<SearchResultsPage content={content} query={searchQuery} />} />
                    <Route path="/genre/:genreName" element={<GenrePage content={content} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;