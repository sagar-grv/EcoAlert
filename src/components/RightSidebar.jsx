import React from 'react';
import { Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function RightSidebar() {
    const { posts, searchQuery, setSearchQuery } = useApp();
    const navigate = useNavigate();

    const critical = posts.filter(p => p.risk?.level === 'Critical').slice(0, 3);
    const trending = [...posts]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    // Category counts
    const categories = ['Air', 'Water', 'Land', 'Wildlife', 'Climate', 'Disaster'];
    const catEmoji = { Air: '💨', Water: '💧', Land: '🌍', Wildlife: '🐾', Climate: '🌡️', Disaster: '🚨' };
    const catCounts = categories.map(cat => ({
        name: cat,
        emoji: catEmoji[cat],
        count: posts.filter(p => p.category === cat).length,
    })).sort((a, b) => b.count - a.count);

    return (
        <>
            {/* Search bar */}
            <div className="rs-search">
                <Search size={16} />
                <input
                    placeholder="Search EcoAlert"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Critical Alerts Widget */}
            {critical.length > 0 && (
                <div className="rs-widget">
                    <div className="rs-widget-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={16} style={{ color: '#f4212e' }} />
                        Critical Alerts
                    </div>
                    {critical.map(post => (
                        <div className="alert-item" key={post.id} onClick={() => navigate('/')}>
                            <div className="alert-dot" style={{ background: '#f4212e' }} />
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.35 }}>
                                    {post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: 2 }}>
                                    📍 {post.location.city}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Trending Widget */}
            <div className="rs-widget">
                <div className="rs-widget-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} style={{ color: 'var(--green)' }} />
                    Trending in Environment
                </div>
                {catCounts.map((cat, i) => (
                    <div className="trend-item" key={cat.name} onClick={() => navigate('/explore')}>
                        <div className="trend-info">
                            <div className="trend-category">Environment · Trending</div>
                            <div className="trend-name">{cat.emoji} {cat.name} Issues</div>
                            <div className="trend-count">{cat.count} report{cat.count !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="trend-rank">···</div>
                    </div>
                ))}
                <button className="rs-show-more" onClick={() => navigate('/explore')}>
                    Show more
                </button>
            </div>

            {/* Top Posts Widget */}
            <div className="rs-widget">
                <div className="rs-widget-title">🔥 Most Liked</div>
                {trending.slice(0, 3).map(post => (
                    <div className="trend-item" key={post.id} onClick={() => navigate('/')}>
                        <div className="trend-info">
                            <div className="trend-category">📍 {post.location.city}</div>
                            <div className="trend-name" style={{ fontSize: '0.85rem' }}>
                                {post.caption.slice(0, 55)}{post.caption.length > 55 ? '…' : ''}
                            </div>
                            <div className="trend-count">❤️ {post.likes} likes</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', lineHeight: 1.6, padding: '0 4px' }}>
                EcoAlert MVP · Environmental Awareness Platform
                <br />
                AI-powered risk detection · Location-based alerts
                <br />
                <span style={{ color: 'var(--green)' }}>🌿 Protecting the planet, one report at a time.</span>
            </div>
        </>
    );
}
