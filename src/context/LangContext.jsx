// ─── Language / i18n Context ──────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../i18n/translations';
import { useAuth } from './AuthContext';

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const { user, updateLang } = useAuth();
    const [lang, setLangState] = useState(() => {
        return localStorage.getItem('ecoalert_lang') || user?.lang || 'en';
    });

    useEffect(() => {
        if (user?.lang && user.lang !== lang) {
            setLangState(user.lang);
        }
    }, [user?.lang, lang]);

    function setLang(code) {
        setLangState(code);
        localStorage.setItem('ecoalert_lang', code);
        if (updateLang) updateLang(code);
    }

    function t(key) {
        const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
        return dict[key] || TRANSLATIONS['en'][key] || key;
    }

    return (
        <LangContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLang must be inside LangProvider');
    return ctx;
}
