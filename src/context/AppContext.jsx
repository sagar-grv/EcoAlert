// ─── App Context ──────────────────────────────────────────────
// Production: Firestore real-time feed + Firebase Storage images.
// Demo mode: localStorage posts when Firebase not configured.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockPosts } from '../data/mockPosts';
import { useAuth } from './AuthContext';
import { FIREBASE_ENABLED } from '../firebase';
import {
    subscribeToPosts,
    addPostToFirestore,
    toggleLikeInFirestore,
    uploadPostImage,
} from '../services/firestoreService';
import { analyzePost } from '../services/geminiService';
import { generateId } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { user } = useAuth();

    // ── Posts state ───────────────────────────────────────────
    const [posts, setPosts] = useState(() => {
        if (FIREBASE_ENABLED) return []; // Firestore will populate
        const version = localStorage.getItem('ecoalert_posts_version');
        if (version !== '4') {
            localStorage.removeItem('ecoalert_posts');
            localStorage.setItem('ecoalert_posts_version', '4');
            return mockPosts;
        }
        const saved = localStorage.getItem('ecoalert_posts');
        return saved ? JSON.parse(saved) : mockPosts;
    });

    const [feedLoading, setFeedLoading] = useState(FIREBASE_ENABLED);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeRisk, setActiveRisk] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [bookmarks, setBookmarks] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ecoalert_bookmarks')) || []; } catch { return []; }
    });

    // ── Firestore real-time listener ──────────────────────────
    useEffect(() => {
        if (!FIREBASE_ENABLED) return;
        setFeedLoading(true);
        let seeded = false;
        const unsub = subscribeToPosts((livePosts) => {
            // If Firestore is empty, seed with mock posts on first load (once)
            if (livePosts.length === 0 && !seeded) {
                seeded = true;
                seedFirestoreWithMockPosts();
            } else {
                setPosts(livePosts);
            }
            setFeedLoading(false);
        });
        return unsub;
    }, []);

    // Seed Firestore with mock posts on first run
    async function seedFirestoreWithMockPosts() {
        for (const post of mockPosts) {
            await addPostToFirestore({ ...post, likedBy: [] });
        }
    }

    // ── Persist to localStorage in demo mode ─────────────────
    useEffect(() => {
        if (!FIREBASE_ENABLED) {
            localStorage.setItem('ecoalert_posts', JSON.stringify(posts));
        }
    }, [posts]);

    // ── Toast helper ──────────────────────────────────────────
    function showToast(message, type = 'success') {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 3500);
    }

    // ── Add post ──────────────────────────────────────────────
    async function addPost(postData, imageFile = null) {
        if (!user) return;

        const postId = generateId();

        // Run AI analysis
        let imageBase64 = null;
        if (imageFile) {
            imageBase64 = await fileToBase64(imageFile);
        }
        const analysis = await analyzePost(postData.caption, imageBase64, postData.category);

        let imageUrl = postData.image || null;

        if (FIREBASE_ENABLED) {
            // Upload image first
            if (imageFile) {
                try {
                    imageUrl = await uploadPostImage(imageFile, postId, null);
                } catch (e) {
                    console.warn('Image upload failed:', e);
                }
            }
            const doc = {
                ...postData,
                author: user.name,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
                userId: user.uid,
                image: imageUrl,
                location: {
                    city: postData.locationCity || postData.location?.city || 'Unknown',
                    state: postData.locationState || postData.location?.state || '',
                    lat: postData.locationLat || postData.location?.lat || null,
                    lng: postData.locationLng || postData.location?.lng || null,
                },
                fakeNews: analysis.fakeNews,
                risk: analysis.risk,
                suggestions: analysis.suggestions,
                imageVerification: analysis.imageVerification,
                liked: false,
                likedBy: [],
                likes: 0,
                shares: 0,
                hasImage: !!imageUrl,
            };
            // Remove flat location keys before saving
            delete doc.locationCity;
            delete doc.locationState;
            delete doc.locationLat;
            delete doc.locationLng;
            await addPostToFirestore(doc);
        } else {
            // Demo mode: add to local state
            const newPost = {
                id: postId,
                ...postData,
                author: user.name,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
                userId: user.uid,
                image: imageBase64 || null,
                location: {
                    city: postData.locationCity || postData.location?.city || 'Unknown',
                    state: postData.locationState || postData.location?.state || '',
                    lat: postData.locationLat || postData.location?.lat || null,
                    lng: postData.locationLng || postData.location?.lng || null,
                },
                fakeNews: analysis.fakeNews,
                risk: analysis.risk,
                suggestions: analysis.suggestions,
                imageVerification: analysis.imageVerification,
                timestamp: new Date().toISOString(),
                liked: false,
                likedBy: [],
                likes: 0,
                shares: 0,
                hasImage: !!imageFile || !!postData.image,
            };
            // Remove flat location keys
            delete newPost.locationCity;
            delete newPost.locationState;
            delete newPost.locationLat;
            delete newPost.locationLng;
            setPosts((prev) => [newPost, ...prev]);
        }
        showToast('✅ Report posted successfully!');
    }

    // ── Toggle like ───────────────────────────────────────────
    async function toggleLike(postId) {
        if (!user) return;
        const post = posts.find((p) => p.id === postId);
        if (!post) return;
        const isLiked = Array.isArray(post.likedBy)
            ? post.likedBy.includes(user.uid)
            : post.liked;

        if (FIREBASE_ENABLED) {
            await toggleLikeInFirestore(postId, user.uid, isLiked);
            // Firestore listener will update state automatically
        } else {
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? {
                            ...p,
                            liked: !isLiked,
                            likes: isLiked ? (p.likes || 0) - 1 : (p.likes || 0) + 1,
                            likedBy: isLiked
                                ? (p.likedBy || []).filter((id) => id !== user.uid)
                                : [...(p.likedBy || []), user.uid],
                        }
                        : p
                )
            );
        }
    }

    // ── Increment comment count (local) ───────────────────────
    function incrementCommentCount(postId) {
        if (!FIREBASE_ENABLED) {
            setPosts((prev) => {
                const newPosts = prev.map((p) =>
                    p.id === postId
                        ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                        : p
                );
                localStorage.setItem('ecoalert_posts', JSON.stringify(newPosts));
                return newPosts;
            });
        }
    }

    // ── Increment share count ─────────────────────────────────
    function incrementShareCount(postId) {
        setPosts((prev) => {
            const newPosts = prev.map((p) =>
                p.id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p
            );
            if (!FIREBASE_ENABLED) localStorage.setItem('ecoalert_posts', JSON.stringify(newPosts));
            return newPosts;
        });
    }

    // ── Bookmarks ─────────────────────────────────────────────
    function toggleBookmark(postId) {
        setBookmarks((prev) => {
            const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
            localStorage.setItem('ecoalert_bookmarks', JSON.stringify(next));
            return next;
        });
    }
    function isBookmarked(postId) { return bookmarks.includes(postId); }

    // ── Filtered posts ────────────────────────────────────────
    const getFilteredPosts = useCallback(() => {
        return posts.filter((p) => {
            const matchCat = activeCategory === 'All' || p.category === activeCategory;
            const matchRisk = activeRisk === 'All' || p.risk?.level === activeRisk;
            const q = searchQuery.toLowerCase();
            const matchSearch = !q ||
                (p.caption || '').toLowerCase().includes(q) ||
                (p.author || '').toLowerCase().includes(q) ||
                (p.location?.city || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q);
            return matchCat && matchRisk && matchSearch;
        });
    }, [posts, activeCategory, activeRisk, searchQuery]);

    return (
        <AppContext.Provider value={{
            posts, feedLoading, toast, showToast,
            activeCategory, setActiveCategory,
            activeRisk, setActiveRisk,
            searchQuery, setSearchQuery,
            userLocation, setUserLocation,
            addPost, toggleLike,
            getFilteredPosts,
            incrementCommentCount,
            incrementShareCount,
            bookmarks, toggleBookmark, isBookmarked
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be inside AppProvider');
    return ctx;
}

// Helper: file → base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
