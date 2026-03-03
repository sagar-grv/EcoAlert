import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { LANGUAGES } from '../i18n/translations';

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
];

export default function SignupPage() {
    const { login } = useAuth();
    const { t, lang, setLang } = useLang();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState('');
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
        }, 900);
    }

    return (
        <div className="auth-page">
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

                {/* Language */}
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

                <h1 className="auth-title">{t('signup')}</h1>
                <p className="auth-demo-hint">✨ {t('demoHint')}</p>

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

                    {/* State selector */}
                    <div className="auth-field">
                        <span style={{ fontSize: '1rem', marginLeft: 2 }}>🗺️</span>
                        <select
                            className="auth-input"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            style={{ paddingLeft: 8 }}
                        >
                            <option value="">Select your State (optional)</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
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

                <p className="auth-switch">
                    {t('hasAccount')}{' '}
                    <button className="auth-link" onClick={() => navigate('/login')}>
                        {t('login')}
                    </button>
                </p>
            </div>
        </div>
    );
}
