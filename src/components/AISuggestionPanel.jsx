import React, { useState } from 'react';

export default function AISuggestionPanel({ suggestions = [] }) {
    const [open, setOpen] = useState(false);

    if (!suggestions.length) return null;

    return (
        <div className="suggestion-panel">
            <button
                className={`suggestion-toggle ${open ? 'open' : ''}`}
                onClick={() => setOpen((o) => !o)}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>auto_awesome</span> AI Suggestions ({suggestions.length})
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>expand_more</span>
            </button>
            {open && (
                <ul className="suggestions-list" style={{ listStyle: 'none' }}>
                    {suggestions.map((s, i) => (
                        <li key={i} className="suggestion-item">{s}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
