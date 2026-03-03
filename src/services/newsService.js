// ─── News Service ─────────────────────────────────────────────
// Fetches environmental news and classifies using EcoAlert's ML backend.
// Falls back to mock news with ML classification when APIs unavailable.

import { classifyWithML } from "./mlService";

const ML_API_BASE = import.meta.env.VITE_ML_API_URL || "http://localhost:8000";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/everything";

/**
 * Fetch news from Service_Sense backend (preferred).
 */
export async function fetchNewsFromBackend(category = "", locality = "") {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (locality) params.append("locality", locality);

    const response = await fetch(`${ML_API_BASE}/api/news?${params}`);
    if (!response.ok) throw new Error("Backend news fetch failed");

    const data = await response.json();
    return data.articles || data;
  } catch (error) {
    console.warn("Backend news unavailable:", error.message);
    return null;
  }
}

/**
 * Fetch news directly from NewsAPI (fallback).
 */
export async function fetchNewsFromAPI(category = "") {
  if (!NEWS_API_KEY) {
    console.warn("No NewsAPI key, returning mock news");
    return getMockNews(category);
  }

  const categoryQueries = {
    air: "air pollution OR smog OR AQI India",
    water: "water pollution OR river contamination India",
    land: "deforestation OR forest fire India",
    waste: "plastic waste OR recycling India",
    climate: "climate change OR global warming India",
    wildlife: "wildlife conservation OR endangered species India",
  };

  const query = categoryQueries[category] || "environment pollution India";

  try {
    const response = await fetch(
      `${NEWS_API_URL}?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`,
    );

    if (!response.ok) throw new Error("NewsAPI fetch failed");

    const data = await response.json();
    return data.articles.map(transformArticle);
  } catch (error) {
    console.warn("NewsAPI error:", error.message);
    return getMockNews(category);
  }
}

/**
 * Main news fetch function - tries backend first, then direct API.
 * Auto-classifies all articles using the ML model.
 */
export async function fetchEnvironmentNews(category = "", locality = "") {
  // Try backend first (has ML classification + AI summaries)
  const backendNews = await fetchNewsFromBackend(category, locality);
  if (backendNews && backendNews.length > 0) {
    return backendNews;
  }

  // Fallback to direct NewsAPI or mock
  const articles = await fetchNewsFromAPI(category);

  // Auto-classify articles that don't have mlCategory
  const classifiedArticles = await Promise.all(
    articles.map(async (article) => {
      if (article.mlCategory) return article; // Already classified

      try {
        const result = await classifyWithML(
          article.title,
          article.description || "",
        );
        return {
          ...article,
          mlCategory: result.category,
          mlConfidence: result.confidence,
          mlSource: result.source,
        };
      } catch {
        return {
          ...article,
          mlCategory: article.category || "general",
          mlConfidence: 0.7,
        };
      }
    }),
  );

  return classifiedArticles;
}

/**
 * Transform NewsAPI article format.
 */
function transformArticle(article) {
  return {
    id: article.url,
    title: article.title,
    description: article.description,
    source: article.source?.name || "Unknown",
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    category: "general", // Will be classified by ML
  };
}

/**
 * Mock news for demo when APIs unavailable.
 */
function getMockNews(category = "") {
  const mockArticles = [
    {
      id: "1",
      title: "Delhi AQI Crosses 400: Government Issues Health Advisory",
      description:
        "Air quality in Delhi NCR reached hazardous levels as PM2.5 concentrations spiked due to crop stubble burning and vehicular emissions.",
      source: "Times of India",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
      publishedAt: new Date().toISOString(),
      category: "air",
      mlConfidence: 0.94,
      aiSummary:
        "Delhi faces severe air pollution crisis with AQI exceeding 400. Authorities advise staying indoors and using N95 masks.",
      aiActions: [
        "Wear N95 masks outdoors",
        "Use air purifiers indoors",
        "Report pollution sources",
      ],
    },
    {
      id: "2",
      title: "Yamuna River Pollution Reaches Critical Levels Before Festivals",
      description:
        "Industrial discharge and untreated sewage have caused oxygen levels in Yamuna to drop drastically, killing aquatic life.",
      source: "Hindustan Times",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      category: "water",
      mlConfidence: 0.91,
      aiSummary:
        "Yamuna river faces severe pollution with dangerously low oxygen levels threatening aquatic ecosystems.",
      aiActions: [
        "Avoid using river water",
        "Report illegal discharge",
        "Support river cleaning drives",
      ],
    },
    {
      id: "3",
      title: "Forest Fire in Uttarakhand Destroys 500 Hectares of Pine Forest",
      description:
        "Uncontrolled wildfires spread across Kumaon region, threatening wildlife and nearby villages. NDRF deployed.",
      source: "Indian Express",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      category: "land",
      mlConfidence: 0.88,
      aiSummary:
        "Massive wildfire in Uttarakhand destroys pine forests. Emergency services working to contain spread.",
      aiActions: [
        "Report fire sightings immediately",
        "Support forest restoration",
        "Avoid visiting affected areas",
      ],
    },
    {
      id: "4",
      title: "Mumbai Generates 11,000 Tonnes of Plastic Waste Daily",
      description:
        "New study reveals alarming levels of single-use plastic consumption in Mumbai, with only 30% being recycled properly.",
      source: "Deccan Herald",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      category: "waste",
      mlConfidence: 0.92,
      aiSummary:
        "Mumbai struggles with massive plastic waste generation. Recycling infrastructure needs urgent expansion.",
      aiActions: [
        "Reduce single-use plastics",
        "Segregate waste properly",
        "Join local cleanup drives",
      ],
    },
    {
      id: "5",
      title: "Bengal Tiger Population Increases by 6% in Sundarbans",
      description:
        "Annual census shows positive trend in tiger conservation efforts. Community involvement credited for success.",
      source: "The Hindu",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=400",
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      category: "wildlife",
      mlConfidence: 0.89,
      aiSummary:
        "Good news for conservation as Sundarbans tiger population shows growth. Community efforts prove effective.",
      aiActions: [
        "Support wildlife conservation",
        "Report poaching activities",
        "Spread awareness",
      ],
    },
    {
      id: "6",
      title: "India Commits to Net Zero by 2070 at Climate Summit",
      description:
        "Prime Minister announces ambitious climate targets including 500 GW renewable energy capacity by 2030.",
      source: "Economic Times",
      url: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
      publishedAt: new Date(Date.now() - 432000000).toISOString(),
      category: "climate",
      mlConfidence: 0.95,
      aiSummary:
        "India sets ambitious net-zero target for 2070 with major renewable energy expansion plans.",
      aiActions: [
        "Adopt solar energy at home",
        "Reduce carbon footprint",
        "Support green policies",
      ],
    },
  ];

  if (category) {
    return mockArticles.filter((a) => a.category === category);
  }
  return mockArticles;
}

export const NEWS_CATEGORIES = [
  { id: "all", label: "All News", emoji: "📰" },
  { id: "air", label: "Air Quality", emoji: "💨" },
  { id: "water", label: "Water", emoji: "💧" },
  { id: "land", label: "Land & Forest", emoji: "🌳" },
  { id: "waste", label: "Waste", emoji: "🗑️" },
  { id: "wildlife", label: "Wildlife", emoji: "🐯" },
  { id: "climate", label: "Climate", emoji: "🌡️" },
];
