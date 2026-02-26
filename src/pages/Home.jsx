import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import CreatePost from '../components/CreatePost';

export default function Home() {
    const { posts, loading, filter } = useApp();
    const [showCreate, setShowCreate] = useState(false);

    const filtered = posts.filter(p => {
        if (filter.category && p.category !== filter.category) return false;
        if (filter.risk && p.risk?.level !== filter.risk) return false;
        return true;
    });

    return (
        <div className="flex-1 w-full max-w-md mx-auto pb-28">
            <CategoryFilter />

            <div className="flex flex-col gap-4 p-4">
                {loading ? (
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
