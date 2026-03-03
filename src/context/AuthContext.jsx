// ─── Auth Context ─────────────────────────────────────────
// Enhanced auth system with social media features
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('envirox_user');
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch (_) { }
        }
        setLoading(false);
    }, []);

    function login({ name, phone, email, bio, lang = 'en', avatar, isVerified = false }) {
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        let newUser;
        
        // Check if user already exists
        const existingUser = Object.values(savedUsers).find(u => u.email === email || u.phone === phone);
        
        if (existingUser) {
            // Return existing user if found
            newUser = existingUser;
        } else {
            // Create new user
            newUser = {
                id: 'u_' + Date.now(),
                name,
                phone,
                email,
                bio: bio || '',
                lang,
                avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                handle: '@' + name.toLowerCase().replace(/\s+/g, '_'),
                joinedAt: new Date().toISOString(),
                followers: [],
                following: [],
                tweets: [],
                likes: [],
                bookmarks: [],
                isVerified,
                isOnline: true,
            };
            
            // Save new user to users list
            savedUsers[newUser.id] = newUser;
            localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
        }
        
        setUser(newUser);
        localStorage.setItem('envirox_user', JSON.stringify(newUser));
        return newUser;
    }

    function logout() {
        if (user) {
            // Update user's online status
            const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
            if (savedUsers[user.id]) {
                savedUsers[user.id].isOnline = false;
                localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
            }
        }
        setUser(null);
        localStorage.removeItem('envirox_user');
    }

    function updateProfile(updates) {
        if (!user) return;
        
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('envirox_user', JSON.stringify(updatedUser));
        
        // Update in users list as well
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        if (savedUsers[user.id]) {
            savedUsers[user.id] = { ...savedUsers[user.id], ...updates };
            localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
        }
    }
    
    function followUser(targetUserId) {
        if (!user) return false;
        
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        
        if (!savedUsers[targetUserId]) return false;
        
        // Add to current user's following
        if (!user.following.includes(targetUserId)) {
            const updatedFollowing = [...user.following, targetUserId];
            updateProfile({ following: updatedFollowing });
        }
        
        // Add current user to target user's followers
        if (!savedUsers[targetUserId].followers.includes(user.id)) {
            savedUsers[targetUserId].followers.push(user.id);
            localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
        }
        
        return true;
    }
    
    function unfollowUser(targetUserId) {
        if (!user) return false;
        
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        
        if (!savedUsers[targetUserId]) return false;
        
        // Remove from current user's following
        const updatedFollowing = user.following.filter(id => id !== targetUserId);
        updateProfile({ following: updatedFollowing });
        
        // Remove current user from target user's followers
        savedUsers[targetUserId].followers = savedUsers[targetUserId].followers.filter(id => id !== user.id);
        localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
        
        return true;
    }
    
    function updateLang(lang) {
        if (!user) return;
        const updated = { ...user, lang };
        setUser(updated);
        localStorage.setItem('envirox_user', JSON.stringify(updated));
        
        // Update in users list as well
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        if (savedUsers[user.id]) {
            savedUsers[user.id].lang = lang;
            localStorage.setItem('envirox_users', JSON.stringify(savedUsers));
        }
    }
    
    function getUserById(userId) {
        const savedUsers = JSON.parse(localStorage.getItem('envirox_users') || '{}');
        return savedUsers[userId] || null;
    }
    
    function getAllUsers() {
        return JSON.parse(localStorage.getItem('envirox_users') || '{}');
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            updateProfile,
            followUser,
            unfollowUser,
            getUserById,
            getAllUsers,
            updateLang, 
            loading 
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
