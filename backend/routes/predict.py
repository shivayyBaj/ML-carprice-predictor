import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException

from models.schemas import PredictRequest, PredictResponse

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model.pkl"
ANALYTICS_PATH = BASE_DIR / "analytics_data.json"

_artifact = None
_analytics = None


def load_artifact():
    global _artifact
    if _artifact is None:
        if not MODEL_PATH.exists():
            raise HTTPException(status_code=503, detail="Model not trained yet. Run training first.")
        _artifact = joblib.load(MODEL_PATH)
    return _artifact


def load_analytics():
    global _analytics
    if _analytics is None and ANALYTICS_PATH.exists():
        with open(ANALYTICS_PATH) as f:
            _analytics = json.load(f)
    return _analytics or {}


def format_inr(price):
    price = int(round(price))
    s = str(price)
    if len(s) <= 3:
        return f"₹ {s}"
    last3 = s[-3:]
    rest = s[:-3]
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return f"₹ {','.join(parts)},{last3}"


def generate_insight(price, company, fuel_type, year, kms_driven, df_stats):
    insights = []
    similar = df_stats[
        (df_stats["company"] == company) &
        (df_stats["fuel_type"].str.title() == fuel_type.title()) &
        (abs(df_stats["year"] - year) <= 2)
    ]
    if len(similar) > 0:
        pct = (similar["price"] < price).mean() * 100
        if pct >= 60:
            insights.append(f"This vehicle is priced higher than {pct:.0f}% of similar cars.")
        elif pct <= 40:
            insights.append(f"This vehicle is priced lower than {100 - pct:.0f}% of similar cars.")
        else:
            insights.append("This vehicle is competitively priced among similar cars.")

    avg_kms = df_stats["kms_driven"].median()
    if kms_driven < avg_kms * 0.5:
        insights.append("Low mileage — excellent value for money.")
    elif kms_driven > avg_kms * 1.5:
        insights.append("High mileage may affect long-term resale value.")

    car_age = pd.Timestamp.now().year - year
    if car_age <= 3:
        insights.append("Relatively new vehicle with strong market demand.")
    elif car_age >= 10:
        insights.append("Older vehicle — consider maintenance history before purchase.")

    if not insights:
        insights.append("Market-aligned pricing based on current trends.")
    return " ".join(insights[:2])


def compute_confidence(company, model, fuel_type, year, kms_driven, df_stats):
    mask = (
        (df_stats["company"] == company) &
        (df_stats["model"] == model) &
        (df_stats["fuel_type"].str.title() == fuel_type.title())
    )
    similar = df_stats[mask]
    if len(similar) >= 10:
        base = 92
    elif len(similar) >= 5:
        base = 85
    elif len(similar) >= 1:
        base = 75
    else:
        base = 65

    year_diff = abs(pd.Timestamp.now().year - year)
    if year_diff > 15:
        base -= 10
    elif year_diff > 10:
        base -= 5

    if kms_driven > 150000:
        base -= 8
    elif kms_driven > 100000:
        base -= 4

    return round(min(max(base, 55), 98), 1)


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    artifact = load_artifact()
    pipeline = artifact["pipeline"]
    feature_cols = artifact["feature_cols"]
    df_stats = artifact["df_stats"]

    data = pd.DataFrame([{
        "company": request.company,
        "model": request.model,
        "fuel_type": request.fuel_type.title(),
        "year": request.year,
        "kms_driven": request.kms_driven,
    }])

    try:
        prediction = pipeline.predict(data[feature_cols])[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

    prediction = max(prediction, 10000)

    confidence = compute_confidence(
        request.company, request.model, request.fuel_type,
        request.year, request.kms_driven, df_stats
    )
    insight = generate_insight(
        prediction, request.company, request.fuel_type,
        request.year, request.kms_driven, df_stats
    )

    return PredictResponse(
        predicted_price=round(float(prediction), 2),
        formatted_price=format_inr(prediction),
        confidence_score=confidence,
        insight=insight,
        model_used=artifact["best_model_name"],
    )
