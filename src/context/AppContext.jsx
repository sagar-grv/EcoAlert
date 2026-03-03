import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPosts } from '../data/mockPosts';
import { detectFakeNews } from '../ai/fakeNewsDetector';
import { classifyRisk } from '../ai/riskClassifier';
import { getSuggestions } from '../ai/suggestionEngine';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { user: authUser } = useAuth();

    const [posts, setPosts] = useState(() => {
        // v2: field names changed (content→caption, username→author). Clear old data.
        const version = localStorage.getItem('ecoalert_posts_version');
        if (version !== '2') {
            localStorage.removeItem('ecoalert_posts');
            localStorage.setItem('ecoalert_posts_version', '2');
            return mockPosts;
        }
        const saved = localStorage.getItem('ecoalert_posts');
        return saved ? JSON.parse(saved) : mockPosts;
    });

    const [userLocation, setUserLocation] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeRisk, setActiveRisk] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('ecoalert_posts', JSON.stringify(posts));
    }, [posts]);

    /* Build a user object from the logged-in user, with a fallback */
    const currentUser = authUser
        ? {
            id: authUser.id,
            name: authUser.name,
            avatar: authUser.avatar,
            location: { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
        }
        : { id: 'guest', name: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest', location: { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 } };

    function addPost({ caption, category, imageSrc, locationCity, locationLat, locationLng, locationState }) {
        const fakeNews = detectFakeNews(caption, !!imageSrc);
        const risk = classifyRisk(caption);
        const suggestions = getSuggestions(category, risk.level);

        const newPost = {
            id: generateId(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            caption,
            category,
            location: {
                city: locationCity || currentUser.location.city,
                state: locationState || currentUser.location.state,
                lat: locationLat || currentUser.location.lat,
                lng: locationLng || currentUser.location.lng,
            },
            image: imageSrc || null,
            timestamp: new Date().toISOString(),
            likes: 0,
            shares: 0,
            reports: 0,
            hasImage: !!imageSrc,
            fakeNews,
            risk,
            suggestions,
        };

        setPosts((prev) => [newPost, ...prev]);
        return newPost;
    }

    function toggleLike(postId) {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p
            )
        );
    }

    function getFilteredPosts() {
        return posts.filter((p) => {
            const matchCat = activeCategory === 'All' || p.category === activeCategory;
            const matchRisk = activeRisk === 'All' || p.risk?.level === activeRisk;
            const matchSearch =
                !searchQuery ||
                p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchRisk && matchSearch;
        });
    }

    return (
        <AppContext.Provider
            value={{
                posts,
                user: currentUser,
                userLocation,
                setUserLocation,
                activeCategory,
                setActiveCategory,
                activeRisk,
                setActiveRisk,
                searchQuery,
                setSearchQuery,
                addPost,
                toggleLike,
                getFilteredPosts,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
