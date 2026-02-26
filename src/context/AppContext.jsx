import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDocs,
    limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { analyzePost } from '../services/geminiService';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { seedPosts } from '../data/mockPosts';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { user: authUser } = useAuth();

    const [posts, setPosts] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeRisk, setActiveRisk] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Used to track whether we've already seeded; avoids duplicate seeding on fast re-mounts.
    const seeded = useRef(false);

    /* -----------------------------------------------------------------
       Real-time Feed: Firestore onSnapshot listener
    ----------------------------------------------------------------- */
    useEffect(() => {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('timestamp', 'desc'));

        const unsub = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty && !seeded.current) {
                // First load — Firestore is empty — seed with mock posts
                seeded.current = true;
                await seedFirestore();
                // The snapshot listener will fire again once seeding is done
                return;
            }

            const loadedPosts = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                // Firestore Timestamps → ISO strings for consistent formatting
                timestamp: d.data().timestamp?.toDate?.()?.toISOString() ?? new Date().toISOString(),
            }));
            setPosts(loadedPosts);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    /* -----------------------------------------------------------------
       Seed helper — runs once when Firestore is empty
    ----------------------------------------------------------------- */
    async function seedFirestore() {
        const postsRef = collection(db, 'posts');
        // Write all seed posts in parallel
        await Promise.all(
            seedPosts.map((p) =>
                addDoc(postsRef, {
                    ...p,
                    timestamp: serverTimestamp(),
                })
            )
        );
    }

    /* -----------------------------------------------------------------
       Current user object (mock auth until Auth is implemented)
    ----------------------------------------------------------------- */
    const currentUser = authUser
        ? {
            id: authUser.id,
            name: authUser.name,
            avatar: authUser.avatar,
        }
        : {
            id: 'guest',
            name: 'Guest',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
        };

    /* -----------------------------------------------------------------
       addPost — Gemini AI analysis → Firestore addDoc
    ----------------------------------------------------------------- */
    async function addPost({ caption, category, imageSrc, locationCity, locationLat, locationLng, locationState }) {
        setPosting(true);
        try {
            const analysis = await analyzePost(caption, category, !!imageSrc);

            const newPost = {
                authorId: currentUser.id,
                author: currentUser.name,
                avatar: currentUser.avatar,
                caption,
                category,
                location: {
                    city: locationCity || 'Mumbai',
                    state: locationState || 'Maharashtra',
                    lat: locationLat || 19.076,
                    lng: locationLng || 72.878,
                },
                image: imageSrc || null,
                timestamp: serverTimestamp(),   // Firestore server-side timestamp
                likes: 0,
                likedBy: [],                    // track who has liked (for per-user toggle)
                shares: 0,
                reports: 0,
                hasImage: !!imageSrc,
                fakeNews: analysis.fakeNews,
                risk: analysis.risk,
                suggestions: analysis.suggestions,
                aiInsight: analysis.aiInsight || '',
                aiSource: analysis.source,
            };

            await addDoc(collection(db, 'posts'), newPost);
            // No need to call setPosts — the onSnapshot listener fires automatically
        } finally {
            setPosting(false);
        }
    }

    /* -----------------------------------------------------------------
       toggleLike — persisted to Firestore, per-user
    ----------------------------------------------------------------- */
    async function toggleLike(postId) {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const userId = currentUser.id;
        const alreadyLiked = (post.likedBy || []).includes(userId);

        const docRef = doc(db, 'posts', postId);
        if (alreadyLiked) {
            await updateDoc(docRef, {
                likes: Math.max(0, (post.likes || 1) - 1),
                likedBy: (post.likedBy || []).filter((id) => id !== userId),
                liked: false,
            });
        } else {
            await updateDoc(docRef, {
                likes: (post.likes || 0) + 1,
                likedBy: [...(post.likedBy || []), userId],
                liked: true,
            });
        }
        // Optimistic local update for instant UI feedback
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? {
                        ...p,
                        likes: alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
                        likedBy: alreadyLiked
                            ? (p.likedBy || []).filter((id) => id !== userId)
                            : [...(p.likedBy || []), userId],
                        liked: !alreadyLiked,
                    }
                    : p
            )
        );
    }

    /* -----------------------------------------------------------------
       getFilteredPosts — client-side filtering (search, category, risk)
    ----------------------------------------------------------------- */
    function getFilteredPosts() {
        return posts.filter((p) => {
            const matchCat = activeCategory === 'All' || p.category === activeCategory;
            const matchRisk = activeRisk === 'All' || p.risk?.level === activeRisk;
            const matchSearch =
                !searchQuery ||
                p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchRisk && matchSearch;
        });
    }

    return (
        <AppContext.Provider
            value={{
                posts,
                loading,
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
                posting,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
