// ─── Feed Loading Skeleton ────────────────────────────────────
import React from 'react';

function SkeletonCard() {
    return (
        <div className="post-card" style={{ padding: '16px', gap: 12, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ height: 13, width: '40%', borderRadius: 6 }} />
                    <div className="skeleton" style={{ height: 11, width: '25%', borderRadius: 6 }} />
                </div>
                <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="skeleton" style={{ height: 12, width: '100%', borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 12, width: '88%', borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 12, width: '65%', borderRadius: 6 }} />
            </div>
            <div className="skeleton" style={{ height: 180, borderRadius: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
                <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
                <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
                <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 999, marginLeft: 'auto' }} />
            </div>
        </div>
    );
}

export default function FeedSkeleton({ count = 3 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}
