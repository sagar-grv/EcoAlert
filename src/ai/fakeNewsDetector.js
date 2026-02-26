// AI Fake News Detector — rule-based scoring engine
const SENSATIONAL_WORDS = [
    'shocking', 'unbelievable', 'you won\'t believe', 'breaking', 'exclusive',
    'secret', 'conspiracy', 'hoax', 'lies', 'fraud', 'cover-up', 'exposed',
    'viral', 'panic', 'apocalypse', 'end of world', 'catastrophic', 'mindblowing',
];

const CREDIBLE_WORDS = [
    'study', 'research', 'survey', 'report', 'data', 'scientists', 'government',
    'official', 'confirmed', 'verified', 'measured', 'monitored', 'analysis',
    'according to', 'published', 'evidence', 'recorded', 'observed',
];

const ENVIRONMENTAL_KEYWORDS = [
    'pollution', 'emission', 'flood', 'drought', 'wildfire', 'earthquake', 'chemical',
    'toxic', 'waste', 'deforestation', 'oil spill', 'plastic', 'sewage', 'smog',
    'air quality', 'water contamination', 'soil erosion', 'landslide', 'biodiversity',
];

export function detectFakeNews(text = '', hasImage = false) {
    const lower = text.toLowerCase();

    let score = 60; // base neutral score

    // Penalize sensational language
    SENSATIONAL_WORDS.forEach((word) => {
        if (lower.includes(word)) score -= 12;
    });

    // Reward credible/factual language
    CREDIBLE_WORDS.forEach((word) => {
        if (lower.includes(word)) score += 8;
    });

    // Reward environmental specificity
    ENVIRONMENTAL_KEYWORDS.forEach((word) => {
        if (lower.includes(word)) score += 5;
    });

    // Reward image presence
    if (hasImage) score += 15;

    // Penalize very short text (low effort posts)
    if (text.length < 30) score -= 20;
    if (text.length > 100) score += 8;

    // Clamp 0–100
    score = Math.max(5, Math.min(100, score));

    let label, color;
    if (score >= 80) { label = 'Verified'; color = '#22c55e'; }
    else if (score >= 60) { label = 'Likely True'; color = '#84cc16'; }
    else if (score >= 40) { label = 'Unverified'; color = '#f59e0b'; }
    else { label = 'Suspicious'; color = '#ef4444'; }

    return { score: Math.round(score), label, color };
}
