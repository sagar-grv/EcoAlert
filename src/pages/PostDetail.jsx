import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useApp } from '../context/AppContext';

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { posts } = useApp();

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return (
            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--text-muted)' }}>Post not found</h2>
                <p style={{ color: 'var(--text-dim)' }}>This post may have been removed.</p>
                <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Feed
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="page-title" style={{ marginLeft: 8, fontSize: '1rem' }}>Post Detail</div>
            </div>

            <PostCard post={post} />

            {/* AI Analysis Detail */}
            {post.risk && (
                <div style={{
                    margin: '0 16px 16px', padding: '16px',
                    background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)'
                }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--green-400)' }}>
                        🤖 AI Analysis Detail
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ padding: 10, background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Risk Level</div>
                            <div style={{ fontWeight: 700, color: post.risk.color || 'var(--text)' }}>
                                {post.risk.emoji} {post.risk.level}
                            </div>
                        </div>
                        <div style={{ padding: 10, background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Impact Score</div>
                            <div style={{ fontWeight: 700, color: 'var(--amber)' }}>
                                {post.impact?.score || '—'}/100
                            </div>
                        </div>
                        <div style={{ padding: 10, background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Credibility</div>
                            <div style={{ fontWeight: 700, color: post.fakeNews?.color || 'var(--text)' }}>
                                {post.fakeNews?.label || 'Unclassified'} ({post.fakeNews?.score || '—'}%)
                            </div>
                        </div>
                        <div style={{ padding: 10, background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Location</div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                📍 {post.location?.city || 'Unknown'}, {post.location?.state || ''}
                            </div>
                        </div>
                    </div>
                    {post.risk.reason && (
                        <div style={{ marginTop: 10, padding: '8px 12px', background: post.risk.bgColor || 'rgba(234,179,8,0.1)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: post.risk.color || 'var(--text)' }}>
                            <strong>Reason:</strong> {post.risk.reason}
                        </div>
                    )}
                    {post.suggestions && post.suggestions.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>AI Suggestions</div>
                            {post.suggestions.map((s, i) => (
                                <div key={i} style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text)', background: 'var(--bg-card2)', borderRadius: 'var(--radius-sm)', marginBottom: 4 }}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
