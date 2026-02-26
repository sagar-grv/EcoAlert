// ─── Gemini 1.5 Flash AI Service ──────────────────────────
// Replaces all three keyword-based AI files with real Gemini intelligence.
// Falls back to keyword-based logic if the API call fails.

import { detectFakeNews } from '../ai/fakeNewsDetector';
import { classifyRisk } from '../ai/riskClassifier';
import { getSuggestions } from '../ai/suggestionEngine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

/* ── Structured prompt ── */
function buildPrompt(caption, category, hasImage) {
    return `You are an AI assistant for EcoAlert, an environmental reporting platform in India.

Analyze this user-submitted environmental report and return a JSON object with exactly these fields:

Caption: "${caption}"
Category: ${category}
Has Image: ${hasImage}

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "fakeNews": {
    "score": <integer 0-100, higher = more credible>,
    "label": <one of: "Verified", "Likely True", "Unverified", "Suspicious">,
    "color": <hex color: #22c55e for Verified, #84cc16 for Likely True, #f59e0b for Unverified, #ef4444 for Suspicious>
  },
  "risk": {
    "level": <one of: "Critical", "High", "Medium", "Low">,
    "color": <hex: #ef4444 Critical, #f97316 High, #eab308 Medium, #22c55e Low>,
    "bgColor": <rgba version with 0.15 opacity>,
    "emoji": <one of: "⛔" "🔴" "🟡" "🟢">,
    "reason": <1 sentence explanation in English>
  },
  "suggestions": [
    <3-5 specific, actionable suggestions for Indian context, each starting with an emoji>
  ],
  "aiInsight": <2-3 sentence expert environmental analysis of this specific report>
}`;
}

/* ── Main export ── */
export async function analyzePost(caption = '', category = 'Climate', hasImage = false) {
    if (!API_KEY) {
        console.warn('[Gemini] No API key — using keyword fallback');
        return keywordFallback(caption, category, hasImage);
    }

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(caption, category, hasImage) }] }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.3,
                    maxOutputTokens: 800,
                },
            }),
            signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) {
            console.error('[Gemini] HTTP', res.status, await res.text());
            return keywordFallback(caption, category, hasImage);
        }

        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) return keywordFallback(caption, category, hasImage);

        const parsed = JSON.parse(raw);

        // Sanity check required fields
        if (!parsed.fakeNews || !parsed.risk || !parsed.suggestions) {
            throw new Error('Malformed Gemini response');
        }

        return {
            fakeNews: parsed.fakeNews,
            risk: { ...parsed.risk, matchedKeyword: null },
            suggestions: parsed.suggestions,
            aiInsight: parsed.aiInsight || '',
            source: 'gemini',
        };
    } catch (err) {
        console.error('[Gemini] Error, falling back to keywords:', err.message);
        return keywordFallback(caption, category, hasImage);
    }
}

/* ── Keyword fallback (keeps existing behaviour) ── */
function keywordFallback(caption, category, hasImage) {
    const fakeNews = detectFakeNews(caption, hasImage);
    const risk = classifyRisk(caption);
    const suggestions = getSuggestions(category, risk.level);
    return { fakeNews, risk, suggestions, aiInsight: '', source: 'fallback' };
}
