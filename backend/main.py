"""
EcoAlert ML API Server
FastAPI backend serving the TF-IDF + Logistic Regression classifier.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK data
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

app = FastAPI(
    title="EcoAlert ML API",
    description="Environmental news classification using TF-IDF + Logistic Regression",
    version="1.0.0",
)

# CORS - allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ML Model Loading ─────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "model.joblib")
_model = None
_lemmatizer = WordNetLemmatizer()
_stop_words = set(stopwords.words("english"))

CATEGORY_LABELS = {
    "air": "Air Pollution",
    "water": "Water Pollution",
    "land": "Land / Forest",
    "waste": "Waste Management",
    "general": "General Environment",
}


def _clean_text(text: str) -> str:
    """NLP preprocessing matching training pipeline."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    tokens = text.split()
    tokens = [_lemmatizer.lemmatize(t) for t in tokens if t not in _stop_words and len(t) > 2]
    return " ".join(tokens)


def _load_model():
    """Lazy-load the trained model."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Please run: python ml/train.py"
            )
        _model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded from {MODEL_PATH}")
    return _model


# ─── Request/Response Models ──────────────────────────────────────────────────
class ClassifyRequest(BaseModel):
    title: str = ""
    description: str = ""


class ClassifyResponse(BaseModel):
    category: str
    confidence: float
    label: str


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "EcoAlert ML API",
        "version": "1.0.0",
        "model": "TF-IDF + Logistic Regression",
        "categories": list(CATEGORY_LABELS.keys()),
        "status": "running",
    }


@app.get("/health")
async def health():
    model_exists = os.path.exists(MODEL_PATH)
    return {"status": "healthy" if model_exists else "model_missing", "model_path": MODEL_PATH}


@app.post("/api/classify", response_model=ClassifyResponse)
async def classify(request: ClassifyRequest):
    """
    Classify environmental text into category.
    Returns category, confidence score, and label.
    """
    model = _load_model()
    
    combined = f"{request.title} {request.description}".strip()
    cleaned = _clean_text(combined)
    
    if not cleaned:
        return ClassifyResponse(
            category="general",
            confidence=0.5,
            label="General Environment"
        )
    
    # Get prediction with probabilities
    proba = model.predict_proba([cleaned])[0]
    classes = model.classes_
    best_idx = proba.argmax()
    category = classes[best_idx]
    confidence = float(proba[best_idx])
    
    return ClassifyResponse(
        category=category,
        confidence=round(confidence, 4),
        label=CATEGORY_LABELS.get(category, category),
    )


# Also support the Service_Sense endpoint format for compatibility
@app.post("/api/community/classify", response_model=ClassifyResponse)
async def classify_community(request: ClassifyRequest):
    """Alias endpoint for Service_Sense compatibility."""
    return await classify(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
