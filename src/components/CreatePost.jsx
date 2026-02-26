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
                className="modal-backdrop"
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 200, animation: 'fadeIn 0.15s ease' }}
            />

            {/* Modal */}
            <div
                className="create-post-modal glass-card anim-slide-up"
                style={{
                    position: 'fixed', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 201, width: 'min(96vw, 520px)',
                    maxHeight: '90vh', overflowY: 'auto',
                    padding: '1.5rem',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        🌿 {t('postReport')}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Caption */}
                    <div>
                        <label className="form-label">{t('caption')}</label>
                        <textarea
                            value={caption}
                            onChange={(e) => { setCaption(e.target.value); setCharErr(''); }}
                            placeholder={t('captionPlaceholder') || 'Describe the environmental incident…'}
                            rows={4}
                            className="form-textarea"
                            style={{ resize: 'vertical', minHeight: '90px' }}
                            disabled={posting}
                        />
                        {charErr && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{charErr}</div>}
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: caption.length < 10 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {caption.length} / 500
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="form-label">{t('category')}</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-select"
                            disabled={posting}
                        >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* City search */}
                    <div style={{ position: 'relative' }}>
                        <label className="form-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '0.3rem' }}>location_on</span>
                            Location (City)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={cityQuery}
                                onChange={onCityInput}
                                placeholder="Search for a city in India…"
                                className="form-input"
                                autoComplete="off"
                                disabled={posting}
                            />
                            {fetching && (
                                <span className="material-symbols-outlined" style={{ fontSize: '14px', position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }}>autorenew</span>
                            )}
                        </div>
                        {suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300,
                                background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
                                borderRadius: '0.6rem', marginTop: '0.25rem', listStyle: 'none', padding: '0.25rem 0',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.35)', maxHeight: '180px', overflowY: 'auto',
                            }}>
                                {suggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => selectCity(s)}
                                        style={{
                                            padding: '0.55rem 0.85rem', cursor: 'pointer',
                                            fontSize: '0.83rem', color: 'var(--text-secondary)',
                                            borderBottom: i < suggestions.length - 1 ? '1px solid var(--glass-border)' : 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(78,205,136,0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {s.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="form-label">Photo (optional)</label>
                        {imageSrc ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={imageSrc}
                                    alt="preview"
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.6rem', border: '1px solid var(--glass-border)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setImageSrc(null)}
                                    style={{
                                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                                        background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                                        width: '28px', height: '28px', cursor: 'pointer', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={posting}
                                style={{
                                    width: '100%', border: '2px dashed var(--glass-border)',
                                    borderRadius: '0.6rem', padding: '1.25rem',
                                    background: 'transparent', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    color: 'var(--text-muted)', fontSize: '0.85rem',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--green)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>add_photo_alternate</span>
                                Add photo evidence
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={posting || caption.trim().length < 10}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem', padding: '0.75rem' }}
                    >
                        {posting ? (
                            <><span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>autorenew</span> Analyzing with AI…</>
                        ) : (
                            <><span className="material-symbols-outlined" style={{ fontSize: '15px' }}>send</span> Submit Alert</>
                        )}
                    </button>

                    {posting && (
                        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                            Gemini AI is verifying this report…
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}
