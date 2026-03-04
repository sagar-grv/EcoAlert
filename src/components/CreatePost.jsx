import React, { useState, useRef } from 'react';
import { X, Upload, MapPin, Loader, CheckCircle, Sparkles, Image, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { autoCategorizePost } from '../services/geminiService';
import { compressImage, formatBytes } from '../utils/helpers';

const CATEGORIES = ['Air', 'Water', 'Land', 'Wildlife', 'Climate', 'Disaster'];
const CAT_EMOJI = { Air: '💨', Water: '💧', Land: '🌍', Wildlife: '🐾', Climate: '🌡️', Disaster: '🚨' };

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function CreatePost({ onClose }) {
    const { addPost, showToast } = useApp();
    const { user } = useAuth();
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Air');
    const [locationInfo, setLocationInfo] = useState({
        city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.878,
    });
    const [preview, setPreview] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [done, setDone] = useState(false);
    const fileRef = useRef();

    // ── Handle image selection with compression ──────────────
    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            showToast(`File too large (${formatBytes(file.size)}). Max 5 MB.`, 'error');
            return;
        }

        try {
            const result = await compressImage(file, 1200, 0.8);
            setPreview(result.dataUrl);
            setImageSrc(result.dataUrl);
            setCompressedFile(new File([result.blob], file.name, { type: 'image/jpeg' }));
            setFileInfo({
                original: result.originalSize,
                compressed: result.compressedSize,
                saved: Math.round((1 - result.compressedSize / result.originalSize) * 100),
            });
        } catch {
            // Fallback: use original file
            const reader = new FileReader();
            reader.onload = (ev) => { setPreview(ev.target.result); setImageSrc(ev.target.result); };
            reader.readAsDataURL(file);
            setCompressedFile(file);
            setFileInfo({ original: file.size, compressed: file.size, saved: 0 });
        }
    };

    // ── Detect location ──────────────────────────────────────
    const handleDetectLocation = async () => {
        if (!navigator.geolocation) {
            showToast('Geolocation not supported in your browser', 'error');
            return;
        }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    setLocationInfo({
                        city: data.address?.city || data.address?.town || data.address?.village || 'Detected',
                        state: data.address?.state || '',
                        lat: latitude,
                        lng: longitude,
                    });
                    showToast(`📍 Location: ${data.address?.city || data.address?.town || 'Detected'}`);
                } catch {
                    setLocationInfo({ city: 'Detected', state: '', lat: latitude, lng: longitude });
                }
                setDetectingLocation(false);
            },
            () => {
                showToast('Location access denied', 'error');
                setDetectingLocation(false);
            },
            { timeout: 10000 }
        );
    };

    const handleAutoCategorize = async () => {
        if (!caption.trim() && !imageSrc) {
            showToast('Please add text or an image first to auto-categorize.', 'info');
            return;
        }
        setIsCategorizing(true);
        try {
            const detectedCategory = await autoCategorizePost(caption, imageSrc);
            setCategory(detectedCategory);
            showToast(`AI Categorized as: ${detectedCategory}`);
        } catch (err) {
            console.error(err);
            showToast('AI Categorization failed.', 'error');
        } finally {
            setIsCategorizing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption.trim()) return;
        setLoading(true);

        await addPost({
            caption,
            category,
            imageSrc,
            locationCity: locationInfo.city,
            locationState: locationInfo.state,
            locationLat: locationInfo.lat,
            locationLng: locationInfo.lng,
        }, compressedFile || (fileRef.current?.files?.[0] || null));

        setLoading(false);
        setDone(true);
        setTimeout(onClose, 1200);
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">

                {/* Header */}
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}><X size={18} /></button>
                    <span className="modal-title">Report an Issue</span>
                </div>

                {done ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--green)' }}>
                        <CheckCircle size={52} style={{ margin: '0 auto 14px' }} />
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Posted!</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-sub)', marginTop: 6 }}>
                            AI analysis complete — your report is live.
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Composer row */}
                        <div className="modal-composer">
                            <img
                                className="modal-avatar"
                                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.uid || user?.name || 'eco')}`}
                                alt="You"
                            />
                            <div className="modal-inputs">
                                {/* Caption */}
                                <textarea
                                    className="caption-input"
                                    placeholder="What environmental issue are you reporting?"
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    maxLength={500}
                                    autoFocus
                                />

                                {/* Location row */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    marginBottom: 10, color: 'var(--green)', fontSize: '0.875rem', fontWeight: 600,
                                }}>
                                    <MapPin size={14} />
                                    <span>{locationInfo.city}{locationInfo.state ? `, ${locationInfo.state}` : ''}</span>
                                    <button
                                        type="button"
                                        onClick={handleDetectLocation}
                                        disabled={detectingLocation}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4,
                                            fontSize: '0.78rem', marginLeft: 8, padding: '2px 8px',
                                            borderRadius: 999, border: '1px solid rgba(0,200,83,0.3)',
                                        }}
                                    >
                                        {detectingLocation ? <Loader size={12} className="spinning" /> : <Navigation size={12} />}
                                        {detectingLocation ? 'Detecting...' : 'Detect'}
                                    </button>
                                </div>

                                {/* Image preview */}
                                {preview && (
                                    <div className="image-preview" style={{ marginBottom: 10 }}>
                                        <img src={preview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="image-remove-btn"
                                            onClick={() => { setPreview(null); setImageSrc(null); setCompressedFile(null); setFileInfo(null); }}
                                        >✕</button>
                                        {fileInfo && fileInfo.saved > 0 && (
                                            <div style={{
                                                position: 'absolute', bottom: 8, left: 8, padding: '2px 8px',
                                                background: 'rgba(0,0,0,0.7)', borderRadius: 6, fontSize: '0.7rem',
                                                color: '#00c853',
                                            }}>
                                                {formatBytes(fileInfo.compressed)} (-{fileInfo.saved}%)
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-divider" />

                        {/* Category pills */}
                        <div style={{ padding: '10px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginRight: 4 }}>Category:</span>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: 999,
                                        border: `1px solid ${category === cat ? 'var(--green)' : 'var(--glass-border)'}`,
                                        background: category === cat
                                            ? 'var(--green)'
                                            : 'var(--glass)',
                                        color: category === cat ? '#fff' : 'var(--text-sub)',
                                        fontSize: '0.78rem',
                                        fontWeight: category === cat ? 700 : 400,
                                        cursor: 'pointer',
                                        transition: 'all 0.18s',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {CAT_EMOJI[cat]} {cat}
                                </button>
                            ))}
                        </div>

                        {/* Toolbar + Post button */}
                        <div className="modal-toolbar">
                            <div className="toolbar-icons">
                                <button type="button" className="toolbar-icon" onClick={() => fileRef.current.click()} title="Add photo">
                                    <Image size={18} />
                                </button>
                                <button type="button" className="toolbar-icon" onClick={handleDetectLocation} title="Detect location" disabled={detectingLocation}>
                                    <MapPin size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="toolbar-icon"
                                    title="Auto Categorize via AI"
                                    onClick={handleAutoCategorize}
                                    disabled={isCategorizing}
                                    style={{ color: isCategorizing ? 'var(--green)' : '' }}
                                >
                                    <Sparkles size={18} className={isCategorizing ? "spinning" : ""} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {caption.length > 0 && (
                                    <span style={{
                                        fontSize: '0.82rem',
                                        color: caption.length > 450 ? 'var(--red)' : 'var(--text-sub)',
                                    }}>
                                        {500 - caption.length}
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className="btn-post"
                                    disabled={loading || !caption.trim()}
                                >
                                    {loading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Loader size={15} className="spinning" /> Analyzing...
                                        </span>
                                    ) : 'Post'}
                                </button>
                            </div>
                        </div>

                        {/* AI info */}
                        <div style={{
                            margin: '0 16px 16px',
                            padding: '10px 14px',
                            background: 'var(--green-glow)',
                            border: '1px solid rgba(0,200,83,0.2)',
                            borderRadius: 12,
                            fontSize: '0.78rem',
                            color: 'var(--text-sub)',
                            display: 'flex', gap: 8, alignItems: 'center',
                        }}>
                            <Sparkles size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                            AI will auto-analyze for <strong style={{ color: 'var(--text)' }}>fake news</strong>,{' '}
                            <strong style={{ color: 'var(--text)' }}>risk level</strong>, and generate{' '}
                            <strong style={{ color: 'var(--text)' }}>action suggestions</strong>.
                        </div>

                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                    </form>
                )}
            </div>
        </div>
    );
}
