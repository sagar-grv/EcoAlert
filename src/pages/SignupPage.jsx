import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../i18n/translations';

export default function SignupPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [lang, setLang] = useState('en');
    const [loading, setLoading] = useState(false);

    async function handleSignup(e) {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            await login(name.trim(), phone, lang);
            navigate('/');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen bg-background-dark flex items-center justify-center p-4"
            style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(33,196,93,0.05) 1px, transparent 0)',
                backgroundSize: '24px 24px',
            }}
        >
            <div className="relative w-full max-w-[420px] bg-background-dark rounded-[2rem] overflow-hidden shadow-2xl border-[2px] border-white/10 flex flex-col">
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col px-8 pt-14 pb-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center mb-6 border border-primary/30">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>eco</span>
                        </div>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-100">EcoAlert</h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium">Join India's Green Network</p>
                    </div>

                    <form
                        onSubmit={handleSignup}
                        className="flex flex-col gap-5 rounded-xl p-6"
                        style={{ background: 'rgba(23,46,32,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <div className="text-center mb-2">
                            <h2 className="font-display text-2xl font-semibold text-slate-100">Create Account</h2>
                            <p className="text-slate-400 text-sm">Start reporting environmental issues</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="flex gap-2">
                                <div className="relative w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">+91</span>
                                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-10 pr-2 text-slate-100 appearance-none focus:ring-2 focus:ring-primary/50 outline-none">
                                        <option>IN</option>
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="00000-00000"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 px-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Preferred Language</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">translate</span>
                                <select
                                    value={lang}
                                    onChange={e => setLang(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-10 text-slate-100 appearance-none focus:ring-2 focus:ring-primary/50 outline-none"
                                >
                                    {LANGUAGES.map(l => (
                                        <option key={l.code} value={l.code}>{l.label}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-[#12a146] hover:brightness-110 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 mt-2 transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? 'Creating account…' : 'Sign Up'}
                        </button>

                        <div className="text-center mt-2">
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
