import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onCreatePost }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropOpen, setDropOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
                <div className="text-primary p-1.5 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white">EcoAlert</h1>
            </Link>

            <div className="flex items-center gap-3">
                {onCreatePost && (
                    <button
                        onClick={onCreatePost}
                        className="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Report
                    </button>
                )}
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>

                {/* Avatar dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropOpen(v => !v)}
                        className="h-8 w-8 rounded-full bg-slate-200 dark:bg-surface-dark overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center text-sm font-bold text-primary"
                    >
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </button>
                    {dropOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                            <Link
                                to="/profile"
                                onClick={() => setDropOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <span className="material-symbols-outlined text-base">person</span>
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <span className="material-symbols-outlined text-base">logout</span>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
