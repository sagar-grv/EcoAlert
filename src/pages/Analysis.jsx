import React from 'react';
import { BarChart3, TrendingUp, Zap, Shield, Globe, Cpu } from 'lucide-react';

const LIMITATIONS = [
    {
        area: 'AI Intelligence',
        current: 'Rule-based keyword matching for risk & fake news detection',
        impact: 'High',
        improvement: 'Integrate Google Gemini Vision API for multimodal analysis — analyze both image content and text simultaneously for far more accurate results',
        effort: 'Medium',
    },
    {
        area: 'Backend & Data',
        current: 'localStorage only — data disappears on browser clear',
        impact: 'High',
        improvement: 'Firebase Firestore for real-time sync across devices + Cloud Storage for images. Add Firebase Auth for proper user accounts.',
        effort: 'Medium',
    },
    {
        area: 'Location System',
        current: 'Mock lat/lng coordinates — no real mapping or address resolution',
        impact: 'High',
        improvement: 'Integrate Google Maps Platform: Places API for address autocomplete, Maps JavaScript API for heat maps of risk zones',
        effort: 'Medium',
    },
    {
        area: 'Fake News Detection',
        current: 'Keyword scoring only — easily fooled by well-written false claims',
        impact: 'High',
        improvement: 'Cross-reference with verified news APIs (NewsAPI, GDELT), reverse image search, and Gemini LLM fact-checking pipeline',
        effort: 'High',
    },
    {
        area: 'Real-time Feed',
        current: 'Static feed — no live updates when others post',
        impact: 'Medium',
        improvement: 'Firebase Realtime Database or Firestore listeners for live post streaming. Add WebPush notifications for Critical alerts near user.',
        effort: 'Low',
    },
    {
        area: 'Image Moderation',
        current: 'No content moderation — any image can be uploaded',
        impact: 'Medium',
        improvement: 'Google Cloud Vision API Safe Search to filter inappropriate images before they enter the feed',
        effort: 'Low',
    },
    {
        area: 'User Trust System',
        current: 'All users have equal weight in the system',
        impact: 'Medium',
        improvement: 'Reputation scoring: verified accounts (NGOs, officials) get higher credibility multiplier. Community upvoting system for post credibility.',
        effort: 'Medium',
    },
    {
        area: 'Offline Support',
        current: 'Requires internet — no offline post drafting',
        impact: 'Low',
        improvement: 'Progressive Web App (PWA) with Service Workers for offline post drafting. Sync when back online.',
        effort: 'Low',
    },
];

