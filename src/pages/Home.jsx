import React from 'react';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import RightSidebar from '../components/RightSidebar';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import { Leaf } from 'lucide-react';

export default function Home() {
    const { getFilteredPosts } = useApp();
    const { t } = useLang();
    const posts = getFilteredPosts();

    return (
        <div className="home-layout">
            {/* Feed column */}
            <main className="feed-col">
                <div className="feed-header">
                    <h2 className="feed-title">
                        <Leaf size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
                        {t('latestAlerts')}
                    </h2>
                </div>

                <CategoryFilter />

                {posts.length === 0 ? (
                    <div className="feed-empty">
                        <div className="feed-empty-icon">🌿</div>
                        <div className="feed-empty-text">{t('noPostsFound')}</div>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </main>

            {/* Right sidebar */}
            <aside className="sidebar-col">
                <RightSidebar />
            </aside>
        </div>
    );
}
