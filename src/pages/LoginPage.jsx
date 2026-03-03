import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, Leaf, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { LANGUAGES } from '../i18n/translations';

export default function LoginPage() {
    const { login } = useAuth();
    const { t, lang, setLang } = useLang();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) { setErr('Please enter your name.'); return; }
        if (!phone.trim() || phone.trim().length < 6) { setErr('Please enter a valid phone number.'); return; }
        setLoading(true);
        setTimeout(() => {
            login({ name: name.trim(), phone: phone.trim(), lang });
            navigate('/');
        }, 800);
    }

    function handleGoogle() {
        setLoading(true);
        const mockNames = ['Priya Sharma', 'Rahul Verma', 'Anjali Rao', 'Vikram Singh', 'Meera Pillai'];
        const n = mockNames[Math.floor(Math.random() * mockNames.length)];
        setTimeout(() => {
            login({ name: n, phone: '9900000000', lang });
            navigate('/');
        }, 600);
    }

    return (
        <div className="auth-page">
            {/* Background blobs */}
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">🌿</div>
                    <div>
                        <div className="auth-logo-name">EcoAlert</div>
                        <div className="auth-logo-tag">{t('appTagline')}</div>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="auth-lang-row">
                    <Globe size={14} style={{ color: 'var(--text-sub)' }} />
                    <select
                        className="auth-lang-select"
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>
                                {l.flag} {l.native}
                            </option>
                        ))}
                    </select>
                </div>

                <h1 className="auth-title">{t('login')}</h1>
                <p className="auth-demo-hint">
                    ✨ {t('demoHint')}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <User size={16} className="auth-field-icon" />
                        <input
                            className="auth-input"
                            type="text"
                            placeholder={t('enterName')}
                            value={name}
                            onChange={e => { setName(e.target.value); setErr(''); }}
                            autoComplete="name"
                        />
                    </div>
                    <div className="auth-field">
                        <Phone size={16} className="auth-field-icon" />
                        <input
                            className="auth-input"
                            type="tel"
                            placeholder={t('enterPhone')}
                            value={phone}
                            onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErr(''); }}
                            maxLength={10}
                            autoComplete="tel"
                        />
                    </div>
                    {err && <div className="auth-error">{err}</div>}
                    <button
                        type="submit"
                        className="btn-primary btn-full"
                        disabled={loading}
                        style={{ marginTop: 4 }}
                    >
                        {loading
                            ? <span className="spinning" style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                            : <><span>{t('continueBtn')}</span><ArrowRight size={16} /></>
                        }
                    </button>
                </form>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-line" />
                    <span className="auth-divider-text">{t('orContinueWith')}</span>
                    <span className="auth-divider-line" />
                </div>

                {/* Google button */}
                <button className="btn-google btn-full" onClick={handleGoogle} disabled={loading}>
                    <svg className="btn-google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('googleSignIn')}
                </button>

                <p className="auth-switch">
                    {t('noAccount')}{' '}
                    <button className="auth-link" onClick={() => navigate('/signup')}>
                        {t('signup')}
                    </button>
                </p>
            </div>
        </div>
    );
}
