import React, { useState, useEffect } from "react";
import { ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import { fetchEnvironmentNews, NEWS_CATEGORIES } from "../services/newsService";
import { ML_CATEGORIES } from "../services/mlService";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchNews = async () => {
      setLoading(true);
      const category = selectedCategory === "all" ? "" : selectedCategory;
      const news = await fetchEnvironmentNews(category);
      if (!cancelled) {
        setArticles(news);
        setLoading(false);
      }
    };
    fetchNews();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, refreshKey]);

  const loadNews = () => setRefreshKey((k) => k + 1);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">📰 Environmental News</div>
          <div className="page-subtitle">
            AI-curated news with ML classification
          </div>
        </div>
        <button
          onClick={loadNews}
          className="icon-btn"
          style={{ marginLeft: "auto" }}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </div>

      {/* Category Filter */}
      <div className="news-filter-bar">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ML Model Badge */}
      <div className="ml-badge-banner">
        <Sparkles size={16} />
        <span>
          Powered by <strong>TF-IDF + Logistic Regression</strong> ML Model
        </span>
        <span className="ml-badge">scikit-learn</span>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="news-loading">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="news-card skeleton">
              <div className="skeleton-img" />
              <div className="skeleton-text" />
              <div className="skeleton-text short" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "3rem" }}>📰</span>
          <h3>No news found</h3>
          <p>Try selecting a different category or refresh</p>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article) => {
            const mlCat = ML_CATEGORIES[article.mlCategory || article.category];
            return (
              <div key={article.id} className="news-card">
                {article.imageUrl && (
                  <div
                    className="news-card-img"
                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                  />
                )}
                <div className="news-card-content">
                  {/* ML Classification Badge */}
                  <div className="news-card-badges">
                    <span
                      className="ml-category-badge"
                      style={{
                        background: `${mlCat?.color}22`,
                        borderColor: mlCat?.color,
                        color: mlCat?.color,
                      }}
                    >
                      {mlCat?.emoji} {mlCat?.label}
                      <span className="confidence">
                        {Math.round((article.mlConfidence || 0) * 100)}%
                      </span>
                      {article.mlSource === "ml-model" && (
                        <span className="ml-source-tag">ML</span>
                      )}
                    </span>
                    <span className="news-source">{article.source}</span>
                  </div>

                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-desc">{article.description}</p>

                  {/* AI Summary & Actions */}
                  {article.aiSummary && (
                    <div className="ai-summary-box">
                      <div className="ai-summary-header">
                        <Sparkles size={14} />
                        <span>AI Summary</span>
                      </div>
                      <p>{article.aiSummary}</p>
                      {article.aiActions && (
                        <div className="ai-actions">
                          <strong>Suggested Actions:</strong>
                          <ul>
                            {article.aiActions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="news-card-footer">
                    <span className="news-date">
                      {formatDate(article.publishedAt)}
                    </span>
                    {article.url && article.url !== "#" && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-more-btn"
                      >
                        Read More <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
