import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, LogOut, Loader2, Save, MapPin, Bookmark } from 'lucide-react';
import PostCard from '../components/PostCard';
import FeedSkeleton from '../components/FeedSkeleton';
import { getUserProfile } from '../services/firestoreService';

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout, updateUserProfile } = useAuth();
    const { showToast, posts, bookmarks } = useApp();

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    const [editForm, setEditForm] = useState({
        displayName: '',
        bio: '',
        location: ''
    });
    const [saving, setSaving] = useState(false);

    const isOwnProfile = user && (user.uid === id || user.id === id);

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            try {
                if (isOwnProfile) {
                    setProfileData({
                        uid: user.id || user.uid,
                        displayName: user.displayName || user.name || '',
                        photoURL: user.avatar || user.photoURL,
                        email: user.email || '',
                        bio: user.bio || '',
                        location: user.location || ''
                    });
                    setEditForm({
                        displayName: user.displayName || user.name || '',
                        bio: user.bio || '',
                        location: user.location || ''
                    });
                } else {
                    const otherProfile = await getUserProfile(id);
                    if (otherProfile) {
                        setProfileData(otherProfile);
                    } else {
                        const decodedId = decodeURIComponent(id);
                        setProfileData({
                            uid: id,
                            displayName: decodedId,
                            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${decodedId}`,
                            bio: 'Eco-Warrior · Earth Advocate\n(Demo User)',
                            location: 'Global Citizen'
                        });
                    }
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [id, user, isOwnProfile]);

    // User stats
    const userPosts = posts.filter(p => p.userId === id || p.author === profileData?.displayName);
    const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalShares = userPosts.reduce((sum, p) => sum + (p.shares || 0), 0);
    const impactScore = userPosts.length * 50 + totalLikes * 10 + totalShares * 5;
    const savedPosts = posts.filter(p => bookmarks.includes(p.id));

    async function handleSaveProfile(e) {
        e.preventDefault();
        if (!isOwnProfile) return;
        setSaving(true);
        try {
            await updateUserProfile(editForm);
            setProfileData(prev => ({ ...prev, ...editForm }));
            setIsEditing(false);
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            console.error("Update profile failed", err);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div style={{ padding: '2rem' }}><FeedSkeleton /></div>;

    if (!profileData) {
        return (
            <div className="profile-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <User size={48} style={{ margin: '0 auto', opacity: 0.3 }} />
                <h2>User not found</h2>
                <p>The profile you're looking for does not exist or has been removed.</p>
                <button className="post-btn" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    return (
        <div className="profile-wrapper" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header */}
            <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <img
                    src={profileData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.displayName}`}
                    alt="Avatar"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', background: 'var(--glass)' }}
                />

                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input className="styled-input" value={editForm.displayName} onChange={e => setEditForm({ ...editForm, displayName: e.target.value })} placeholder="Display Name" required />
                            <input className="styled-input" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location (Optional)" />
                            <textarea className="styled-input" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Short bio..." rows={2} />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button type="submit" className="post-btn" disabled={saving}>
                                    {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} Save
                                </button>
                                <button type="button" className="action-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: 'var(--text)' }}>
                                {profileData.displayName || 'EcoWarrior'}
                            </h1>
                            {profileData.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={14} /> {profileData.location}
                                </div>
                            )}
                            {profileData.bio && (
                                <p style={{ margin: '0.25rem 0 0.75rem 0', color: 'var(--text)', fontSize: '0.95rem' }}>
                                    {profileData.bio}
                                </p>
                            )}
                            {isOwnProfile && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="action-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                    <button className="action-btn" style={{ color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => { logout(); navigate('/login'); }}>
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem',
                padding: '1rem', marginBottom: '1.5rem',
                background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--glass-border)',
                textAlign: 'center'
            }}>
                {[
                    { label: 'Posts', value: userPosts.length, color: 'var(--green)' },
                    { label: 'Likes', value: totalLikes, color: '#f43f5e' },
                    { label: 'Shares', value: totalShares, color: '#3b82f6' },
                    { label: 'Impact', value: impactScore, color: 'var(--amber)' }
                ].map(s => (
                    <div key={s.label}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif' }}>
                            {s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                {(['posts', ...(isOwnProfile ? ['saved'] : [])]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1, padding: '0.75rem 0', background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize',
                            color: activeTab === tab ? 'var(--green)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '2px solid var(--green)' : '2px solid transparent',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                        }}
                    >
                        {tab === 'saved' && <Bookmark size={14} />}
                        {tab} {tab === 'posts' ? `(${userPosts.length})` : `(${savedPosts.length})`}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="profile-content">
                {activeTab === 'posts' && (
                    userPosts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                            <p>No posts yet.</p>
                        </div>
                    ) : (
                        userPosts.map(post => <PostCard key={post.id} post={post} />)
                    )
                )}
                {activeTab === 'saved' && (
                    savedPosts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                            <Bookmark size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                            <p>No saved posts yet. Bookmark posts to see them here.</p>
                        </div>
                    ) : (
                        savedPosts.map(post => <PostCard key={post.id} post={post} />)
                    )
                )}
            </div>
        </div>
    );
}
