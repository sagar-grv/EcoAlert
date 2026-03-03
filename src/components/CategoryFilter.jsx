import React from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Air', 'Water', 'Land', 'Wildlife', 'Climate', 'Disaster'];
const RISKS = ['All', 'Critical', 'High', 'Medium', 'Low'];

const CATEGORY_META = {
    All: { emoji: '🌐', label: 'All' },
    Air: { emoji: '💨', label: 'Air' },
    Water: { emoji: '💧', label: 'Water' },
    Land: { emoji: '🌍', label: 'Land' },
    Wildlife: { emoji: '🐾', label: 'Wildlife' },
    Climate: { emoji: '🌡️', label: 'Climate' },
    Disaster: { emoji: '🚨', label: 'Disaster' },
};

const RISK_COLORS = {
    All: { color: 'var(--text-muted)', bg: 'var(--bg-card2)', border: 'var(--border)' },
    Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
    High: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
    Medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
    Low: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
};

export default function CategoryFilter() {
    const { activeCategory, setActiveCategory, activeRisk, setActiveRisk } = useApp();

    return (
        <div className="filter-bar-wrap">
            <div className="filter-bar">
                {CATEGORIES.map((cat) => {
                    const m = CATEGORY_META[cat];
                    return (
                        <button
                            key={cat}
                            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {m.emoji} {m.label}
                        </button>
                    );
                })}
            </div>
            <div className="risk-filter-bar">
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: 4 }}>
                    Risk:
                </span>
                {RISKS.map((r) => {
                    const s = RISK_COLORS[r];
                    const isActive = activeRisk === r;
                    return (
                        <button
                            key={r}
                            className="filter-pill"
                            style={isActive ? {
                                color: s.color,
                                background: s.bg,
                                borderColor: s.border,
                                fontWeight: 700,
                            } : {}}
                            onClick={() => setActiveRisk(r)}
                        >
                            {r}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
