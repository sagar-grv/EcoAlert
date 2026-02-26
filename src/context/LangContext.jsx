// ─── Language / i18n Context ──────────────────────────────
// Static translations are used instantly; MyMemory fills gaps dynamically.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../i18n/translations';
import { translateText } from '../services/translateService';
import { useAuth } from './AuthContext';

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const { user, updateLang } = useAuth();
    const [lang, setLangState] = useState(() => {
        return localStorage.getItem('ecoalert_lang') || user?.lang || 'en';
    });

    // Dynamic translation overrides — loaded async from MyMemory
    const [dynamicStrings, setDynamicStrings] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (user?.lang && user.lang !== lang) setLangState(user.lang);
    }, [user?.lang]);

    /* When language changes (for non-EN), pre-fetch any keys not in static dict */
    useEffect(() => {
        if (lang === 'en') { setDynamicStrings({}); return; }
        const staticDict = TRANSLATIONS[lang];
        if (staticDict) { setDynamicStrings({}); return; } // all covered statically

        // Language not in static dict — translate all English strings via MyMemory
        const englishStrings = TRANSLATIONS['en'];
        setIsTranslating(true);
        const entries = Object.entries(englishStrings);

        Promise.all(
            entries.map(([key, value]) =>
                translateText(value, lang).then(translated => [key, translated])
            )
        ).then(results => {
            const map = Object.fromEntries(results);
            setDynamicStrings(map);
            setIsTranslating(false);
        }).catch(() => {
            setIsTranslating(false);
        });
    }, [lang]);

    function setLang(code) {
        setLangState(code);
        localStorage.setItem('ecoalert_lang', code);
        if (updateLang) updateLang(code);
    }

    /* Sync lookup — static dict first, dynamic override second, English fallback */
    function t(key) {
        const staticDict = TRANSLATIONS[lang] || {};
        return staticDict[key] || dynamicStrings[key] || TRANSLATIONS['en'][key] || key;
    }

    /* Async translate any arbitrary text (for post captions, etc.) */
    const tAsync = useCallback(async (text) => {
        if (lang === 'en' || !text) return text;
        return translateText(text, lang);
    }, [lang]);

    return (
        <LangContext.Provider value={{ lang, setLang, t, tAsync, isTranslating, LANGUAGES }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLang must be inside LangProvider');
    return ctx;
}
