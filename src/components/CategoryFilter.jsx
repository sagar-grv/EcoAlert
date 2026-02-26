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
    const { filter, setFilter } = useApp();

    return (
        <div className="sticky top-[60px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm pt-4 pb-2">
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map(cat => {
                    const isActive = filter.category === (cat.id === 'all' ? null : cat.id);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(f => ({ ...f, category: cat.id === 'all' ? null : cat.id }))}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${isActive
                                    ? 'bg-slate-900 dark:bg-primary text-white dark:text-slate-900 font-semibold'
                                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
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
