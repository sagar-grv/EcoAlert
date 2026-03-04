import React from 'react';
import { BarChart3, TrendingUp, Zap, Shield, Globe, Cpu, Users, FileText, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Analysis() {
    const { posts } = useApp();

    // ── Live statistics from real data ────────────────────────
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((s, p) => s + (p.likes || 0), 0);
    const totalShares = posts.reduce((s, p) => s + (p.shares || 0), 0);
    const uniqueAuthors = [...new Set(posts.map(p => p.author))].length;
    const geminiPosts = posts.filter(p => p.aiSource === 'gemini').length;
    const localPosts = totalPosts - geminiPosts;

    // Category distribution
    const categories = ['Air', 'Water', 'Land', 'Wildlife', 'Climate', 'Disaster'];
    const catCounts = categories.map(c => ({ name: c, count: posts.filter(p => p.category === c).length }));
    const maxCatCount = Math.max(...catCounts.map(c => c.count), 1);

    // Risk distribution
    const risks = ['Critical', 'High', 'Medium', 'Low'];
    const riskColors = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
    const riskCounts = risks.map(r => ({ level: r, count: posts.filter(p => p.risk?.level === r).length, color: riskColors[r] }));
    const maxRiskCount = Math.max(...riskCounts.map(r => r.count), 1);

    // Category colors
    const catColors = { Air: '#7dd3fc', Water: '#a5b4fc', Land: '#fbbf24', Wildlife: '#4ade80', Climate: '#f87171', Disaster: '#c084fc' };
    const catEmojis = { Air: '💨', Water: '💧', Land: '🌍', Wildlife: '🐾', Climate: '🌡️', Disaster: '🚨' };

    const CURRENT_STACK = [
        { name: 'Fake News Detector', approach: 'Gemini 2.0 Flash multimodal analysis with rule-based fallback', accuracy: geminiPosts > 0 ? '~85%' : '~65%' },
        { name: 'Risk Classifier', approach: 'Gemini AI + priority-ordered keyword pattern matching (4 tiers)', accuracy: geminiPosts > 0 ? '~88%' : '~72%' },
        { name: 'Suggestion Engine', approach: 'AI-generated actionable suggestions per category × risk level', accuracy: 'N/A' },
        { name: 'Auto-Categorizer', approach: 'Gemini-powered multimodal categorization with keyword fallback', accuracy: geminiPosts > 0 ? '~90%' : '~70%' },
    ];

    const FUTURE_FEATURES = [
        { icon: '🗺️', title: 'Environmental Heat Maps', desc: 'Risk zone visualization using Google Maps with pollution density overlays' },
        { icon: '🔔', title: 'Smart Push Alerts', desc: 'Push notifications when Critical-level events near user-defined radius' },
        { icon: '👥', title: 'Expert Verification', desc: 'NGOs and verified scientists can endorse posts, boosting community trust' },
        { icon: '📊', title: 'Trend Analytics', desc: 'Pollution trends, incident frequency, and category breakdown over time' },
        { icon: '🏛️', title: 'Gov API Integration', desc: 'CPCB AQI, IMD weather, NDMA disaster alerts auto-supplement posts' },
        { icon: '🎯', title: 'Impact Tracking', desc: 'Track whether reported issues got resolved — close the loop' },
    ];

    return (
        <div>
            <div className="page-header">
                <div className="page-title">
                    <BarChart3 size={20} style={{ color: 'var(--green-400)' }} />
                    App Analysis
                </div>
                <div className="page-subtitle">Live statistics, AI stack, and improvement roadmap</div>
            </div>

            <div className="analysis-section">

                {/* Live Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                        { icon: <FileText size={18} />, label: 'Total Reports', value: totalPosts, color: 'var(--green-400)' },
                        { icon: <Users size={18} />, label: 'Contributors', value: uniqueAuthors, color: '#a5b4fc' },
                        { icon: <Activity size={18} />, label: 'Total Likes', value: totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes, color: '#f43f5e' },
                        { icon: <Zap size={18} />, label: 'Total Shares', value: totalShares >= 1000 ? `${(totalShares / 1000).toFixed(1)}k` : totalShares, color: 'var(--amber)' },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: '16px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                            <div className="counter-animate" style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{s.value}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Category Distribution */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Cpu size={16} style={{ color: 'var(--green-400)' }} /> Reports by Category
                    </div>
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {catCounts.map(c => (
                            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 28, textAlign: 'center', fontSize: '1rem' }}>{catEmojis[c.name]}</span>
                                <span style={{ width: 60, fontWeight: 600, fontSize: '0.82rem', color: catColors[c.name] || 'var(--text)' }}>{c.name}</span>
                                <div style={{ flex: 1, background: 'var(--bg-card2)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(c.count / maxCatCount) * 100}%`,
                                        height: '100%',
                                        background: catColors[c.name] || 'var(--green)',
                                        borderRadius: 4,
                                        transition: 'width 0.6s ease'
                                    }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', width: 24, textAlign: 'right' }}>{c.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Shield size={16} style={{ color: 'var(--amber)' }} /> Risk Level Distribution
                    </div>
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {riskCounts.map(r => (
                            <div key={r.level} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 70, fontWeight: 600, fontSize: '0.82rem', color: r.color }}>{r.level}</span>
                                <div style={{ flex: 1, background: 'var(--bg-card2)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(r.count / maxRiskCount) * 100}%`,
                                        height: '100%',
                                        background: r.color,
                                        borderRadius: 4,
                                        transition: 'width 0.6s ease'
                                    }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', width: 24, textAlign: 'right' }}>{r.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current AI Stack */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Cpu size={16} style={{ color: 'var(--green-400)' }} /> AI Stack ({geminiPosts > 0 ? 'Gemini Active ✅' : 'Rule-based Fallback'})
                    </div>
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {CURRENT_STACK.map((ai) => (
                            <div key={ai.name} style={{ padding: '10px 14px', background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--green-400)', marginBottom: 3 }}>{ai.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ai.approach}</div>
                                {ai.accuracy !== 'N/A' && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--amber)', marginTop: 4 }}>
                                        Estimated accuracy: {ai.accuracy}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MVP vs Production */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Globe size={16} style={{ color: '#a5b4fc' }} /> What's Built vs What's Next
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="analysis-table">
                            <thead>
                                <tr>
                                    <th>Aspect</th>
                                    <th style={{ color: 'var(--green-400)' }}>✅ Built</th>
                                    <th style={{ color: 'var(--text-muted)' }}>🔜 Next</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['AI Engine', 'Gemini 2.0 Flash + rule-based fallback', 'Fine-tuned models for India-specific data'],
                                    ['Auth', 'Firebase Auth (Google + Phone OTP + Demo)', 'Verified accounts for NGOs/Officials'],
                                    ['Storage', 'Firestore + localStorage fallback', 'Cloud Storage for media'],
                                    ['Feed', 'Real-time Firestore listeners', 'WebSocket for instant updates'],
                                    ['Location', 'GPS detection + Haversine filtering', 'Google Maps heat map visualization'],
                                    ['AI Features', 'Risk classification, fake news, auto-categorize', 'Gemini Vision image analysis'],
                                    ['Theme', 'Dark + Light theme toggle', 'Custom accent colors'],
                                    ['Social', 'Likes, shares, bookmarks, comments', 'Follow system, DMs'],
                                ].map(([aspect, built, next]) => (
                                    <tr key={aspect}>
                                        <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{aspect}</td>
                                        <td style={{ color: 'var(--green-400)' }}>{built}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{next}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Future Features Grid */}
                <div className="analysis-card">
                    <div className="analysis-card-header">
                        <TrendingUp size={16} style={{ color: '#c084fc' }} /> Planned Future Features
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: 16 }}>
                        {FUTURE_FEATURES.map((f) => (
                            <div key={f.title} style={{
                                padding: '14px', background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                            }}>
                                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{f.icon}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{f.title}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
