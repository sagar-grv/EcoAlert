import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function FakeNewsIndicator({ fakeNews }) {
    if (!fakeNews) return null;
    const { score, label, color } = fakeNews;

    return (
        <div className="credibility-bar-wrap">
            <div className="credibility-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={12} style={{ color }} />
                    <span style={{ color, fontWeight: 600 }} className="credibility-label">{label}</span>
                </span>
                <span>Credibility: <strong style={{ color }}>{score}%</strong></span>
            </div>
            <div className="credibility-track">
                <div
                    className="credibility-fill"
                    style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
                />
            </div>
        </div>
    );
}
