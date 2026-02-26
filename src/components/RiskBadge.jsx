import React from 'react';

export default function RiskBadge({ level, color, bgColor, emoji }) {
    const isPulse = level === 'Critical' || level === 'High';
    return (
        <span
            className={`risk-badge ${isPulse ? 'pulse' : ''}`}
            style={{ color, backgroundColor: bgColor, borderColor: color + '55' }}
        >
            {emoji} {level}
        </span>
    );
}
