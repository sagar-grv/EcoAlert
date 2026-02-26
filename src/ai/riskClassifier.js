// AI Risk Classifier — keyword-to-risk-level engine

const RISK_RULES = [
    {
        level: 'Critical',
        color: '#ef4444',
        bgColor: 'rgba(239,68,68,0.15)',
        emoji: '⛔',
        keywords: [
            'chemical spill', 'toxic waste', 'nuclear', 'radiation', 'gas leak',
            'explosion', 'mass die-off', 'cholera', 'epidemic', 'water poisoning',
            'arsenic', 'cyanide', 'mercury contamination', 'oil spill', 'wildfire',
            'building collapse', 'landslide', 'tsunami', 'earthquake', 'dam break',
        ],
        reason: 'Immediate threat to human life or ecosystem',
    },
    {
        level: 'High',
        color: '#f97316',
        bgColor: 'rgba(249,115,22,0.15)',
        emoji: '🔴',
        keywords: [
            'flood', 'drought', 'pollution', 'smog', 'deforestation', 'sewage',
            'dead fish', 'dead animals', 'air quality index', 'aqi dangerous',
            'illegal dumping', 'factory discharge', 'heavy metal', 'acid rain',
            'river contamination', 'groundwater', 'coral bleaching',
        ],
        reason: 'Significant environmental or health risk requiring urgent attention',
    },
    {
        level: 'Medium',
        color: '#eab308',
        bgColor: 'rgba(234,179,8,0.15)',
        emoji: '🟡',
        keywords: [
            'plastic', 'garbage', 'trash', 'litter', 'waste accumulation', 'smoke',
            'open burning', 'construction waste', 'soil erosion', 'noise pollution',
            'light pollution', 'e-waste', 'overfishing', 'stray animals', 'algae bloom',
        ],
        reason: 'Moderate environmental concern needing community action',
    },
    {
        level: 'Low',
        color: '#22c55e',
        bgColor: 'rgba(34,197,94,0.15)',
        emoji: '🟢',
        keywords: [
            'littering', 'small leak', 'minor', 'awareness', 'tree cutting', 'pet',
            'garden', 'park issue', 'road dust', 'expired product', 'food waste',
        ],
        reason: 'Minor issue that can be resolved with routine community effort',
    },
];

export function classifyRisk(text = '') {
    const lower = text.toLowerCase();

    for (const rule of RISK_RULES) {
        for (const keyword of rule.keywords) {
            if (lower.includes(keyword)) {
                return {
                    level: rule.level,
                    color: rule.color,
                    bgColor: rule.bgColor,
                    emoji: rule.emoji,
                    reason: rule.reason,
                    matchedKeyword: keyword,
                };
            }
        }
    }

    // Default medium for env-sounding posts
    return {
        level: 'Medium',
        color: '#eab308',
        bgColor: 'rgba(234,179,8,0.15)',
        emoji: '🟡',
        reason: 'Risk level undetermined — manual review recommended',
        matchedKeyword: null,
    };
}
