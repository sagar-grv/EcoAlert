import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, PlusCircle, LogOut, User, ChevronDown, Bell, Mail, Home, Compass, BarChart3, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import LanguagePicker from './LanguagePicker';

export default function Navbar({ onCreatePost }) {
    const { searchQuery, setSearchQuery, getFilteredPosts } = useApp();
    const { user, logout } = useAuth();
    const { t } = useLang();
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
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    }

    // Get notification count (mock implementation)
    const notificationCount = 3;
    const messageCount = 5;
    
    // Get sample notifications (mock implementation)
    const notifications = [
        { id: 1, type: 'like', user: 'EcoWarrior', content: 'liked your post', time: '2m ago' },
        { id: 2, type: 'follow', user: 'GreenActivist', content: 'started following you', time: '1h ago' },
        { id: 3, type: 'reply', user: 'ClimateExpert', content: 'replied to your post', time: '3h ago' },
    ];
    
    // Get sample messages (mock implementation)
    const messages = [
        { id: 1, user: 'EcoWarrior', content: 'Thanks for sharing this!', time: '10m ago', unread: true },
        { id: 2, user: 'GreenActivist', content: 'Can we collaborate?', time: '1h ago', unread: false },
        { id: 3, user: 'ClimateExpert', content: 'Great initiative!', time: '2h ago', unread: false },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* ── LEFT: Brand ── */}
                <div className="navbar-brand" onClick={() => navigate('/')} title="Home">
                    <div className="navbar-logo-icon">🌿</div>
                    <span className="navbar-logo-text">EcoAlert</span>
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

                    {/* Notifications */}
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
                            {messageCount > 0 && (
                                <span className="notification-badge">{messageCount}</span>
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
                                    src={user.avatar}
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
                                    <button className="nud-profile" onClick={() => {setAvatarOpen(false); navigate(`/profile/${user.id}`);}}>
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
