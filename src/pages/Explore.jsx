import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import RiskBadge from '../components/RiskBadge';

const CATEGORY_META = {
    Air: { emoji: '💨', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', color: '#7dd3fc' },
    Water: { emoji: '💧', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', color: '#a5b4fc' },
    Land: { emoji: '🌍', bg: 'rgba(161,98,7,0.08)', border: 'rgba(161,98,7,0.2)', color: '#fbbf24' },
    Wildlife: { emoji: '🐾', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#4ade80' },
    Climate: { emoji: '🌡️', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#f87171' },
    Disaster: { emoji: '🚨', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', color: '#c084fc' },
};

const CATEGORIES = Object.keys(CATEGORY_META);

export default function Explore() {
    const { posts } = useApp();
    const [selectedCat, setSelectedCat] = useState(null);

    const byCategory = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = posts.filter((p) => p.category === cat);
        return acc;
    }, {});

    const getRiskSummary = (catPosts) => {
        const levels = ['Critical', 'High', 'Medium', 'Low'];
        return levels
            .map((l) => ({ level: l, count: catPosts.filter((p) => p.risk?.level === l).length }))
            .filter((r) => r.count > 0)
            .slice(0, 2);
    };

    if (selectedCat) {
        const catPosts = byCategory[selectedCat] || [];
        const meta = CATEGORY_META[selectedCat];
        return (
            <div>
                <div className="page-header">
                    <button
                        onClick={() => setSelectedCat(null)}
                        className="back-btn"
                    >
                        ← Back
                    </button>
                    <div>
                        <div className="page-title">{meta.emoji} {selectedCat}</div>
                        <div className="page-subtitle">{catPosts.length} reports</div>
                    </div>
                </div>
                {catPosts.length === 0 ? (
                    <div className="empty-state">
                        <span style={{ fontSize: '3rem' }}>{meta.emoji}</span>
                        <h3>No {selectedCat} reports yet</h3>
                        <p>Be the first to report a {selectedCat.toLowerCase()} issue in your area!</p>
                    </div>
                ) : (
                    catPosts.map((post) => <PostCard key={post.id} post={post} />)
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Explore</div>
                    <div className="page-subtitle">Browse environmental issues by category</div>
                </div>
                <Compass size={18} style={{ color: 'var(--green)', marginLeft: 'auto' }} />
            </div>

            <div className="category-grid">
                {CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const catPosts = byCategory[cat];
                    const riskSummary = getRiskSummary(catPosts);
                    const riskMeta = {
                        Critical: { color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)', emoji: '⛔' },
                        High: { color: '#f97316', bgColor: 'rgba(249,115,22,0.15)', emoji: '🔴' },
                        Medium: { color: '#eab308', bgColor: 'rgba(234,179,8,0.15)', emoji: '🟡' },
                        Low: { color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)', emoji: '🟢' },
                    };

                    return (
                        <div
                            key={cat}
                            className="category-card"
                            style={{ background: meta.bg, borderColor: meta.border }}
                            onClick={() => setSelectedCat(cat)}
                        >
                            <div className="category-card-icon">{meta.emoji}</div>
                            <div className="category-card-name" style={{ color: meta.color }}>{cat}</div>
                            <div className="category-card-count">{catPosts.length} report{catPosts.length !== 1 ? 's' : ''}</div>
                            <div className="category-card-risk">
                                {riskSummary.map(({ level, count }) => {
                                    const rm = riskMeta[level];
                                    return (
                                        <span key={level}>
                                            <RiskBadge level={level} color={rm.color} bgColor={rm.bgColor} emoji={rm.emoji} />
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 3 }}>×{count}</span>
                                        </span>
                                    );
                                })}
                                {riskSummary.length === 0 && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No reports yet</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
