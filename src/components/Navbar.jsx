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
        <header className="sticky top-0 z-50 glass-nav px-4 py-4 border-b">
            <div className="flex items-center justify-between max-w-md mx-auto">
                <Link to="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EcoAlert <span className="text-primary/60 font-medium text-sm ml-1">India</span></h1>
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setDropOpen(v => !v)}
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-primary">account_circle</span>
                    </button>
                    {dropOpen && (
                        <div className="absolute right-0 mt-3 w-48 glass-panel rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
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
