// ─── Gemini AI Service ───────────────────────────────────────
// Uses Gemini 1.5 Flash for post analysis.
// Falls back to rule-based engine if API key not set.

import { detectFakeNews } from '../ai/fakeNewsDetector';
import { classifyRisk } from '../ai/riskClassifier';
import { getSuggestions } from '../ai/suggestionEngine';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_ENABLED = !!GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyse environmental post using Gemini 1.5 Flash.
 * Falls back to rule-based engine if API key missing.
 *
 * @param {string} caption - Post text
 * @param {string|null} imageBase64 - Base64 image for multimodal analysis
 * @param {string} category - Post category
 * @returns {{ fakeNews, risk, suggestions }}
 */
export async function analyzePost(caption = '', imageBase64 = null, category = 'Climate') {
    if (!GEMINI_ENABLED) {
        // Graceful fallback to local rule-based AI
        const fakeNews = detectFakeNews(caption, !!imageBase64);
        const risk = classifyRisk(caption);
        const suggestions = getSuggestions(category, risk.level);
        return { fakeNews, risk, suggestions, source: 'local' };
    }

    try {
        const prompt = `You are an AI assistant for EcoAlert, an environmental reporting platform in India.

Analyze this environmental report:
"${caption}"

Respond ONLY with valid JSON in this exact format:
{
  "fakeNews": {
    "score": <number 0-100, where 100 = fully credible>,
    "label": "<one of: Verified | Likely True | Unverified | Suspicious>",
    "color": "<hex color matching label>"
  },
  "risk": {
    "level": "<one of: Critical | High | Medium | Low>",
    "color": "<hex color>",
    "bgColor": "<rgba color>",
    "emoji": "<single emoji>",
    "reason": "<one-line explanation>"
  },
  "suggestions": [
    "<actionable suggestion 1 with emoji>",
    "<actionable suggestion 2 with emoji>",
    "<actionable suggestion 3 with emoji>"
  ]
}

Color guide: Critical=#ef4444, High=#f97316, Medium=#eab308, Low=#22c55e
For fake news: Verified=#22c55e, Likely True=#84cc16, Unverified=#f59e0b, Suspicious=#ef4444`;

        const parts = [{ text: prompt }];

        // Add image if available (multimodal analysis)
        if (imageBase64) {
            const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
            const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
            parts.push({ inlineData: { mimeType, data: base64Data } });
        }

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
            }),
        });

        if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in Gemini response');

        const result = JSON.parse(jsonMatch[0]);
        return { ...result, source: 'gemini' };

    } catch (err) {
        console.warn('Gemini analysis failed, using fallback:', err.message);
        // Fallback to local rule-based engine
        const fakeNews = detectFakeNews(caption, !!imageBase64);
        const risk = classifyRisk(caption);
        const suggestions = getSuggestions(category, risk.level);
        return { fakeNews, risk, suggestions, source: 'local-fallback' };
    }
}
