import { useApp } from '../context/AppContext';

const RISK_COLORS = {
    Critical: { bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20', credColor: 'text-primary' },
    High: { bg: 'bg-orange-500/10', text: 'text-orange-500', ring: 'ring-orange-500/20', credColor: 'text-orange-400' },
    Moderate: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', ring: 'ring-yellow-500/20', credColor: 'text-yellow-400' },
    Low: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20', credColor: 'text-primary' },
};

export default function PostCard({ post }) {
    const { toggleLike, user } = useApp();
    const isLiked = (post.likedBy || []).includes(user?.id);
    const riskStyle = RISK_COLORS[post.risk?.level] || RISK_COLORS.Low;
    const credibility = post.fakeNews?.credibilityScore ?? 80;

    const credColor =
        credibility >= 80 ? 'text-primary' :
            credibility >= 60 ? 'text-yellow-400' :
                'text-red-400';

    const credIcon =
        credibility >= 80 ? 'verified_user' :
            credibility >= 60 ? 'warning' :
                'error';

    function handleShare() {
        const text = `${post.caption} — EcoAlert`;
        if (navigator.share) navigator.share({ title: 'EcoAlert', text, url: window.location.href });
        else navigator.clipboard?.writeText(text);
    }

    return (
        <article className="flex flex-col rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="h-10 w-10 rounded-full bg-slate-100 dark:bg-surface-dark overflow-hidden border border-white/5 flex items-center justify-center text-primary font-bold"
                    >
                        {post.author?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.author}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            {post.city && (
                                <>
                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                    <span>{post.city}</span>
                                    <span className="mx-1">•</span>
                                </>
                            )}
                            <span>{post.timeAgo || 'just now'}</span>
                        </div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>

            {/* Badges */}
            <div className="px-4 pb-3 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-md ${riskStyle.bg} px-2 py-1 text-xs font-medium ${riskStyle.text} ring-1 ring-inset ${riskStyle.ring}`}>
                        {post.risk?.level || 'Low'} Risk
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-white/10 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
                        {post.category}
                    </span>
                </div>
                <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">{post.caption}</p>
            </div>

            {/* Image */}
            {post.image && (
                <div className="w-full aspect-video bg-slate-800 relative group overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${post.image})` }}
                    />
                    {/* Credibility overlay */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">AI Verified</span>
                            <span className={`text-xs font-bold ${credColor}`}>{credibility}% Credible</span>
                        </div>
                        <div className={`h-8 w-8 rounded-full border-2 border-${credColor.replace('text-', '')}/30 flex items-center justify-center bg-${credColor.replace('text-', '')}/10`}>
                            <span className={`material-symbols-outlined ${credColor} text-sm`}>{credIcon}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="p-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#161e18]">
                <div className="flex items-center gap-6 px-2">
                    <button className="group flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined group-hover:fill-current text-[22px]">chat_bubble</span>
                        <span className="text-xs font-medium">{post.comments ?? 0}</span>
                    </button>
                    <button className="group flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-green-400 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">cached</span>
                        <span className="text-xs font-medium">{post.reposts ?? 0}</span>
                    </button>
                    <button
                        onClick={() => toggleLike(post.id)}
                        className={`group flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
                    >
                        <span className={`material-symbols-outlined text-[22px] ${isLiked ? 'ms-fill' : ''}`}>favorite</span>
                        <span className="text-xs font-medium">{post.likes || 0}</span>
                    </button>
                </div>
                <button onClick={handleShare} className="text-slate-500 dark:text-slate-400 hover:text-white p-2">
                    <span className="material-symbols-outlined text-[22px]">share</span>
                </button>
            </div>

            {/* AI Suggestion (collapsed) */}
            {post.suggestions?.length > 0 && (
                <details className="border-t border-white/5">
                    <summary className="px-4 py-2 text-xs text-primary cursor-pointer flex items-center gap-1 hover:bg-primary/5">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                        AI Suggestions ({post.suggestions.length})
                    </summary>
                    <ul className="px-4 pb-3 space-y-1">
                        {post.suggestions.slice(0, 3).map((s, i) => (
                            <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                                <span className="text-primary">•</span>{s}
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </article>
    );
}
