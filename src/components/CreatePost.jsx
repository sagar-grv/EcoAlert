import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

const CATEGORIES = [
    'Air Pollution', 'Water Pollution', 'Deforestation', 'Soil Contamination',
    'Flood', 'Drought', 'Wildlife', 'Wildfire', 'Noise Pollution',
    'Plastic Waste', 'Industrial Hazard', 'Other',
];

/* Debounce helper */
function useDebounce(fn, delay = 400) {
    const timerRef = useRef(null);
    return useCallback((...args) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
}

export default function CreatePost({ onClose }) {
    const { addPost, posting } = useApp();
    const { t } = useLang();

    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Air Pollution');
    const [imageSrc, setImageSrc] = useState(null);
    const [city, setCity] = useState('');
    const [cityQuery, setCityQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [charErr, setCharErr] = useState('');
    const fileRef = useRef(null);

    /* --- City search via Nominatim --- */
    const searchcities = useCallback(async (q) => {
        if (q.trim().length < 2) { setSuggestions([]); return; }
        setFetching(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&country=IN&addressdetails=1&limit=6&format=json`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
            const data = await res.json();
            setSuggestions(data.map((r) => ({
                label: r.display_name.split(',').slice(0, 3).join(', '),
                city: r.address?.city || r.address?.town || r.address?.village || r.address?.county || r.name,
                state: r.address?.state || '',
                lat: parseFloat(r.lat),
                lng: parseFloat(r.lon),
            })));
        } catch (_) { setSuggestions([]); } finally { setFetching(false); }
    }, []);

    const debouncedSearch = useDebounce(searchcities, 400);

    function onCityInput(e) {
        const val = e.target.value;
        setCityQuery(val);
        setCity(val);
        debouncedSearch(val);
    }

    function selectCity(s) {
        setCity(s.city);
        setCityQuery(s.city);
        setSelectedCoords({ lat: s.lat, lng: s.lng, state: s.state });
        setSuggestions([]);
    }

    /* --- Image handler --- */
    function handleImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImageSrc(ev.target.result);
        reader.readAsDataURL(file);
    }

    /* --- Submit --- */
    async function handleSubmit(e) {
        e.preventDefault();
        if (caption.trim().length < 10) { setCharErr('Caption must be at least 10 characters.'); return; }
        setCharErr('');
        await addPost({
            caption: caption.trim(),
            category,
            imageSrc,
            locationCity: selectedCoords ? city : (city || 'Unknown'),
            locationState: selectedCoords?.state || '',
            locationLat: selectedCoords?.lat || null,
            locationLng: selectedCoords?.lng || null,
        });
        onClose();
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[100] transition-opacity"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className="fixed inset-x-0 bottom-0 z-[101] glass-panel rounded-t-3xl border-t border-white/20 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-h-[90vh]"
                style={{ width: '100%', maxWidth: '448px', margin: '0 auto' }}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-2 flex justify-between items-center flex-shrink-0 border-b border-black/5 dark:border-white/5">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">eco</span>
                        New Report
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-4 space-y-6 no-scrollbar">
                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">category</span>
                            Incident Type
                        </label>
                        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-6 px-6">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="space-y-3 relative">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                            Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search location..."
                                value={cityQuery}
                                onChange={onCityInput}
                                disabled={posting}
                                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-500 text-[20px]">search</span>
                            {fetching ? (
                                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-500 text-[20px] animate-spin">autorenew</span>
                            ) : (
                                <button className="absolute right-3 top-3.5 text-primary hover:text-primary/80 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">my_location</span>
                                </button>
                            )}
                        </div>
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto">
                                {suggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => selectCity(s)}
                                        className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer text-sm text-slate-300 transition-colors"
                                    >
                                        {s.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">photo_camera</span>
                            Evidence <span className="text-slate-500 font-normal ml-1 text-xs">(Required)</span>
                        </label>
                        {imageSrc ? (
                            <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                                <img src={imageSrc} alt="Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium mr-2 transition-colors"
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageSrc(null)}
                                        className="bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={posting}
                                className="w-full h-32 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-primary/50 bg-black/5 dark:bg-black/20 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                                </div>
                                <span className="text-sm font-medium">Capture or Upload Photo</span>
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                            Description
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => { setCaption(e.target.value); setCharErr(''); }}
                            disabled={posting}
                            placeholder="Describe the environmental issue in detail..."
                            className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm min-h-[100px] resize-y"
                        />
                        <div className="flex justify-between items-center mt-1">
                            {charErr ? (
                                <span className="text-xs text-red-400 font-medium">{charErr}</span>
                            ) : (
                                <span className="text-xs text-slate-500">Provide specific details to help verification</span>
                            )}
                            <span className={`text-xs ${caption.length < 10 ? 'text-red-400 font-medium' : 'text-slate-500'}`}>{caption.length}/500</span>
                        </div>
                    </div>

                    {/* AI Analysis Preview (Visible when fields are filled) */}
                    {caption.length >= 10 && imageSrc && !posting && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 anim-slide-up">
                            <div className="mt-1">
                                <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" alt="Gemini" className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#21c45d] mb-1 tracking-wide">Gemini Analysis Ready</h4>
                                <p className="text-xs text-[#9fb7a8] leading-relaxed">
                                    Your report will be analyzed by AI to determine credibility, risk level, and environmental impact before publishing.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2 pb-6 border-t border-white/5">
                        <button
                            onClick={handleSubmit}
                            disabled={posting || caption.trim().length < 10}
                            className="w-full bg-primary hover:bg-[#1db053] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                        >
                            {posting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                                    AI Analyzing Report...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Submit Alert
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
