const AI_STACK = [
    { icon: 'fact_check', label: 'Fake News Detector', sub: 'Verifying sources', stat: '98.5%', statLabel: 'Accuracy' },
    { icon: 'shield', label: 'Risk Classifier', sub: 'Real-time assessment', stat: '94.2%', statLabel: 'Accuracy' },
    { icon: 'image_search', label: 'Image Verification', sub: 'Deepfake detection', stat: '99.1%', statLabel: 'Accuracy' },
    { icon: 'verified', label: 'Source Credibility', sub: 'Database cross-check', stat: 'High', statLabel: 'Confidence', statColor: 'text-emerald-400' },
];

const FUTURE = [
    { icon: 'satellite_alt', label: 'Satellite Scan', desc: 'Automated deforestation monitoring via satellite feeds.' },
    { icon: 'forest', label: 'Bio-Diversity', desc: 'Species identification from audio recordings.' },
    { icon: 'water_drop', label: 'Water Quality', desc: 'Pollution analysis using visual water samples.' },
];

export default function Analysis() {
    return (
        <div className="w-full max-w-md px-4 pt-4 pb-28 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-between p-5 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                        <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                        {/* pulsing dot */}
                        <span className="relative flex h-3 w-3 rounded-full bg-primary">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">AI Features Active</p>
                        <p className="text-3xl font-bold mt-1">4/5</p>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-5 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                        <span className="material-symbols-outlined text-orange-400 text-3xl">warning</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Limitations</p>
                        <p className="text-3xl font-bold mt-1">v0.9</p>
                    </div>
                </div>
            </div>

            {/* Current AI Stack */}
            <div>
                <h3 className="text-lg font-bold mb-4 px-1">Current AI Stack</h3>
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                    {AI_STACK.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{item.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${item.statColor ?? 'text-primary'}`}>{item.stat}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.statLabel}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Future Features */}
            <div>
                <h3 className="text-lg font-bold mb-4 px-1">Future Features</h3>
                <div className="grid grid-cols-2 gap-4">
                    {FUTURE.map((f) => (
                        <div
                            key={f.label}
                            className="p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">{f.icon}</span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{f.label}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}

                    {/* Coming Soon placeholder */}
                    <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-slate-400 mb-2">add_circle</span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">More Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
