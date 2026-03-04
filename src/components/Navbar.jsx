import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, PlusCircle, LogOut, User, ChevronDown, Bell, Mail, Home, Compass, BarChart3, MapPin, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import LanguagePicker from './LanguagePicker';

export default function Navbar({ onCreatePost }) {
    const { searchQuery, setSearchQuery, getFilteredPosts, posts } = useApp();
    const { user, logout } = useAuth();
    const { t } = useLang();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const avatarRef = useRef(null);
    const notificationRef = useRef(null);
    const messageRef = useRef(null);

    // close dropdowns on outside click
    useEffect(() => {
        function onOutside(e) {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setNotificationOpen(false);
            }
            if (messageRef.current && !messageRef.current.contains(e.target)) {
                setMessageOpen(false);
            }
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, []);

    function handleLogout() {
        setAvatarOpen(false);
        logout();
        navigate('/login');
    }

    function handleSearch(e) {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Navigate to home and let the filter handle search
            navigate('/');
        }
    }

    // Helper function for time difference (assuming it exists or is defined elsewhere)
    const formatTimeDiff = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffSeconds = Math.floor((now - postDate) / 1000);

        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    // Dynamic notifications from real posts
    const recentPosts = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    const notifications = recentPosts.map((p, i) => ({
        id: p.id,
        type: i === 0 ? 'alert' : i % 2 === 0 ? 'like' : 'reply',
        user: p.author || 'Unknown',
        content: p.risk?.level === 'Critical' ? `reported a Critical alert in ${p.location?.city || 'unknown area'}` : `posted about ${p.category || 'environment'} in ${p.location?.city || 'unknown area'}`,
        time: formatTimeDiff(p.timestamp),
    }));
    const notificationCount = notifications.length;

    const messages = recentPosts.slice(0, 3).map(p => ({
        id: p.id, user: p.author || 'Unknown',
        content: p.caption?.slice(0, 40) + (p.caption?.length > 40 ? '...' : ''),
        time: formatTimeDiff(p.timestamp), unread: true
    }));

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* ── LEFT: Brand ── */}
                <div className="navbar-brand" onClick={() => navigate('/')} title="Home">
                    <div className="navbar-logo-icon">🌿</div>
                    <span className="navbar-logo-text">EnviroX</span>
                </div>

                {/* ── CENTER: Search ── */}
                <div className="navbar-search">
                    <Search size={16} className="navbar-search-icon" />
                    <input
                        className="navbar-search-input"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                {/* ── RIGHT: Actions ── */}
                <div className="navbar-actions">

                    {/* Theme Toggle */}
                    <button
                        className="navbar-icon-btn"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{ fontSize: 0 }}
                    >
                        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                    </button>

                    <div className="navbar-notification-wrap" ref={notificationRef}>
                        <button
                            className="navbar-icon-btn"
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            {notificationCount > 0 && (
                                <span className="notification-badge">{notificationCount}</span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="navbar-dropdown">
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                    <button className="clear-notifications">Clear all</button>
                                </div>
                                <div className="dropdown-content">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="notification-item">
                                            <div className="notification-icon">
                                                {notification.type === 'like' && '❤️'}
                                                {notification.type === 'follow' && '👤'}
                                                {notification.type === 'reply' && '💬'}
                                            </div>
                                            <div className="notification-details">
                                                <span className="notification-user">{notification.user}</span>
                                                <span className="notification-content">{notification.content}</span>
                                                <span className="notification-time">{notification.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="navbar-message-wrap" ref={messageRef}>
                        <button
                            className="navbar-icon-btn"
                            onClick={() => setMessageOpen(!messageOpen)}
                            title="Messages"
                        >
                            <Mail size={20} />
                            {messages.length > 0 && (
                                <span className="notification-badge">{messages.length}</span>
                            )}
                        </button>

                        {messageOpen && (
                            <div className="navbar-dropdown">
                                <div className="dropdown-header">
                                    <h3>Messages</h3>
                                    <button className="view-messages" onClick={() => navigate('/messages')}>View all</button>
                                </div>
                                <div className="dropdown-content">
                                    {messages.map(message => (
                                        <div key={message.id} className="message-item">
                                            <div className="message-avatar">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.user}`} alt={message.user} />
                                            </div>
                                            <div className="message-details">
                                                <div className="message-header">
                                                    <span className="message-user">{message.user}</span>
                                                    <span className="message-time">{message.time}</span>
                                                </div>
                                                <div className="message-content">{message.content}</div>
                                            </div>
                                            {message.unread && <div className="unread-indicator"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post Tweet CTA */}
                    <button className="navbar-post-btn" onClick={onCreatePost} title="Post">
                        <PlusCircle size={16} />
                        <span>Post</span>
                    </button>

                    {/* Language Picker */}
                    <LanguagePicker />

                    {/* Avatar dropdown */}
                    {user && (
                        <div className="navbar-avatar-wrap" ref={avatarRef}>
                            <button
                                className="navbar-avatar-btn"
                                onClick={() => setAvatarOpen(v => !v)}
                                title={user.username || user.name}
                            >
                                <img
                                    className="navbar-avatar"
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.uid || user.name || 'eco')}`}
                                    alt={user.username || user.name}
                                />
                                <ChevronDown size={13} className={`navbar-chevron ${avatarOpen ? 'open' : ''}`} />
                            </button>

                            {avatarOpen && (
                                <div className="navbar-user-dropdown">
                                    <div className="navbar-user-info">
                                        <img src={user.avatar} alt={user.username || user.name} className="nud-avatar" />
                                        <div>
                                            <div className="nud-name">{user.username || user.name}</div>
                                            <div className="nud-handle">{user.handle || `@${user.name.toLowerCase().replace(/\s+/g, '')}`}</div>
                                        </div>
                                    </div>
                                    <div className="nud-divider" />
                                    <button className="nud-profile" onClick={() => { setAvatarOpen(false); navigate(`/profile/${user.uid || user.id}`); }}>
                                        <User size={14} />
                                        Profile
                                    </button>
                                    <button className="nud-logout" onClick={handleLogout}>
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
