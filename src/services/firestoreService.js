// ─── Firestore Service ───────────────────────────────────────
// All Firestore read/write operations centralised here.
// Falls back to no-op if Firebase is not configured.

import {
    collection, addDoc, updateDoc, deleteDoc,
    doc, onSnapshot, query, orderBy,
    serverTimestamp, increment, arrayUnion, arrayRemove,
    getDoc, setDoc, getDocs, limit,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, FIREBASE_ENABLED } from '../firebase';

/* ── Posts ──────────────────────────────────────────────── */

/**
 * Subscribe to the live posts feed.
 * Returns an unsubscribe function.
 */
export function subscribeToPosts(callback, maxPosts = 50) {
    if (!FIREBASE_ENABLED) return () => { };
    const q = query(
        collection(db, 'posts'),
        orderBy('timestamp', 'desc'),
        limit(maxPosts)
    );
    return onSnapshot(q, (snap) => {
        const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(posts);
    }, (err) => {
        console.error('Firestore subscribeToPosts error:', err);
        callback([]);
    });
}

/**
 * Add a new post document to Firestore.
 */
export async function addPostToFirestore(postData) {
    if (!FIREBASE_ENABLED) return null;
    try {
        const docRef = await addDoc(collection(db, 'posts'), {
            ...postData,
            timestamp: serverTimestamp(),
            likes: postData.likes || 0,
            likedBy: postData.likedBy || [],
            shares: postData.shares || 0,
            commentCount: postData.commentCount || 0,
        });
        return docRef.id;
    } catch (err) {
        console.error('Failed to add post:', err);
        throw new Error('Failed to create post. Please try again.');
    }
}

/**
 * Delete a post and its subcollection (comments).
 */
export async function deletePostFromFirestore(postId) {
    if (!FIREBASE_ENABLED) return;
    try {
        // Delete all comments first
        const commentsSnap = await getDocs(collection(db, `posts/${postId}/comments`));
        const deletePromises = commentsSnap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        // Delete the post
        await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
        console.error('Failed to delete post:', err);
        throw new Error('Failed to delete post. Please try again.');
    }
}

/**
 * Update a post's fields (caption, category, etc.).
 */
export async function updatePostInFirestore(postId, updates) {
    if (!FIREBASE_ENABLED) return;
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, updates);
    } catch (err) {
        console.error('Failed to update post:', err);
        throw new Error('Failed to update post. Please try again.');
    }
}

/**
 * Toggle like on a post. Uses arrayUnion/arrayRemove + increment.
 */
export async function toggleLikeInFirestore(postId, userId, currentlyLiked) {
    if (!FIREBASE_ENABLED) return;
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: increment(currentlyLiked ? -1 : 1),
            likedBy: currentlyLiked ? arrayRemove(userId) : arrayUnion(userId),
        });
    } catch (err) {
        console.error('Failed to toggle like:', err);
    }
}

/**
 * Increment share count in Firestore.
 */
export async function incrementShareInFirestore(postId) {
    if (!FIREBASE_ENABLED) return;
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { shares: increment(1) });
    } catch (err) {
        console.error('Failed to increment share:', err);
    }
}

/* ── Image Upload ───────────────────────────────────────── */

/**
 * Upload image to Firebase Storage. Returns download URL.
 * onProgress(0-100) optional callback.
 */
export function uploadPostImage(file, postId, onProgress) {
    return new Promise((resolve, reject) => {
        if (!FIREBASE_ENABLED) { reject(new Error('Firebase not configured')); return; }
        const storageRef = ref(storage, `posts/${postId}/${Date.now()}_${file.name}`);
        const task = uploadBytesResumable(storageRef, file);
        task.on(
            'state_changed',
            (snap) => onProgress && onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => { console.error('Upload error:', err); reject(new Error('Image upload failed.')); },
            async () => { resolve(await getDownloadURL(task.snapshot.ref)); }
        );
    });
}

/* ── User Profiles ──────────────────────────────────────── */

export async function saveUserProfile(uid, profileData) {
    if (!FIREBASE_ENABLED) return;
    try {
        await setDoc(doc(db, 'users', uid), profileData, { merge: true });
    } catch (err) {
        console.error('Failed to save profile:', err);
    }
}

export async function getUserProfile(uid) {
    if (!FIREBASE_ENABLED) return null;
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
        console.error('Failed to get profile:', err);
        return null;
    }
}

/* ── Bookmarks (per-user) ───────────────────────────────── */

export async function saveBookmarks(uid, bookmarkIds) {
    if (!FIREBASE_ENABLED) return;
    try {
        await setDoc(doc(db, 'users', uid), { bookmarks: bookmarkIds }, { merge: true });
    } catch (err) {
        console.error('Failed to save bookmarks:', err);
    }
}

export async function loadBookmarks(uid) {
    if (!FIREBASE_ENABLED) return [];
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? (snap.data().bookmarks || []) : [];
    } catch (err) {
        console.error('Failed to load bookmarks:', err);
        return [];
    }
}

/* ── Comments ────────────────────────────────────────────── */

export function subscribeToComments(postId, callback) {
    if (!FIREBASE_ENABLED) return () => { };
    const q = query(
        collection(db, `posts/${postId}/comments`),
        orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snap) => {
        const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(comments);
    }, (err) => {
        console.error('Comments listener error:', err);
        callback([]);
    });
}

export async function addCommentToFirestore(postId, commentData) {
    if (!FIREBASE_ENABLED) return null;
    try {
        const docRef = await addDoc(collection(db, `posts/${postId}/comments`), {
            ...commentData,
            timestamp: serverTimestamp(),
        });
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { commentCount: increment(1) });
        return docRef.id;
    } catch (err) {
        console.error('Failed to add comment:', err);
        throw new Error('Failed to add comment. Please try again.');
    }
}

/* ── Reports ─────────────────────────────────────────────── */

export async function reportPost(postId, reportData) {
    if (!FIREBASE_ENABLED) return;
    try {
        await addDoc(collection(db, 'reports'), {
            postId,
            ...reportData,
            timestamp: serverTimestamp(),
        });
    } catch (err) {
        console.error('Failed to report post:', err);
    }
}
