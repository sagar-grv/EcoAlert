import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
    { emoji: '🌬️', name: 'Air', count: '1.2k', bars: [40, 100, 90, 70] },
    { emoji: '💧', name: 'Water', count: '850', bars: [80, 40, 100, 20] },
    { emoji: '🌳', name: 'Land', count: '2.1k', bars: [50, 40, 50, 10] },
    { emoji: '🐘', name: 'Wildlife', count: '500', bars: [20, 80, 40, 90] },
    { emoji: '🔥', name: 'Climate', count: '3.2k', bars: [80, 10, 80, 10] },
    { emoji: '🌋', name: 'Disaster', count: '150', bars: [10, 50, 90, 90] },
];

const BAR_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-primary'];

export default function Explore() {
    const navigate = useNavigate();
    const { setActiveCategory } = useApp() ?? {};

    function handleCategoryClick(name) {
        if (setActiveCategory) setActiveCategory(name);
        navigate('/');
    }

    return (
        <div className="w-full max-w-md px-4 pt-6 pb-28">
            {/* Heading */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Explore by Category</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Real-time environmental reporting across India
                </p>
            </div>

            {/* 2-col category grid */}
            <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="text-left rounded-xl p-4 flex flex-col gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'rgba(29,201,92,0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(29,201,92,0.1)',
                            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.5), 0 0 15px -5px rgba(29,201,92,0.3)',
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-3xl">{cat.emoji}</span>
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/30">
                                {cat.count}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{cat.name}</h3>
                        </div>
                        {/* Mini bar chart */}
                        <div className="flex items-end gap-1 h-8 mt-1">
                            {cat.bars.map((h, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 ${BAR_COLORS[i]} rounded-t-sm`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* AI Verification Banner */}
            <div
                className="mt-8 rounded-xl p-4 border border-primary/20"
                style={{ background: 'rgba(29,201,92,0.05)', backdropFilter: 'blur(12px)' }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <h4 className="font-bold text-sm">AI Verification Active</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Reports are processed using advanced satellite imagery and ground-truth data from our
                    AI models focused on the Indian subcontinent.
                </p>
            </div>
        </div>
    );
}
