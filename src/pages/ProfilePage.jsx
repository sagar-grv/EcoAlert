import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

const TABS = ['My Reports', 'Liked', 'Verified'];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const { posts } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    const myPosts = posts.filter(p => p.authorId === user?.id);
    const likedPosts = posts.filter(p => (p.likedBy || []).includes(user?.id));
    const verifiedPosts = posts.filter(p => (p.fakeNews?.credibilityScore ?? 0) >= 80 && p.authorId === user?.id);

    const tabPosts = [myPosts, likedPosts, verifiedPosts][activeTab] || [];
    const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden pb-28">
            {/* Header Nav */}
            <div className="sticky top-0 z-20 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-primary/10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">{user?.name || 'User'}</h2>
                        <p className="text-xs text-slate-500 dark:text-primary/60 font-medium">{myPosts.length} Reports</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">logout</span>
                </button>
            </div>

            {/* Banner */}
            <div className="relative">
                <div className="h-32 w-full bg-gradient-to-r from-primary/40 to-primary dark:from-primary/20 dark:to-primary/40" />
                <div className="px-4 -mt-12 flex justify-between items-end">
                    <div className="size-24 rounded-full border-4 border-background-light dark:border-background-dark bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold font-display">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <button className="mb-2 flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 border border-primary text-primary text-sm font-bold transition-colors hover:bg-primary/10">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="px-4 mt-4 space-y-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">{user?.name || 'User'}</h1>
                        <span className="material-symbols-outlined text-primary text-xl ms-fill">verified</span>
                    </div>
                    <p className="text-slate-500 dark:text-primary/60 font-medium text-sm">@{user?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}</p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Dedicated eco-warrior reporting environmental issues. Together for a Greener India. 🌿
                </p>
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-primary/60">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>India</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span>Joined {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 py-2 border-y border-slate-100 dark:border-primary/5">
                    <div className="flex gap-1 items-baseline">
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{myPosts.length}</span>
                        <span className="text-slate-500 dark:text-primary/60 text-sm">Reports</span>
                    </div>
                    <div className="flex gap-1 items-baseline">
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{totalLikes}</span>
                        <span className="text-slate-500 dark:text-primary/60 text-sm">Likes</span>
                    </div>
                    <div className="flex gap-1 items-baseline">
                        <span className="text-slate-900 dark:text-slate-100 font-bold">{totalLikes * 10}</span>
                        <span className="text-slate-500 dark:text-primary/60 text-sm">Impact Pts</span>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-slate-100 dark:border-primary/5 mt-2">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`flex-1 flex flex-col items-center justify-center pt-4 pb-3 border-b-2 transition-colors ${activeTab === i
                                ? 'border-primary text-slate-900 dark:text-slate-100 font-bold'
                                : 'border-transparent text-slate-500 dark:text-primary/40'
                            }`}
                    >
                        <span className="text-sm font-bold">{tab}</span>
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-4 p-4">
                {tabPosts.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                        <span className="material-symbols-outlined text-4xl">inbox</span>
                        <p className="text-sm">No reports yet</p>
                    </div>
                ) : (
                    tabPosts.map(post => <PostCard key={post.id} post={post} />)
                )}
            </div>
        </div>
    );
}
