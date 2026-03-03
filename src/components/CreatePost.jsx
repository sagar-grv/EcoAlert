import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  MapPin,
  Loader,
  CheckCircle,
  Sparkles,
  Image,
  Cpu,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { classifyWithML, ML_CATEGORIES } from "../services/mlService";

const CATEGORIES = ["Air", "Water", "Land", "Wildlife", "Climate", "Disaster"];
const CAT_EMOJI = {
  Air: "💨",
  Water: "💧",
  Land: "🌍",
  Wildlife: "🐾",
  Climate: "🌡️",
  Disaster: "🚨",
};

const INDIAN_CITIES = [
  { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.878 },
  { city: "Delhi", state: "Delhi", lat: 28.614, lng: 77.209 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.972, lng: 77.595 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.083, lng: 80.271 },
  { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.487 },
  { city: "Kolkata", state: "West Bengal", lat: 22.573, lng: 88.364 },
  { city: "Pune", state: "Maharashtra", lat: 18.52, lng: 73.856 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.022, lng: 72.571 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.912, lng: 75.788 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.847, lng: 80.947 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.259, lng: 77.413 },
  { city: "Patna", state: "Bihar", lat: 25.594, lng: 85.138 },
];

export default function CreatePost({ onClose }) {
  const { addPost } = useApp();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Air");
  const [selectedCity, setSelectedCity] = useState(INDIAN_CITIES[0]);
  const [preview, setPreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const fileRef = useRef();
  const debounceRef = useRef();

  // Debounced ML classification as user types
  useEffect(() => {
    if (caption.length < 20) {
      setMlPrediction(null);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setMlLoading(true);
      const result = await classifyWithML(caption, "");
      setMlPrediction(result);
      setMlLoading(false);
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [caption]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setImageSrc(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    addPost({
      caption,
      category,
      imageSrc,
      locationCity: selectedCity.city,
      locationState: selectedCity.state,
      locationLat: selectedCity.lat,
      locationLng: selectedCity.lng,
    });
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
          <span className="modal-title">Report an Issue</span>
        </div>

        {done ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--green)",
            }}
          >
            <CheckCircle size={52} style={{ margin: "0 auto 14px" }} />
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Posted!</div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-sub)",
                marginTop: 6,
              }}
            >
              AI analysis complete — your report is live.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Composer row */}
            <div className="modal-composer">
              <img
                className="modal-avatar"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=EcoUser42"
                alt="You"
              />
              <div className="modal-inputs">
                {/* Caption */}
                <textarea
                  className="caption-input"
                  placeholder="What environmental issue are you reporting?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  autoFocus
                />

                {/* ML Classification Preview */}
                {(mlPrediction || mlLoading) && (
                  <div className="ml-prediction-box">
                    <div className="ml-prediction-header">
                      <Cpu size={14} />
                      <span>ML Classification</span>
                      {mlPrediction?.source === "ml-model" && (
                        <span className="ml-model-badge">TF-IDF + LogReg</span>
                      )}
                    </div>
                    {mlLoading ? (
                      <div className="ml-prediction-loading">
                        <Loader size={14} className="spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      mlPrediction && (
                        <div className="ml-prediction-result">
                          <span
                            className="ml-category-chip"
                            style={{
                              background: `${ML_CATEGORIES[mlPrediction.category]?.color}22`,
                              borderColor:
                                ML_CATEGORIES[mlPrediction.category]?.color,
                              color:
                                ML_CATEGORIES[mlPrediction.category]?.color,
                            }}
                          >
                            {ML_CATEGORIES[mlPrediction.category]?.emoji}{" "}
                            {mlPrediction.label}
                          </span>
                          <span className="ml-confidence">
                            {Math.round(mlPrediction.confidence * 100)}%
                            confidence
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Location row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                    color: "var(--green)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={14} />
                  <select
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--green)",
                      font: "inherit",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    value={selectedCity.city}
                    onChange={(e) => {
                      const found = INDIAN_CITIES.find(
                        (c) => c.city === e.target.value,
                      );
                      if (found) setSelectedCity(found);
                    }}
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option
                        key={c.city}
                        value={c.city}
                        style={{ background: "#1a1a1a", color: "#e7e9ea" }}
                      >
                        {c.city}, {c.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image preview */}
                {preview && (
                  <div className="image-preview" style={{ marginBottom: 10 }}>
                    <img src={preview} alt="Preview" />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => {
                        setPreview(null);
                        setImageSrc(null);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-divider" />

            {/* Category pills */}
            <div
              style={{
                padding: "10px 16px",
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-sub)",
                  marginRight: 4,
                }}
              >
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 999,
                    border: `1px solid ${category === cat ? "var(--green)" : "var(--glass-border)"}`,
                    background:
                      category === cat ? "var(--green)" : "var(--glass)",
                    color: category === cat ? "#fff" : "var(--text-sub)",
                    fontSize: "0.78rem",
                    fontWeight: category === cat ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {CAT_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Toolbar + Post button */}
            <div className="modal-toolbar">
              <div className="toolbar-icons">
                <button
                  type="button"
                  className="toolbar-icon"
                  onClick={() => fileRef.current.click()}
                  title="Add photo"
                >
                  <Image size={18} />
                </button>
                <button
                  type="button"
                  className="toolbar-icon"
                  title="Add location"
                >
                  <MapPin size={18} />
                </button>
                <button
                  type="button"
                  className="toolbar-icon"
                  title="AI analysis"
                >
                  <Sparkles size={18} />
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {caption.length > 0 && (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color:
                        caption.length > 260 ? "var(--red)" : "var(--text-sub)",
                    }}
                  >
                    {280 - caption.length}
                  </span>
                )}
                <button
                  type="submit"
                  className="btn-post"
                  disabled={loading || !caption.trim()}
                >
                  {loading ? (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Loader size={15} className="spinning" /> Analyzing...
                    </span>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </div>

            {/* AI info */}
            <div
              style={{
                margin: "0 16px 16px",
                padding: "10px 14px",
                background: "var(--green-glow)",
                border: "1px solid rgba(0,200,83,0.2)",
                borderRadius: 12,
                fontSize: "0.78rem",
                color: "var(--text-sub)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Sparkles
                size={13}
                style={{ color: "var(--green)", flexShrink: 0 }}
              />
              AI will auto-analyze for{" "}
              <strong style={{ color: "var(--text)" }}>fake news</strong>,{" "}
              <strong style={{ color: "var(--text)" }}>risk level</strong>, and
              generate{" "}
              <strong style={{ color: "var(--text)" }}>
                action suggestions
              </strong>
              .
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </form>
        )}
      </div>
    </div>
  );
}
