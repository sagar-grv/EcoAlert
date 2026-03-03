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
        <div className="auth-page" style={{
            background: '#07070a',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-card premium-glass" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '32px' }}>
                {/* Logo */}
                <div className="auth-logo" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
                    <div className="auth-logo-icon" style={{
                        width: '40px', height: '40px', borderRadius: '12px', background: 'var(--green)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                        boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)'
                    }}>🌿</div>
                    <div style={{ marginLeft: '12px' }}>
                        <div className="auth-logo-name" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>EcoAlert</div>
                        <div className="auth-logo-tag" style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t('appTagline')}</div>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="auth-lang-row" style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                    <Globe size={18} style={{ color: 'var(--text-sub)' }} />
                    <select className="auth-lang-select" value={lang} onChange={e => setLang(e.target.value)} style={{ opacity: 0, position: 'absolute', width: '20px', cursor: 'pointer' }}>
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.flag} {l.native}</option>
                        ))}
                    </select>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="auth-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('login')}</h1>
                    <p className="auth-demo-hint" style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                        {FIREBASE_ENABLED ? 'Secure access to your environmental dashboard' : `✨ ${t('demoHint')}`}
                    </p>
                </div>

                {/* Phone + Name form OR OTP form */}
                {mode === 'phone' ? (
                    <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="auth-field" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                            <User size={18} style={{ color: 'var(--green)', opacity: 0.8 }} />
                            <input className="auth-input" type="text" placeholder={t('enterName')}
                                value={name} onChange={e => { setName(e.target.value); setErr(''); }} autoComplete="name"
                                style={{ flex: 1, padding: '0.8rem', border: 'none', background: 'transparent', outline: 'none' }} />
                        </div>
                        <div className="auth-field" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                            <Phone size={18} style={{ color: 'var(--green)', opacity: 0.8 }} />
                            <input className="auth-input" type="tel"
                                placeholder={FIREBASE_ENABLED ? '+91 Phone number' : t('enterPhone')}
                                value={phone} onChange={e => { setPhone(e.target.value.replace(/[^\d+]/g, '')); setErr(''); }}
                                maxLength={13} autoComplete="tel"
                                style={{ flex: 1, padding: '0.8rem', border: 'none', background: 'transparent', outline: 'none' }} />
                        </div>
                        {err && <div className="auth-error" style={{ color: 'var(--red)', fontSize: '0.85rem', textAlign: 'center' }}>{err}</div>}
                        <button type="submit" className="btn-primary btn-full" disabled={loading} style={{
                            padding: '1rem', borderRadius: '16px', background: 'var(--green)', color: '#fff',
                            fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)'
                        }}>
                            {loading
                                ? <span className="spinning" style={{ display: 'inline-block', width: 20, height: 20, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                                : <><span>{FIREBASE_ENABLED ? 'Send OTP' : t('continueBtn')}</span><ArrowRight size={18} /></>
                            }
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
                            We sent a code to <strong>{phone}</strong>
                        </p>
                        <div className="auth-field" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', border: '1px solid var(--green)' }}>
                            <KeyRound size={20} style={{ color: 'var(--green)' }} />
                            <input className="auth-input" type="number" placeholder="6-digit OTP"
                                value={otp} onChange={e => { setOtp(e.target.value); setErr(''); }}
                                maxLength={6} autoFocus
                                style={{ flex: 1, padding: '0 1rem', fontSize: '1.2rem', letterSpacing: '8px', border: 'none', background: 'transparent', outline: 'none', textAlign: 'center' }} />
                        </div>
                        {err && <div className="auth-error" style={{ color: 'var(--red)', fontSize: '0.85rem', textAlign: 'center' }}>{err}</div>}
                        <button type="submit" className="btn-primary btn-full" disabled={loading} style={{
                            padding: '1rem', borderRadius: '16px', background: 'var(--green)', color: '#fff',
                            fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem'
                        }}>
                            {loading
                                ? <span className="spinning" style={{ display: 'inline-block', width: 20, height: 20, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                                : <span>Verify Account</span>
                            }
                        </button>
                        <button type="button" className="auth-link" style={{ marginTop: '0.5rem', color: 'var(--text-sub)', fontSize: '0.85rem' }}
                            onClick={() => { setMode('phone'); setOtp(''); setErr(''); }}>
                            ← Use different number
                        </button>
                    </form>
                )}

                {/* Recaptcha container (invisible) */}
                <div id="recaptcha-container" />

                {/* Divider */}
                <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('orContinueWith')}</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                </div>

                {/* Google button */}
                <button className="btn-google btn-full" onClick={handleGoogle} disabled={loading} style={{
                    width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)', color: '#fff', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
                    transition: 'background 0.2s'
                }}>
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>

                <p className="auth-switch" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                    {t('noAccount')}{' '}
                    <button className="auth-link" onClick={() => navigate('/signup')} style={{ color: 'var(--green)', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>{t('signup')}</button>
                </p>
            </div>
        </div>
    );
}
