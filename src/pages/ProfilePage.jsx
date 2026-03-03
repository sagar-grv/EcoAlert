import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, LogOut, Loader2, Save, MapPin } from 'lucide-react';
import FeedSkeleton from '../components/FeedSkeleton';
import { getUserProfile } from '../services/firestoreService';

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout, updateUserProfile } = useAuth();
    const { setToast } = useApp();

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        displayName: '',
        bio: '',
        location: ''
    });
    const [saving, setSaving] = useState(false);

    // Is this the currently logged-in user's profile?
    const isOwnProfile = user && user.id === id;

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
                        // For demo mode or if profile not found
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

    async function handleSaveProfile(e) {
        e.preventDefault();
        if (!isOwnProfile) return;
        setSaving(true);
        try {
            await updateUserProfile(editForm);
            setProfileData(prev => ({ ...prev, ...editForm }));
            setIsEditing(false);
            setToast({ text: "Profile updated successfully!", type: "success" });
        } catch (err) {
            console.error("Update profile failed", err);
            setToast({ text: "Failed to update profile", type: "error" });
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
            <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <img
                    src={profileData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.displayName}`}
                    alt="Avatar"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', background: 'var(--glass)' }}
                />

                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                                className="styled-input"
                                value={editForm.displayName}
                                onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                placeholder="Display Name"
                                required
                            />
                            <input
                                className="styled-input"
                                value={editForm.location}
                                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                placeholder="Location (Optional)"
                            />
                            <textarea
                                className="styled-input"
                                value={editForm.bio}
                                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                placeholder="Short bio..."
                                rows={2}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button type="submit" className="post-btn" disabled={saving}>
                                    {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
                                    Save
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
                                <p style={{ margin: '0.25rem 0 1rem 0', color: 'var(--text)', fontSize: '0.95rem' }}>
                                    {profileData.bio}
                                </p>
                            )}
                            {profileData.email && (
                                <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {profileData.email}
                                </p>
                            )}

                            {isOwnProfile && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
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

            <div className="profile-content">
                <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    Activity
                </h3>
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                    <p>No recent activity found.</p>
                </div>
            </div>
        </div>
    );
}
