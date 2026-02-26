import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import CreatePost from '../components/CreatePost';

export default function Home() {
    const { loading, getFilteredPosts } = useApp();
    const [showCreate, setShowCreate] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const filtered = getFilteredPosts();

    function handleRefresh() {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 600);
    }

    return (
        <div className="flex-1 w-full max-w-md mx-auto pb-28">
            <CategoryFilter />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between pb-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Reports</h2>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
                    >
                        <span className={`material-symbols-outlined ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                </div>

                {loading || refreshing ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
                        <span className="material-symbols-outlined text-primary text-5xl animate-spin">eco</span>
                        <p className="text-sm">Loading alerts…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
                        <span className="material-symbols-outlined text-5xl">search_off</span>
                        <p className="text-sm">No reports found.</p>
                    </div>
                ) : (
                    filtered.map(post => <PostCard key={post.id} post={post} />)
                )}
            </div>

            {showCreate && <CreatePost onClose={() => setShowCreate(false)} />}
        </div>
    );
}
