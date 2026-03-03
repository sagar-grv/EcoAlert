import React, { useState } from 'react';
import { Heart, Repeat2, Share2, Flag, MapPin, ImageOff, MessageCircle } from 'lucide-react';
import RiskBadge from './RiskBadge';
import FakeNewsIndicator from './FakeNewsIndicator';
import AISuggestionPanel from './AISuggestionPanel';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/helpers';

export default function PostCard({ post }) {
    const { toggleLike } = useApp();
    const [shared, setShared] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post.shares || 0);
    const [flagged, setFlagged] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const handleShare = () => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`EcoAlert: ${post.caption} — ${post.location.city}`);
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

    const handle = '@' + post.author.toLowerCase().replace(/\s+/g, '_');

    return (
        <article className="post-card">
            {/* Avatar column */}
            <div className="post-avatar-col">
                <img className="post-avatar" src={post.avatar} alt={post.author} />
            </div>

            {/* Main body */}
            <div className="post-body">
                {/* Header row: name · handle · time */}
                <div className="post-header-row">
                    <span className="post-author">{post.author}</span>
                    <span className="post-handle">{handle}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time">{formatTime(post.timestamp)}</span>
                </div>

                {/* Location */}
                <div className="post-location-row">
                    <MapPin size={11} />
                    {post.location.city}, {post.location.state}
                </div>

                {/* Caption */}
                <p className="post-caption">{post.caption}</p>

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

                {/* AI Suggestions */}
                <AISuggestionPanel suggestions={post.suggestions} />

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
                        <span>{Math.floor((post.likes || 0) * 0.3)}</span>
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
                        className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
                        onClick={() => toggleLike(post.id)}
                        title={post.liked ? 'Unlike' : 'Like'}
                    >
                        <Heart size={17} fill={post.liked ? 'currentColor' : 'none'} />
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
                </div>

                {/* Inline comment placeholder */}
                {showComments && (
                    <div style={{
                        marginTop: 8,
                        padding: '10px 12px',
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.82rem',
                        color: 'var(--text-sub)',
                    }}>
                        💬 Comments coming soon — stay tuned!
                    </div>
                )}
            </div>
        </article>
    );
}

function getCategoryEmoji(cat) {
    const map = { Air: '💨', Water: '💧', Land: '🌍', Wildlife: '🐾', Climate: '🌡️', Disaster: '🚨' };
    return map[cat] || '🌿';
}
