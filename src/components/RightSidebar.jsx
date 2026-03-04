import React from 'react';
import { Search, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function RightSidebar() {
    const { posts, searchQuery, setSearchQuery } = useApp();
    const navigate = useNavigate();

    const critical = posts.filter(p => p.risk?.level === 'Critical').slice(0, 3);
    const trending = [...posts]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    // Hashtag extraction for trending
    const hashtagCounts = {};
    posts.forEach(p => {
        if (!p.caption) return;
        const matches = p.caption.match(/#\w+/g);
        if (matches) {
            matches.forEach(tag => {
                const lowerTag = tag.toLowerCase();
                hashtagCounts[lowerTag] = (hashtagCounts[lowerTag] || 0) + 1;
            });
        }
    });

    const trendingTags = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

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
                                    📍 {post.location?.city || 'Unknown'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Top Posts Widget */}
            <div className="rs-widget">
                <div className="rs-widget-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} style={{ color: 'var(--green)' }} />
                    Trending Hashtags
                </div>
                {trendingTags.length > 0 ? trendingTags.map((trend, i) => (
                    <div className="trend-item" key={trend.tag} onClick={() => setSearchQuery(trend.tag)}>
                        <div className="trend-info">
                            <div className="trend-category">Environment · Trending</div>
                            <div className="trend-name" style={{ color: 'var(--text-main)', fontWeight: 600 }}>{trend.tag}</div>
                            <div className="trend-count">{trend.count} post{trend.count !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="trend-rank">···</div>
                    </div>
                )) : (
                    <div style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                        No trending hashtags yet.
                    </div>
                )}
                <button className="rs-show-more" onClick={() => navigate('/explore')}>
                    Show more
                </button>
            </div>

            {/* Eco-Leaderboard Widget */}
            <div className="rs-widget">
                <div className="rs-widget-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={16} style={{ color: 'var(--amber)' }} fill="var(--amber)" />
                    Top Eco-Warriors
                </div>
                {(() => {
                    // Compute leaderboard from actual post data
                    const authorStats = {};
                    posts.forEach(p => {
                        const name = p.author || 'Anonymous';
                        if (!authorStats[name]) authorStats[name] = { name, points: 0, posts: 0 };
                        authorStats[name].points += (p.likes || 0) * 10 + (p.shares || 0) * 5 + 50; // 50 per post
                        authorStats[name].posts += 1;
                    });
                    const topUsers = Object.values(authorStats)
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 3)
                        .map(u => ({
                            ...u,
                            badge: u.points >= 1000 ? 'Veteran' : u.points >= 500 ? 'Activist' : 'Reporter'
                        }));
                    return topUsers.length > 0 ? topUsers.map((u, i) => (
                        <div className="trend-item" key={u.name} style={{ cursor: 'pointer' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)' }}>
                                {i + 1}
                            </div>
                            <div className="trend-info" style={{ marginLeft: 10 }}>
                                <div className="trend-name" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.name}</div>
                                <div className="trend-count">{u.points} Impact Points · {u.badge}</div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                            No activity yet.
                        </div>
                    );
                })()}
            </div>

            {/* Top Posts Widget */}
            <div className="rs-widget">
                <div className="rs-widget-title">🔥 Most Liked Reports</div>
                {trending.slice(0, 3).map(post => (
                    <div className="trend-item" key={post.id} onClick={() => navigate('/')}>
                        <div className="trend-info">
                            <div className="trend-category">📍 {post.location?.city || 'Unknown'}</div>
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
