import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

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
                    <Sparkles size={13} /> AI Suggestions ({suggestions.length})
                </span>
                <ChevronDown size={14} />
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
