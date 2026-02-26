import { useApp } from '../context/AppContext';

const CATEGORIES = [
    { id: 'all', label: 'All', emoji: '🌍' },
    { id: 'Air', label: 'Air', emoji: '💨' },
    { id: 'Water', label: 'Water', emoji: '💧' },
    { id: 'Land', label: 'Land', emoji: '🌱' },
    { id: 'Noise', label: 'Noise', emoji: '🔊' },
    { id: 'Waste', label: 'Waste', emoji: '🗑️' },
    { id: 'Wildlife', label: 'Wildlife', emoji: '🦁' },
];

export default function CategoryFilter() {
    const { activeCategory, setActiveCategory } = useApp();

    return (
        <div className="sticky top-[60px] z-40 bg-background-light/60 dark:bg-background-dark/60 backdrop-blur-xl pt-4 pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.label;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.label)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all ${isActive
                                ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30 scale-105'
                                : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
                                }`}
                        >
                            <span className="text-sm font-medium">{cat.emoji} {cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
