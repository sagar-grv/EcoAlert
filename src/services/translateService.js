// ─── Translation Service (MyMemory free API) ──────────────
// MyMemory is Google-backed, free up to 1000 req/day, no key needed.
// Translations are cached in localStorage to avoid re-fetching.

const CACHE_KEY = 'eco_translate_cache';
const MAX_CACHE = 500; // max entries before LRU eviction

/* ── Load / persist cache ── */
function loadCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch { return {}; }
}

function saveCache(cache) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { }
}

/* ── Main translate function ── */
export async function translateText(text, targetLang) {
    if (!text || targetLang === 'en') return text;

    const cacheKey = `${targetLang}:${text}`;
    const cache = loadCache();

    if (cache[cacheKey]) return cache[cacheKey];

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=ecoalert@example.com`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const translated = data?.responseData?.translatedText;

        if (!translated || data?.responseStatus !== 200) throw new Error('Bad response');

        // Evict oldest if cache full
        const keys = Object.keys(cache);
        if (keys.length >= MAX_CACHE) delete cache[keys[0]];

        cache[cacheKey] = translated;
        saveCache(cache);
        return translated;
    } catch (err) {
        console.warn('[Translate] Failed:', err.message);
        return text; // return original on failure
    }
}

/* ── Batch translate multiple strings at once ── */
export async function translateBatch(entries, targetLang) {
    if (targetLang === 'en') return entries;
    return Promise.all(entries.map(text => translateText(text, targetLang)));
}

/* ── Clear translation cache ── */
export function clearTranslateCache() {
    localStorage.removeItem(CACHE_KEY);
}
