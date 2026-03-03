// ─── Auth Context ─────────────────────────────────────────────
// Production: uses Firebase Auth (Google popup + Phone OTP).
// Demo mode: falls back to localStorage mock auth when Firebase is not configured.

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged, signInWithPopup, signOut,
    signInWithPhoneNumber, updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, FIREBASE_ENABLED } from '../firebase';
import { saveUserProfile, getUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        if (FIREBASE_ENABLED) {
            // Production: listen to Firebase auth state
            const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    // Merge Firestore profile (displayName, lang, etc.)
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUser({
                        uid: firebaseUser.uid,
                        name: profile?.name || firebaseUser.displayName || 'User',
                        email: firebaseUser.email,
                        phone: firebaseUser.phoneNumber || profile?.phone || '',
                        avatar: firebaseUser.photoURL || profile?.avatar || null,
                        lang: profile?.lang || 'en',
                        state: profile?.state || '',
                    });
                } else {
                    setUser(null);
                }
                setLoading(false);
            });
            return unsub;
        } else {
            // Demo mode: read from localStorage
            const saved = localStorage.getItem('ecoalert_user');
            if (saved) {
                try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
            }
            setLoading(false);
        }
    }, []);

    /* ── Google Sign-In ──────────────────────────────────────── */
    async function loginWithGoogle() {
        setAuthError('');
        if (!FIREBASE_ENABLED) {
            // Demo fallback
            const mockNames = ['Priya Sharma', 'Rahul Verma', 'Anjali Rao', 'Vikram Singh', 'Meera Pillai'];
            const name = mockNames[Math.floor(Math.random() * mockNames.length)];
            const u = { uid: `demo_${Date.now()}`, name, email: `${name.replace(' ', '').toLowerCase()}@demo.com`, lang: 'en', avatar: null };
            localStorage.setItem('ecoalert_user', JSON.stringify(u));
            setUser(u);
            return;
        }
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const u = result.user;
            await saveUserProfile(u.uid, {
                name: u.displayName,
                email: u.email,
                avatar: u.photoURL,
                lang: 'en',
                createdAt: new Date().toISOString(),
            });
        } catch (err) {
            setAuthError(err.message);
            throw err;
        }
    }

    /* ── Phone OTP Sign-In ───────────────────────────────────── */
    async function sendOTP(phoneNumber, recaptchaVerifier) {
        if (!FIREBASE_ENABLED) throw new Error('Firebase not configured');
        setAuthError('');
        try {
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            return confirmation;
        } catch (err) {
            setAuthError(err.message);
            throw err;
        }
    }

    async function verifyOTP(confirmation, otp, name) {
        setAuthError('');
        try {
            const result = await confirmation.confirm(otp);
            const u = result.user;
            if (name) await updateProfile(u, { displayName: name });
            await saveUserProfile(u.uid, {
                name: name || u.displayName || 'User',
                phone: u.phoneNumber,
                lang: 'en',
                createdAt: new Date().toISOString(),
            });
        } catch (err) {
            setAuthError(err.message);
            throw err;
        }
    }

    /* ── Mock login (demo) ───────────────────────────────────── */
    function login({ name, phone, lang = 'en' }) {
        const u = {
            uid: `demo_${Date.now()}`,
            name,
            phone,
            lang,
            avatar: null,
            email: '',
            state: '',
        };
        localStorage.setItem('ecoalert_user', JSON.stringify(u));
        setUser(u);
    }

    /* ── Logout ──────────────────────────────────────────────── */
    async function logout() {
        if (FIREBASE_ENABLED) {
            await signOut(auth);
        }
        localStorage.removeItem('ecoalert_user');
        setUser(null);
    }

    /* ── Update lang preference ──────────────────────────────── */
    async function updateLang(langCode) {
        if (!user) return;
        const updated = { ...user, lang: langCode };
        setUser(updated);
        if (FIREBASE_ENABLED && user.uid) {
            await saveUserProfile(user.uid, { lang: langCode });
        } else {
            localStorage.setItem('ecoalert_user', JSON.stringify(updated));
        }
    }

    /* ── Update user profile ─────────────────────────────────── */
    async function updateUserProfile(updates) {
        if (!user) return;

        if (FIREBASE_ENABLED && auth.currentUser) {
            if (updates.displayName && updates.displayName !== auth.currentUser.displayName) {
                await updateProfile(auth.currentUser, { displayName: updates.displayName });
            }
            await saveUserProfile(user.uid, updates);
        }

        const updated = { ...user, name: updates.displayName || user.name, ...updates };
        delete updated.displayName; // keep it normalized as `name`

        setUser(updated);
        if (!FIREBASE_ENABLED) {
            localStorage.setItem('ecoalert_user', JSON.stringify(updated));
        }
    }

    return (
        <AuthContext.Provider value={{
            user, loading, authError,
            login, loginWithGoogle, sendOTP, verifyOTP, logout, updateLang,
            updateUserProfile,
            isFirebase: FIREBASE_ENABLED
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
