// ─── App Context ──────────────────────────────────────────────
// Production: Firestore real-time feed + Firebase Storage images.
// Demo mode: localStorage posts when Firebase not configured.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockPosts } from '../data/mockPosts';
import { seedDemoComments } from '../data/demoComments';
import { useAuth } from './AuthContext';
import { FIREBASE_ENABLED } from '../firebase';
import {
    subscribeToPosts,
    addPostToFirestore,
    deletePostFromFirestore,
    toggleLikeInFirestore,
    incrementShareInFirestore,
    uploadPostImage,
    saveBookmarks,
    loadBookmarks,
    reportPost,
} from '../services/firestoreService';
import { analyzePost } from '../services/geminiService';
import { generateId, sanitizeInput } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { user } = useAuth();

    // ── Posts state ───────────────────────────────────────────
    const [posts, setPosts] = useState(() => {
        if (FIREBASE_ENABLED) return []; // Firestore will populate
        const version = localStorage.getItem('ecoalert_posts_version');
        if (version !== '5') {
            localStorage.removeItem('ecoalert_posts');
            localStorage.setItem('ecoalert_posts_version', '5');
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

    // ── Seed demo comments on first run (demo mode) ──────────
    useEffect(() => {
        if (!FIREBASE_ENABLED) {
            seedDemoComments();
        }
    }, []);

    // ── Load bookmarks from Firestore on login ───────────────
    useEffect(() => {
        if (FIREBASE_ENABLED && user?.uid) {
            loadBookmarks(user.uid).then((ids) => {
                if (ids.length > 0) setBookmarks(ids);
            });
        }
    }, [user?.uid]);

    // ── Firestore real-time listener ──────────────────────────
    useEffect(() => {
        if (!FIREBASE_ENABLED) return;
        setFeedLoading(true);
        let seeded = false;
        const unsub = subscribeToPosts((livePosts) => {
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
        const cleanCaption = sanitizeInput(postData.caption);

        let imageBase64 = null;
        if (imageFile) {
            imageBase64 = await fileToBase64(imageFile);
        }
        const analysis = await analyzePost(cleanCaption, imageBase64, postData.category);

        let imageUrl = postData.image || null;

        if (FIREBASE_ENABLED) {
            if (imageFile) {
                try {
                    imageUrl = await uploadPostImage(imageFile, postId, null);
                } catch (e) {
                    console.warn('Image upload failed:', e);
                }
            }
            const doc = {
                ...postData,
                caption: cleanCaption,
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
            delete doc.locationCity;
            delete doc.locationState;
            delete doc.locationLat;
            delete doc.locationLng;
            await addPostToFirestore(doc);
        } else {
            const newPost = {
                id: postId,
                ...postData,
                caption: cleanCaption,
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
            delete newPost.locationCity;
            delete newPost.locationState;
            delete newPost.locationLat;
            delete newPost.locationLng;
            setPosts((prev) => [newPost, ...prev]);
        }
        showToast('✅ Report posted successfully!');
    }

    // ── Delete post ──────────────────────────────────────────
    async function deletePost(postId) {
        if (!user) return;
        try {
            if (FIREBASE_ENABLED) {
                await deletePostFromFirestore(postId);
            } else {
                setPosts((prev) => prev.filter((p) => p.id !== postId));
                localStorage.removeItem(`ecoalert_comments_${postId}`);
            }
            showToast('🗑️ Post deleted');
        } catch (err) {
            showToast(err.message || 'Failed to delete post', 'error');
        }
    }

    // ── Report post ──────────────────────────────────────────
    async function reportPostHandler(postId, reason) {
        try {
            if (FIREBASE_ENABLED) {
                await reportPost(postId, { reportedBy: user?.uid, reason });
            } else {
                const reports = JSON.parse(localStorage.getItem('ecoalert_reports') || '[]');
                reports.push({ postId, reportedBy: user?.uid, reason, timestamp: new Date().toISOString() });
                localStorage.setItem('ecoalert_reports', JSON.stringify(reports));
            }
            showToast('⚠️ Post reported. We will review it.');
        } catch {
            showToast('Failed to report post', 'error');
        }
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
    async function incrementShareCount(postId) {
        if (FIREBASE_ENABLED) {
            await incrementShareInFirestore(postId);
        }
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
            if (FIREBASE_ENABLED && user?.uid) {
                saveBookmarks(user.uid, next);
            }
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
            addPost, deletePost, reportPost: reportPostHandler,
            toggleLike,
            getFilteredPosts,
            incrementCommentCount,
            incrementShareCount,
            bookmarks, toggleBookmark, isBookmarked,
            isFirebase: FIREBASE_ENABLED,
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
