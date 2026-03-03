// ─── Gemini AI Service ───────────────────────────────────────
// Uses Gemini 1.5 Flash for post analysis.
// Falls back to rule-based engine if API key not set.

import { detectFakeNews } from '../ai/fakeNewsDetector';
import { classifyRisk } from '../ai/riskClassifier';
import { getSuggestions } from '../ai/suggestionEngine';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_ENABLED = !!GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyse environmental post using Gemini 2.0 Flash.
 * Falls back to rule-based engine if API key missing.
 *
 * @param {string} caption - Post text
 * @param {string|null} imageBase64 - Base64 image for multimodal analysis
 * @param {string} category - Post category
 * @returns {{ fakeNews, risk, impact, suggestions, imageVerification }}
 */
export async function analyzePost(caption = '', imageBase64 = null, category = 'Climate') {
  if (!GEMINI_ENABLED) {
    // Graceful fallback to local rule-based AI
    const fakeNews = detectFakeNews(caption, !!imageBase64);
    const risk = classifyRisk(caption);
    const suggestions = getSuggestions(category, risk.level);
    const impact = { score: risk.level === 'Critical' ? 90 : risk.level === 'High' ? 70 : 40, description: risk.reason || 'Potential issue' };
    const imageVerification = { verified: true, confidence: 100, message: "Local fallback bypass" };
    return { fakeNews, risk, impact, suggestions, imageVerification, source: 'local' };
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
  "impact": {
    "score": <number 1-100, where 100 is severe environmental impact>,
    "description": "<one very short descriptive phrase (e.g., 'Severe deforestation', 'Minor noise pollution')>"
  },
  "suggestions": [
    "<actionable suggestion 1 with emoji>",
    "<actionable suggestion 2 with emoji>",
    "<actionable suggestion 3 with emoji>"
  ],
  "imageVerification": {
    "verified": <boolean, true if the provided image content directly correlates with the environmental incident described in the caption. Return true if no image is provided>,
    "confidence": <number 0-100, your confidence that the image is a genuine representation of the described event and not a generic or mismatched file>,
    "message": "<short one-line sentence explaining your visual verification (mention specific details seen in the image) or stating no image provided>"
  }
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
    const impact = { score: risk.level === 'Critical' ? 90 : risk.level === 'High' ? 70 : 40, description: risk.reason || 'Potential issue' };
    return { fakeNews, risk, impact, suggestions, source: 'local-fallback' };
  }
}

/**
 * Auto-categorize environmental post using Gemini 1.5 Flash.
 * Falls back to simple rule-based categorization if API key missing.
 *
 * @param {string} caption - Post text
 * @param {string|null} imageBase64 - Base64 image
 * @returns {Promise<string>} Category name
 */
export async function autoCategorizePost(caption = '', imageBase64 = null) {
  const validCategories = ['Air', 'Water', 'Land', 'Wildlife', 'Climate', 'Disaster'];

  if (!GEMINI_ENABLED) {
    // Fallback simple rule based categorizer
    const lower = caption.toLowerCase();
    if (lower.match(/smoke|smog|pollution|air|aqi/)) return 'Air';
    if (lower.match(/water|river|lake|flood|ocean/)) return 'Water';
    if (lower.match(/trash|garbage|soil|land|deforestation/)) return 'Land';
    if (lower.match(/animal|wildlife|bird|tiger|elephant/)) return 'Wildlife';
    if (lower.match(/heat|weather|storm|climate/)) return 'Climate';
    if (lower.match(/earthquake|tsunami|disaster|fire/)) return 'Disaster';
    return 'Climate'; // default fallback
  }

  try {
    const prompt = `You are an AI that categorizes environmental incident reports in India.
Caption: "${caption}"
Categorize this report into EXACTLY ONE of the following categories: Air, Water, Land, Wildlife, Climate, Disaster.
Return ONLY the category name as plain text.`;

    const parts = [{ text: prompt }];

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
        generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const recognized = validCategories.find(c => text.toLowerCase().includes(c.toLowerCase()));
    return recognized || 'Climate';

  } catch (err) {
    console.warn('Gemini categorization failed, using fallback:', err.message);
    return 'Climate';
  }
}
