import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, Leaf, Globe, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { LANGUAGES } from '../i18n/translations';
import { FIREBASE_ENABLED } from '../firebase';
import { RecaptchaVerifier } from '../firebase';
import { auth } from '../firebase';

export default function LoginPage() {
    const { login, loginWithGoogle, sendOTP, verifyOTP, authError } = useAuth();
    const { t, lang, setLang } = useLang();
    const navigate = useNavigate();

    // Mode: 'phone' | 'otp'
    const [mode, setMode] = useState('phone');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const recaptchaRef = useRef(null);

    useEffect(() => {
        setErr(authError);
    }, [authError]);

    // ── Google Sign-In ─────────────────────────────────────
    async function handleGoogle() {
        setLoading(true); setErr('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (e) {
            setErr(e.message || 'Google sign-in failed');
        } finally { setLoading(false); }
    }

    // ── Demo / Phone form submit ───────────────────────────
    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        if (!name.trim()) { setErr('Please enter your name.'); return; }
        if (!phone.trim() || phone.trim().length < 6) { setErr('Please enter a valid phone number.'); return; }

        if (!FIREBASE_ENABLED) {
            // Demo mode: instant login
            setLoading(true);
            setTimeout(() => { login({ name: name.trim(), phone: phone.trim(), lang }); navigate('/'); }, 600);
            return;
        }

        // Firebase Phone OTP
        setLoading(true);
        try {
            if (!recaptchaRef.current) {
                recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => { },
                });
            }
            const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
            const conf = await sendOTP(fullPhone, recaptchaRef.current);
            setConfirmation(conf);
            setMode('otp');
        } catch (e) {
            setErr(e.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    }

    // ── Verify OTP ─────────────────────────────────────────
    async function handleVerifyOTP(e) {
        e.preventDefault();
        if (!otp || otp.length < 6) { setErr('Enter the 6-digit OTP'); return; }
        setLoading(true); setErr('');
        try {
            await verifyOTP(confirmation, otp, name);
            navigate('/');
        } catch (e) {
            setErr('Invalid OTP. Please try again.');
        } finally { setLoading(false); }
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

                {/* Language Selector */}
                <div className="auth-lang-row">
                    <Globe size={14} style={{ color: 'var(--text-sub)' }} />
                    <select className="auth-lang-select" value={lang} onChange={e => setLang(e.target.value)}>
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.flag} {l.native}</option>
                        ))}
                    </select>
                </div>

                {/* Firebase badge */}
                {FIREBASE_ENABLED && (
                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--green)', background: 'var(--green-glow)', padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>
                            🔒 Secured by Firebase
                        </span>
                    </div>
                )}

                <h1 className="auth-title">{t('login')}</h1>
                <p className="auth-demo-hint">
                    {FIREBASE_ENABLED ? '🔐 Sign in with Google or your phone number' : `✨ ${t('demoHint')}`}
                </p>

                {/* Phone + Name form OR OTP form */}
                {mode === 'phone' ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <User size={16} className="auth-field-icon" />
                            <input className="auth-input" type="text" placeholder={t('enterName')}
                                value={name} onChange={e => { setName(e.target.value); setErr(''); }} autoComplete="name" />
                        </div>
                        <div className="auth-field">
                            <Phone size={16} className="auth-field-icon" />
                            <input className="auth-input" type="tel"
                                placeholder={FIREBASE_ENABLED ? '+91 Phone number' : t('enterPhone')}
                                value={phone} onChange={e => { setPhone(e.target.value.replace(/[^\d+]/g, '')); setErr(''); }}
                                maxLength={13} autoComplete="tel" />
                        </div>
                        {err && <div className="auth-error">{err}</div>}
                        <button type="submit" className="btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
                            {loading
                                ? <span className="spinning" style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                                : <><span>{FIREBASE_ENABLED ? 'Send OTP' : t('continueBtn')}</span><ArrowRight size={16} /></>
                            }
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleVerifyOTP}>
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-sub)', margin: '0 0 12px' }}>
                            OTP sent to <strong>{phone}</strong>
                        </p>
                        <div className="auth-field">
                            <KeyRound size={16} className="auth-field-icon" />
                            <input className="auth-input" type="number" placeholder="Enter 6-digit OTP"
                                value={otp} onChange={e => { setOtp(e.target.value); setErr(''); }}
                                maxLength={6} autoFocus />
                        </div>
                        {err && <div className="auth-error">{err}</div>}
                        <button type="submit" className="btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
                            {loading
                                ? <span className="spinning" style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                                : <><span>Verify OTP</span><ArrowRight size={16} /></>
                            }
                        </button>
                        <button type="button" className="auth-link" style={{ marginTop: 8, display: 'block', textAlign: 'center', width: '100%' }}
                            onClick={() => { setMode('phone'); setOtp(''); setErr(''); }}>
                            ← Change number
                        </button>
                    </form>
                )}

                {/* Recaptcha container (invisible) */}
                <div id="recaptcha-container" />

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
                    <button className="auth-link" onClick={() => navigate('/signup')}>{t('signup')}</button>
                </p>
            </div>
        </div>
    );
}
