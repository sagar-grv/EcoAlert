// ─── Auth Context ─────────────────────────────────────────
// Mock auth — no server calls. Stores user in localStorage.
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('ecoalert_user');
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch (_) { }
        }
        setLoading(false);
    }, []);

    function login({ name, phone, lang = 'en', avatar }) {
        const newUser = {
            id: 'u_' + Date.now(),
            name,
            phone,
            lang,
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            handle: '@' + name.toLowerCase().replace(/\s+/g, '_'),
            joinedAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('ecoalert_user', JSON.stringify(newUser));
        return newUser;
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('ecoalert_user');
    }

    function updateLang(lang) {
        if (!user) return;
        const updated = { ...user, lang };
        setUser(updated);
        localStorage.setItem('ecoalert_user', JSON.stringify(updated));
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateLang, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
