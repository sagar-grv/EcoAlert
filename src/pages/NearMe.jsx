import React, { useState } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useApp } from '../context/AppContext';
import { haversineDistance } from '../utils/helpers';

export default function NearMe() {
    const { posts, userLocation, setUserLocation } = useApp();
    const [radius, setRadius] = useState(500);
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState(null);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported by your browser.');
            return;
        }
        setDetecting(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setDetecting(false);
            },
            () => {
                // Fallback to Mumbai for demo
                setUserLocation({ lat: 19.076, lng: 72.878 });
                setError('Location permission denied — using Mumbai as default demo location.');
                setDetecting(false);
            }
        );
    };

    const nearbyPosts = userLocation
        ? posts
            .map((p) => ({
                ...p,
                distance: haversineDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng),
            }))
            .filter((p) => p.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
        : [];

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Near Me</div>
                    <div className="page-subtitle">Environmental reports near your location</div>
                </div>
                <MapPin size={18} style={{ color: 'var(--green)', marginLeft: 'auto' }} />
            </div>

            {!userLocation ? (
                <div className="location-prompt">
                    <div className="location-prompt-icon"><Navigation size={28} /></div>
                    <h3>Enable Location Access</h3>
                    <p>Allow location access to see environmental issues near you. Your location is never stored on any server.</p>
                    {error && (
                        <div style={{ color: 'var(--amber)', fontSize: '0.8rem', maxWidth: 320, textAlign: 'center' }}>⚠️ {error}</div>
                    )}
                    <button
                        className="btn-primary"
                        style={{ maxWidth: 240, marginTop: 8 }}
                        onClick={detectLocation}
                        disabled={detecting}
                    >
                        {detecting ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Loader size={15} className="spinning" /> Detecting...</span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Navigation size={15} /> Detect My Location</span>
                        )}
                    </button>
                </div>
            ) : (
                <>
                    {/* Radius Slider */}
                    <div className="radius-slider-wrap">
                        <MapPin size={14} style={{ color: 'var(--green-400)' }} />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Radius:</span>
                        <input
                            type="range"
                            className="radius-slider"
                            min={50}
                            max={2000}
                            step={50}
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        />
                        <span className="radius-label">{radius} km</span>
                        <button
                            className="reset-btn"
                            onClick={() => setUserLocation(null)}
                        >
                            Reset
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: '8px 16px', fontSize: '0.78rem', color: 'var(--amber)', borderBottom: '1px solid var(--border)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="location-info">
                        <MapPin size={13} style={{ color: 'var(--green)' }} />
                        Showing <strong style={{ color: 'var(--text)', marginLeft: 3 }}>{nearbyPosts.length}</strong>&nbsp;reports within {radius} km
                    </div>

                    {nearbyPosts.length === 0 ? (
                        <div className="empty-state">
                            <MapPin size={48} />
                            <h3>No reports nearby</h3>
                            <p>Increase the radius slider or be the first to report an issue in your area!</p>
                        </div>
                    ) : (
                        nearbyPosts.map((post) => (
                            <div key={post.id}>
                                <div style={{ padding: '6px 16px 0 68px', fontSize: '0.74rem', color: 'var(--green)', fontWeight: 700 }}>
                                    📍 {Math.round(post.distance)} km away
                                </div>
                                <PostCard post={post} />
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}
