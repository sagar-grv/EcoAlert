import { useApp } from '../context/AppContext';

const RISK_COLORS = {
    Critical: { bg: 'bg-risk-crit/10', text: 'text-risk-crit', ring: 'ring-risk-crit/20', credColor: 'text-risk-crit' },
    High: { bg: 'bg-risk-high/10', text: 'text-risk-high', ring: 'ring-risk-high/20', credColor: 'text-risk-high' },
    Moderate: { bg: 'bg-risk-med/10', text: 'text-risk-med', ring: 'ring-risk-med/20', credColor: 'text-risk-med' },
    Low: { bg: 'bg-risk-low/10', text: 'text-risk-low', ring: 'ring-risk-low/20', credColor: 'text-risk-low' },
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
        <article className="flex flex-col glass-panel rounded-2xl overflow-hidden mb-4 transition-transform hover:-translate-y-1 duration-300">
            {/* Context/Reposter (Optional) */}
            {post.reposter && (
                <div className="px-4 py-2 flex items-center gap-2 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">repeat</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{post.reposter} reposted</span>
                </div>
            )}

            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-surface-dark overflow-hidden flex items-center justify-center font-bold text-primary">
                            {post.author?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{post.author}</p>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400">{post.timeAgo || 'just now'} • {post.city || 'Unknown Location'}</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                </div>

                {/* Content */}
                <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 mb-3">{post.caption}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${riskStyle.bg} ${riskStyle.text} border-${riskStyle.text}/20`}>
                        {post.risk?.level || 'Low'} Risk
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Media */}
            {post.image && (
                <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                    <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />

                    {/* Gemini AI Verification Badge inside Image */}
                    <div className="absolute bottom-3 left-3 right-3 glass-card rounded-lg p-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-3">
                            <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" alt="Gemini" className="w-6 h-6 object-cover" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300">AI Verification</p>
                                <p className={`text-sm font-bold ${credColor}`}>
                                    {credibility}% Confident
                                </p>
                            </div>
                        </div>
                        <span className={`material-symbols-outlined ${credColor}`}>{credIcon}</span>
                    </div>
                </div>
            )}

            {/* Interaction Bar */}
            <div className={`px-4 py-3 flex justify-between items-center border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 ${post.suggestions?.length > 0 ? '' : 'rounded-b-2xl'}`}>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors group">
                        <span className="material-symbols-outlined text-[20px] group-hover:fill-current">chat_bubble</span>
                        <span className="text-xs font-semibold">{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors group">
                        <span className="material-symbols-outlined text-[20px]">repeat</span>
                        <span className="text-xs font-semibold">{post.reposts || 0}</span>
                    </button>
                    <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'ms-fill' : ''}`}>favorite</span>
                        <span className="text-xs font-semibold">{post.likes || 0}</span>
                    </button>
                </div>
                <button onClick={handleShare} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
            </div>

            {/* Quick Actions (if any suggestions exist) */}
            {post.suggestions?.length > 0 && (
                <div className="px-4 py-3 border-t border-black/5 dark:border-white/5 bg-transparent rounded-b-2xl">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Suggested Actions</p>
                    <div className="flex flex-wrap gap-2">
                        {post.suggestions.slice(0, 3).map((s, i) => (
                            <button key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 transition-colors">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
