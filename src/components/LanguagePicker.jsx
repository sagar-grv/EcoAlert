import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LangContext';

export default function LanguagePicker() {
    const { lang, setLang, LANGUAGES } = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="lang-picker" ref={ref}>
            <button className="lang-picker-btn" onClick={() => setOpen(o => !o)}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>language</span>
                <span className="lang-picker-name">{current.native}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '13px', opacity: 0.6, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>expand_more</span>
            </button>

            {open && (
                <div className="lang-picker-dropdown">
                    {LANGUAGES.map(l => (
                        <button
                            key={l.code}
                            className={`lang-picker-option ${lang === l.code ? 'active' : ''}`}
                            onClick={() => { setLang(l.code); setOpen(false); }}
                        >
                            <span className="lang-flag">{l.flag}</span>
                            <span className="lang-native">{l.native}</span>
                            <span className="lang-english">{l.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
