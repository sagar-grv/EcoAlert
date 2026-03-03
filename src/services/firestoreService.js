// ─── Firestore Service ───────────────────────────────────────
// All Firestore read/write operations centralised here.
// Falls back to no-op if Firebase is not configured.

import {
    collection, addDoc, updateDoc, deleteDoc,
    doc, onSnapshot, query, orderBy,
    serverTimestamp, increment, arrayUnion, arrayRemove,
    getDoc, setDoc, limit,
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
    });
}

/**
 * Add a new post document to Firestore.
 */
export async function addPostToFirestore(postData) {
    if (!FIREBASE_ENABLED) return null;
    const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        timestamp: serverTimestamp(),
        likes: 0,
        likedBy: [],
        shares: 0,
    });
    return docRef.id;
}

/**
 * Toggle like on a post. Uses arrayUnion/arrayRemove + increment.
 */
export async function toggleLikeInFirestore(postId, userId, currentlyLiked) {
    if (!FIREBASE_ENABLED) return;
    const ref = doc(db, 'posts', postId);
    await updateDoc(ref, {
        likes: increment(currentlyLiked ? -1 : 1),
        likedBy: currentlyLiked ? arrayRemove(userId) : arrayUnion(userId),
    });
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
            reject,
            async () => { resolve(await getDownloadURL(task.snapshot.ref)); }
        );
    });
}

/* ── User Profiles ──────────────────────────────────────── */

export async function saveUserProfile(uid, profileData) {
    if (!FIREBASE_ENABLED) return;
    await setDoc(doc(db, 'users', uid), profileData, { merge: true });
}

export async function getUserProfile(uid) {
    if (!FIREBASE_ENABLED) return null;
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
