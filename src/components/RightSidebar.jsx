import React from 'react';
import { useApp } from '../context/AppContext';

export default function RightSidebar() {
    const { posts } = useApp();

    // Top categories by count
    const categoryCounts = posts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // High-risk posts
    const highRiskPosts = posts.filter((p) => p.risk?.level === 'High').slice(0, 3);

    // Top cities
    const cityCounts = posts.reduce((acc, p) => {
        const city = p.location?.city;
        if (city) acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});
    const topCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Trending Categories */}
            <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--green)' }}>trending_up</span>
                    Trending Categories
                </div>
                {topCategories.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No data yet</p>
                ) : (
                    topCategories.map(([cat, count]) => (
                        <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)', background: 'rgba(78,205,136,0.1)', borderRadius: '999px', padding: '0.1rem 0.5rem' }}>{count}</span>
                        </div>
                    ))
                )}
            </div>

            {/* High Risk Alerts */}
            {highRiskPosts.length > 0 && (
                <div className="glass-card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#f87171' }}>warning</span>
                        High Risk Alerts
                    </div>
                    {highRiskPosts.map((post) => (
                        <div key={post.id} style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {post.caption?.slice(0, 55)}{(post.caption?.length || 0) > 55 ? '…' : ''}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                📍 {post.location?.city}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Active Cities */}
            <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--green)' }}>location_on</span>
                    Active Cities
                </div>
                {topCities.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No data yet</p>
                ) : (
                    topCities.map(([city, count]) => (
                        <div key={city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{city}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)', background: 'rgba(78,205,136,0.1)', borderRadius: '999px', padding: '0.1rem 0.5rem' }}>{count} alerts</span>
                        </div>
                    ))
                )}
            </div>

            {/* EcoAlert info */}
            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--green)', marginBottom: '0.5rem' }}>eco</span>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>EcoAlert India</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Real-time environmental monitoring powered by AI. Report. Verify. Protect.</div>
            </div>
        </div>
    );
}
