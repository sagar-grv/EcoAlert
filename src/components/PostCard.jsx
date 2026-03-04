import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Repeat2, Share2, Flag, MapPin, ImageOff, MessageCircle, Bookmark, MoreHorizontal, Trash2, AlertTriangle } from 'lucide-react';
import RiskBadge from './RiskBadge';
import FakeNewsIndicator from './FakeNewsIndicator';
import AISuggestionPanel from './AISuggestionPanel';
import CommentSection from './CommentSection';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/helpers';

const PostCard = React.memo(function PostCard({ post }) {
    const navigate = useNavigate();
    const { toggleLike, setSearchQuery, incrementShareCount, toggleBookmark, isBookmarked, deletePost, reportPost } = useApp();
    const { user } = useAuth();
    const isLiked = Array.isArray(post.likedBy)
        ? post.likedBy.includes(user?.uid)
        : post.liked;
    const isOwnPost = user && (post.userId === user.uid || post.author === user.name);
    const [shared, setShared] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post.shares || 0);
    const [flagged, setFlagged] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        if (!showMenu) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showMenu]);

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        setShowMenu(false);
        await deletePost(post.id);
    };

    const handleReport = () => {
        setShowMenu(false);
        reportPost(post.id, 'Reported by user');
    };

    const handleShare = () => {
        setShared(true);
        incrementShareCount(post.id);
        setTimeout(() => setShared(false), 2000);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`EcoAlert: ${post.caption} — ${post.location?.city || 'Unknown'}`);
        }
    };

    const handleRetweet = () => {
        setRetweeted(prev => {
            const next = !prev;
            setRetweetCount(c => next ? c + 1 : c - 1);
            return next;
        });
    };

    const handleFlag = () => {
        setFlagged(prev => !prev);
    };

    const renderCaption = (text) => {
        if (!text) return null;
        return text.split(/(#\w+)/g).map((part, i) => {
            if (part.startsWith('#')) {
                return (
                    <span
                        key={i}
                        style={{ color: 'var(--green)', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSearchQuery && setSearchQuery(part);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
        });
    };

    const handle = '@' + (post.author || 'User').toLowerCase().replace(/\s+/g, '_');

    return (
        <article className="post-card">
            {/* Avatar column */}
            <div className="post-avatar-col" onClick={() => navigate('/profile/' + encodeURIComponent(post.author || 'User'))} style={{ cursor: 'pointer' }}>
                <img className="post-avatar" src={post.avatar} alt={post.author || 'User'} />
            </div>

            {/* Main body */}
            <div className="post-body">
                {/* Header row: name · handle · time · menu */}
                <div className="post-header-row">
                    <span className="post-author" onClick={() => navigate('/profile/' + encodeURIComponent(post.author || 'User'))} style={{ cursor: 'pointer' }}>{post.author || 'User'}</span>
                    <span className="post-handle">{handle}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time" onClick={() => navigate('/post/' + post.id)} style={{ cursor: 'pointer' }} title="View full post">{formatTime(post.timestamp)}</span>
                    {/* ⋯ menu */}
                    <div className="post-menu-wrap" ref={menuRef} style={{ marginLeft: 'auto' }}>
                        <button className="action-btn post-menu-btn" onClick={() => setShowMenu((p) => !p)} title="More options">
                            <MoreHorizontal size={16} />
                        </button>
                        {showMenu && (
                            <div className="post-dropdown">
                                {isOwnPost ? (
                                    <button className="post-dropdown-item danger" onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}>
                                        <Trash2 size={14} /> Delete Post
                                    </button>
                                ) : (
                                    <button className="post-dropdown-item" onClick={handleReport}>
                                        <AlertTriangle size={14} /> Report Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete confirmation modal */}
                {showDeleteConfirm && (
                    <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                            <Trash2 size={24} style={{ color: '#ef4444' }} />
                            <h4>Delete this post?</h4>
                            <p>This action cannot be undone.</p>
                            <div className="delete-confirm-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                <button className="btn-delete" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Location */}
                {post.location && (
                    <div className="post-location-row">
                        <MapPin size={11} />
                        {post.location.city || 'Unknown City'}, {post.location.state || 'Unknown State'}
                    </div>
                )}

                {/* Caption */}
                <p className="post-caption">{renderCaption(post.caption)}</p>

                {/* Image */}
                {post.image ? (
                    <div className="post-image-wrap">
                        <img className="post-image" src={post.image} alt="Post" loading="lazy" />
                    </div>
                ) : (
                    <div className="post-image-wrap">
                        <div className="post-image-placeholder">
                            <ImageOff size={28} />
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div className="post-tags">
                    <span className={`category-chip ${post.category}`}>
                        {getCategoryEmoji(post.category)} {post.category}
                    </span>
                    {post.risk && (
                        <RiskBadge
                            level={post.risk.level}
                            color={post.risk.color}
                            bgColor={post.risk.bgColor}
                            emoji={post.risk.emoji}
                        />
                    )}
                    {post.risk?.reason && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginLeft: 'auto' }}>
                            {post.risk.reason}
                        </span>
                    )}
                </div>

                {/* Credibility */}
                <FakeNewsIndicator fakeNews={post.fakeNews} />

                {/* Gemini Vision Image Verification */}
                {post.imageVerification && post.hasImage && (
                    <div className="impact-badge" style={{ marginTop: '8px', padding: '10px 12px', background: post.imageVerification.verified ? 'rgba(0, 200, 83, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: `1px solid ${post.imageVerification.verified ? 'rgba(0, 200, 83, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ color: post.imageVerification.verified ? 'var(--green)' : 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            {post.imageVerification.verified ? '📸' : '⚠️'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: post.imageVerification.verified ? 'var(--green)' : 'var(--amber)' }}>
                                {post.imageVerification.verified ? `Vision Verified • ${post.imageVerification.confidence}% Match` : 'Visual Mismatch'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{post.imageVerification.message}</span>
                        </div>
                    </div>
                )}

                {/* AI Suggestions */}
                <AISuggestionPanel suggestions={post.suggestions} />

                {/* AI Impact */}
                {post.impact && (
                    <div className="impact-badge" style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(0, 200, 83, 0.05)', border: '1px solid rgba(0, 200, 83, 0.2)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: 28, height: 28 }}>
                            <svg width="28" height="28" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="16" fill="none" stroke={post.impact.score > 70 ? 'var(--amber)' : 'var(--green)'} strokeWidth="3" strokeDasharray={`${(post.impact.score / 100) * 100}, 100`} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {post.impact.score}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)' }}>Eco-Impact Score</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{post.impact.description}</span>
                        </div>
                    </div>
                )}

                {/* Action row */}
                <div className="post-actions">
                    {/* Comment — toggles a placeholder comment area */}
                    <button
                        className="action-btn"
                        onClick={() => setShowComments(p => !p)}
                        title="Comments"
                        style={showComments ? { color: 'var(--green)' } : {}}
                    >
                        <MessageCircle size={17} fill={showComments ? 'currentColor' : 'none'} />
                        <span>{post.commentCount || 0}</span>
                    </button>

                    {/* Retweet */}
                    <button
                        className={`action-btn${retweeted ? ' retweeted' : ''}`}
                        onClick={handleRetweet}
                        title={retweeted ? 'Undo repost' : 'Repost'}
                        style={retweeted ? { color: '#00c853' } : {}}
                    >
                        <Repeat2 size={17} />
                        <span>{retweetCount}</span>
                    </button>

                    {/* Like */}
                    <button
                        className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(post.id)}
                        title={isLiked ? 'Unlike' : 'Like'}
                    >
                        <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likes}</span>
                    </button>

                    {/* Share */}
                    <button className="action-btn share-btn" onClick={handleShare} title="Copy link">
                        <Share2 size={17} />
                        {shared && <span>Copied!</span>}
                    </button>

                    {/* Flag */}
                    <button
                        className={`action-btn report-btn`}
                        onClick={handleFlag}
                        title={flagged ? 'Unflag report' : 'Flag as suspicious'}
                        style={{
                            marginLeft: 'auto',
                            color: flagged ? 'var(--amber)' : undefined,
                        }}
                    >
                        <Flag size={15} fill={flagged ? 'currentColor' : 'none'} />
                    </button>

                    {/* Bookmark */}
                    <button
                        className={`action-btn bookmark-btn`}
                        onClick={() => toggleBookmark(post.id)}
                        title={isBookmarked(post.id) ? 'Remove bookmark' : 'Save post'}
                        style={{
                            color: isBookmarked(post.id) ? 'var(--green-400)' : undefined,
                        }}
                    >
                        <Bookmark size={15} fill={isBookmarked(post.id) ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Comment Section */}
                {showComments && (
                    <CommentSection postId={post.id} />
                )}
            </div>
        </article>
    );
});

function getCategoryEmoji(cat) {
    const map = { Air: '💨', Water: '💧', Land: '🌍', Wildlife: '🐾', Climate: '🌡️', Disaster: '🚨' };
    return map[cat] || '🌿';
}

export default PostCard;
