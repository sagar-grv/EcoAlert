import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SAMPLE_INCIDENTS = [
    {
        id: 1,
        title: 'Illegal Dumping in Bandra',
        desc: 'Found a large pile of construction debris dumped near the mangroves. Needs immediate attention.',
        dist: 3.2,
        time: '2h ago',
        risk: 'Critical',
        riskColor: 'bg-red-500/90',
        verified: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQnNiZtWd-l2y6JIKpxOsaRSd1PysSsOW-6RJmmFiwHnc1qJJFrJcxVtDDtfcw9aGhD8rCRJxcdMV7KRMMzZfaOac5zo0oWxL7GhE5Z2XXYUja4mG5gypbBrxOYc6StLGTlMqiWJ7bz0TH5eDP9DJtOE0FoPNgU8h_rTFSVbbR5m1aptEUFlaFUqiq84TutfO5HMXEzzPTnoD36QivRNskYWKg51JSbEeJKet_GvbEeLe4l9orPnHvy_BROpvW5kAYAc_LEKYRrcyJ',
    },
    {
        id: 2,
        title: 'Chemical Runoff at Creek',
        desc: 'Water has turned a strange color and smells pungent. Possible industrial leak upstream.',
        dist: 5.8,
        time: '5h ago',
        risk: 'Moderate',
        riskColor: 'bg-orange-500/90',
        verified: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7f2vWizhYshiIBYq3lceYoWLu4LuYduMwgnEV9q8M4hP19zRz1EsN26LyjXy0X-V-5RiUdA0LloHF3jwo2_ryzmACAKaliwmVBBdcseclhAT_hYDWqOkqAFk3fDCAfXXJ4J_FhZZ6KDbfcRMJR0T_pOlmUN7QFc5P138PyHqVbBNFAXbw6Mxkb_LkRbo9LsRORW9KtbdPXwWW18kxHbMfClal3PP0EDAuRfLZyPF8SELmhYT265VZ0ymNgi2acAOfWQdp6NY2rEfI',
    },
    {
        id: 3,
        title: 'Unauthorized Tree Cutting',
        desc: 'Several old trees cut down near the park entrance without any visible permits.',
        dist: 8.1,
        time: '1d ago',
        risk: 'Warning',
        riskColor: 'bg-yellow-500/90',
        verified: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1KKjkg3dO5oFNK8e46I_lDQ-fNtJPfl44YsoE5Y6ZRoI-EbLr0YOh91qyr3Z_PeMUIhYOBHvSIWpwVEi9RTLb24684a5jSbrPksXNHwNFBdBj7oN2jxUCtQFg55yWSO0IzMBWZcbD7vb35JjgYGgByZ6KbgkGkADhRRQq2Zd3hP3TUJieSfVg-rM-16rXQiAUEtslowsHkSHFJe1NrcPVcldmJPQi2YrNHkP9c8CtK9li2A326h9SOSzLV2Tw0WVYTw8y_XesR2m',
    },
];

export default function NearMe() {
    const [radius, setRadius] = useState(25);
    const [locating, setLocating] = useState(false);
    const [city, setCity] = useState('Mumbai, Maharashtra');

    // Use real posts from context if available
    const appContext = useApp();
    const posts = appContext?.posts ?? [];

    // Filter sample incidents by radius
    const incidents = SAMPLE_INCIDENTS.filter((i) => i.dist <= radius);

    function handleDetectLocation() {
        setLocating(true);
        if (!navigator.geolocation) { setLocating(false); return; }
        navigator.geolocation.getCurrentPosition(
            () => { setLocating(false); },
            () => { setLocating(false); }
        );
    }

    return (
        <div className="w-full max-w-md pb-28">
            {/* Sub-header */}
            <div className="sticky top-[57px] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="w-10" />
                <h2 className="text-lg font-bold">Near Me</h2>
                <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors">
                    <span className="material-symbols-outlined">map</span>
                </button>
            </div>

            <div className="px-4">
                {/* Detect location */}
                <div className="pt-6 pb-2 flex justify-center">
                    <button
                        onClick={handleDetectLocation}
                        disabled={locating}
                        className="flex items-center gap-2 bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-xl">my_location</span>
                        {locating ? 'Detecting…' : 'Detect My Location'}
                    </button>
                </div>

                <h1 className="text-center text-2xl font-bold mt-4 mb-1">{city}</h1>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                    {incidents.length} active reports found
                </p>

                {/* Radius Slider */}
                <div className="mb-8 bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Search Radius</span>
                        <span className="text-primary font-bold">{radius} km</span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={100}
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>10 km</span>
                        <span>100 km</span>
                    </div>
                </div>

                {/* Incident List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                        Nearby Incidents
                    </h3>

                    {incidents.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <span className="material-symbols-outlined text-5xl mb-2">location_off</span>
                            <p>No incidents within {radius} km</p>
                        </div>
                    )}

                    {incidents.map((inc) => (
                        <div
                            key={inc.id}
                            className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden rounded-xl">
                                <img
                                    src={inc.image}
                                    alt={inc.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Distance badge */}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                                    <span className="material-symbols-outlined text-primary text-sm">near_me</span>
                                    {inc.dist} km
                                </div>
                                {/* Risk badge */}
                                <div className="absolute bottom-3 left-3">
                                    <span className={`${inc.riskColor} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide`}>
                                        {inc.risk}
                                    </span>
                                </div>
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col gap-1 px-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                                        {inc.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 whitespace-nowrap mt-1">{inc.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{inc.desc}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-xs font-medium ${inc.verified ? 'text-primary' : 'text-slate-400'}`}>
                                        {inc.verified ? 'Verified by AI' : 'Pending Verification'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