const FUTURE_FEATURES = [
    { icon: '🗺️', title: 'Environmental Heat Maps', desc: 'Real-time risk zone visualization using Google Maps with color-coded pollution density overlays' },
    { icon: '🤖', title: 'Gemini Vision Analysis', desc: 'Upload image → AI describes the environmental problem, estimates severity, and cross-checks with satellite data' },
    { icon: '🔔', title: 'Smart Alert System', desc: 'Push notifications when Critical-level events are detected within user-defined radius' },
    { icon: '👥', title: 'Expert Verification', desc: 'NGOs and verified scientists can endorse posts, boosting community trust and policy action' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Historical trend analysis — pollution levels, incident frequency, category breakdown by region over time' },
    { icon: '🏛️', title: 'Government API Integration', desc: 'CPCB AQI data, IMD weather, NDMA disaster alerts — auto-supplement posts with official government readings' },
    { icon: '🌐', title: 'Multi-language Support', desc: 'India has 22 official languages — regional language UI dramatically increases rural adoption' },
    { icon: '🎯', title: 'Impact Tracking', desc: 'Track whether reported issues got resolved — close the loop between citizen reporting and government action' },
];

const IMPACT_COLOR = { High: '#ef4444', Medium: '#eab308', Low: '#22c55e' };
const IMPACT_BG = { High: 'rgba(239,68,68,0.1)', Medium: 'rgba(234,179,8,0.1)', Low: 'rgba(34,197,94,0.1)' };

export default function Analysis() {
    return (
        <div>
            <div className="page-header">
                <div className="page-title">
                    <BarChart3 size={20} style={{ color: 'var(--green-400)' }} />
                    App Analysis
                </div>
                <div className="page-subtitle">Current limitations, improvement roadmap, and future vision</div>
            </div>

            <div className="analysis-section">

                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                        { icon: <Cpu size={18} />, label: 'AI Features', value: '3 Active', color: 'var(--green-400)' },
                        { icon: <Shield size={18} />, label: 'Limitations', value: `${LIMITATIONS.length} Identified`, color: 'var(--amber)' },
                        { icon: <TrendingUp size={18} />, label: 'Future Features', value: `${FUTURE_FEATURES.length} Planned`, color: '#a5b4fc' },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Current AI Stack */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Cpu size={16} style={{ color: 'var(--green-400)' }} /> Current AI Stack (MVP)
                    </div>
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { name: 'Fake News Detector', approach: 'Keyword frequency scoring + image presence bonus', accuracy: '~65%' },
                            { name: 'Risk Classifier', approach: 'Priority-ordered keyword pattern matching (4 tiers)', accuracy: '~72%' },
                            { name: 'Suggestion Engine', approach: 'Category × Risk level lookup table (India-specific)', accuracy: 'N/A' },
                        ].map((ai) => (
                            <div key={ai.name} style={{ padding: '10px 14px', background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--green-400)', marginBottom: 3 }}>{ai.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ai.approach}</div>
                                {ai.accuracy !== 'N/A' && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--amber)', marginTop: 4 }}>
                                        Estimated accuracy: {ai.accuracy} (prototype)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Limitations Table */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Shield size={16} style={{ color: 'var(--amber)' }} /> Current Limitations & Fix Path
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="analysis-table">
                            <thead>
                                <tr>
                                    <th>Feature Area</th>
                                    <th>Current MVP</th>
                                    <th>Impact</th>
                                    <th>Improvement Path</th>
                                    <th>Effort</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LIMITATIONS.map((row) => (
                                    <tr key={row.area}>
                                        <td style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{row.area}</td>
                                        <td style={{ color: 'var(--text-muted)', maxWidth: 160 }}>{row.current}</td>
                                        <td>
                                            <span
                                                className="tag-chip"
                                                style={{ background: IMPACT_BG[row.impact], color: IMPACT_COLOR[row.impact] }}
                                            >
                                                {row.impact}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: 260 }}>{row.improvement}</td>
                                        <td>
                                            <span className={`tag-chip ${row.effort === 'High' ? 'high' : row.effort === 'Medium' ? 'med' : 'low'}`}>
                                                {row.effort}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MVP vs Full */}
                <div className="analysis-card" style={{ marginBottom: 16 }}>
                    <div className="analysis-card-header">
                        <Globe size={16} style={{ color: '#a5b4fc' }} /> MVP vs Production Comparison
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="analysis-table">
                            <thead>
                                <tr>
                                    <th>Aspect</th>
                                    <th style={{ color: 'var(--amber)' }}>This MVP</th>
                                    <th style={{ color: 'var(--green-400)' }}>Production Version</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['AI Engine', 'Rule-based keywords', 'Gemini Vision + NLP models'],
                                    ['Storage', 'localStorage (browser)', 'Firebase Firestore + Cloud Storage'],
                                    ['Auth', 'Mock user', 'Firebase Auth (Google, Phone OTP)'],
                                    ['Location', 'Manual city selection', 'Real-time GPS + Google Maps Places'],
                                    ['Feed', 'Static load', 'Live real-time stream'],
                                    ['Notifications', 'None', 'FCM push notifications'],
                                    ['Image Moderation', 'None', 'Cloud Vision Safe Search'],
                                    ['Scale', 'Single browser', 'Thousands of concurrent users'],
                                ].map(([aspect, mvp, prod]) => (
                                    <tr key={aspect}>
                                        <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{aspect}</td>
                                        <td style={{ color: 'var(--amber)' }}>{mvp}</td>
                                        <td style={{ color: 'var(--green-400)' }}>{prod}</td>
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
