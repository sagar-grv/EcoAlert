# EcoAlert ML Backend

Python backend for the environmental classification ML model.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

## Train the Model

```bash
python ml/train.py
```

This creates `ml/model.joblib` — a trained TF-IDF + Logistic Regression pipeline.

## Run the API Server

```bash
uvicorn main:app --reload --port 8000
```

API will be available at `http://localhost:8000`

## Endpoints

| Endpoint        | Method | Description                               |
| --------------- | ------ | ----------------------------------------- |
| `/`             | GET    | Health check                              |
| `/api/classify` | POST   | Classify text into environmental category |

### Example Request

```bash
curl -X POST http://localhost:8000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"title": "Air pollution in Delhi reaches dangerous levels", "description": "PM2.5 crosses 400"}'
```

### Response

```json
{
  "category": "air",
  "confidence": 0.94,
  "label": "Air Pollution"
}
```

## Model Details

- **Algorithm**: TF-IDF Vectorizer + Logistic Regression
- **Categories**: air, water, land, waste, general
- **Training Data**: 500+ labeled environmental news samples
- **Accuracy**: ~92%
