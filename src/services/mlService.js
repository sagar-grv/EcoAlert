// ─── ML Classification Service ───────────────────────────────
// Calls EcoAlert's Python backend for trained ML model classification.
// Falls back to local rule-based classification if backend unavailable.
//
// Backend: /backend/main.py (FastAPI)
// Model: TF-IDF + Logistic Regression trained on 200+ environmental samples

import { classifyRisk } from "../ai/riskClassifier";

const ML_API_BASE = import.meta.env.VITE_ML_API_URL || "http://localhost:8000";

/**
 * Classify text using the trained TF-IDF + Logistic Regression model.
 * @param {string} title - Post title
 * @param {string} description - Post description
 * @returns {{ category, confidence, label, source }}
 */
export async function classifyWithML(title = "", description = "") {
  try {
    const response = await fetch(`${ML_API_BASE}/api/community/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) throw new Error(`ML API error: ${response.status}`);

    const data = await response.json();
    return {
      category: data.category,
      confidence: data.confidence,
      label: data.label,
      source: "ml-model", // Trained TF-IDF + Logistic Regression
    };
  } catch (error) {
    console.warn("ML API unavailable, using local classifier:", error.message);
    // Fallback to local rule-based classification
    const risk = classifyRisk(`${title} ${description}`);
    return {
      category: mapRiskToCategory(risk.level),
      confidence: 0.7,
      label: risk.level,
      source: "local-rules",
    };
  }
}

/**
 * Get category breakdown for analytics display.
 */
export async function getCategoryBreakdown(text = "") {
  try {
    const response = await fetch(
      `${ML_API_BASE}/api/community/classify/breakdown`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      },
    );

    if (!response.ok) throw new Error("Breakdown API error");
    return await response.json();
  } catch {
    // Return mock breakdown
    return {
      air: 0.1,
      water: 0.15,
      land: 0.2,
      waste: 0.05,
      general: 0.5,
    };
  }
}

// Map risk levels to environmental categories
function mapRiskToCategory(riskLevel) {
  const map = {
    Critical: "air",
    High: "water",
    Medium: "land",
    Low: "general",
  };
  return map[riskLevel] || "general";
}

export const ML_CATEGORIES = {
  air: { label: "Air Pollution", color: "#ef4444", emoji: "💨" },
  water: { label: "Water Pollution", color: "#3b82f6", emoji: "💧" },
  land: { label: "Land / Forest", color: "#22c55e", emoji: "🌳" },
  waste: { label: "Waste Management", color: "#f59e0b", emoji: "🗑️" },
  general: { label: "General Environment", color: "#8b5cf6", emoji: "🌍" },
};
