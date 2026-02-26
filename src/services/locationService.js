// ─── Location Service (OpenStreetMap Nominatim) ───────────
// Free, no API key. Rate limit: 1 req/sec (enforced by 600ms debounce on callers).

const BASE = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'Accept-Language': 'en', 'User-Agent': 'EcoAlert/1.0 (ecoalert-india)' };

/* ── City autocomplete search (India only) ── */
export async function searchCity(query) {
    if (!query || query.length < 2) return [];

    try {
        const url = `${BASE}/search?q=${encodeURIComponent(query)}&countrycodes=in&featuretype=city&format=json&addressdetails=1&limit=8`;
        const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        return data
            .filter(p => p.address && (p.address.city || p.address.town || p.address.village || p.address.county))
            .map(p => ({
                displayName: p.display_name,
                city: p.address.city || p.address.town || p.address.village || p.address.county || query,
                state: p.address.state || '',
                lat: parseFloat(p.lat),
                lng: parseFloat(p.lon),
            }))
            .filter((v, i, arr) => arr.findIndex(x => x.city === v.city && x.state === v.state) === i) // dedupe
            .slice(0, 6);
    } catch (err) {
        console.warn('[Location] searchCity failed:', err.message);
        return [];
    }
}

/* ── Reverse geocode lat/lng → city & state ── */
export async function reverseGeocode(lat, lng) {
    try {
        const url = `${BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
        const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const addr = data?.address || {};

        return {
            city: addr.city || addr.town || addr.village || addr.county || 'Unknown',
            state: addr.state || '',
            district: addr.county || addr.district || '',
            pincode: addr.postcode || '',
        };
    } catch (err) {
        console.warn('[Location] reverseGeocode failed:', err.message);
        return { city: 'Unknown', state: '', district: '', pincode: '' };
    }
}

/* ── Get nearby environmental news for a location (uses OpenAQ-style fallback) ── */
export async function getNearbyPlaceName(lat, lng) {
    const result = await reverseGeocode(lat, lng);
    return result.city !== 'Unknown'
        ? `${result.city}, ${result.state}`
        : `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
}
