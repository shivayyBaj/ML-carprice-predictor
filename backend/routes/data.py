import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent
ANALYTICS_PATH = BASE_DIR / "analytics_data.json"
METRICS_PATH = BASE_DIR / "metrics.json"


def _load_json(path):
    if not path.exists():
        raise HTTPException(status_code=503, detail="Data not available. Run training first.")
    with open(path) as f:
        return json.load(f)


@router.get("/companies")
def get_companies():
    analytics = _load_json(ANALYTICS_PATH)
    companies = sorted(analytics.get("companies_models", {}).keys())
    return {"companies": companies}


@router.get("/models")
def get_models(company: str = Query(..., description="Company name")):
    analytics = _load_json(ANALYTICS_PATH)
    companies_models = analytics.get("companies_models", {})
    if company not in companies_models:
        raise HTTPException(status_code=404, detail=f"Company '{company}' not found")
    return {"models": companies_models[company]}


@router.get("/metrics")
def get_metrics():
    return _load_json(METRICS_PATH)


@router.get("/analytics")
def get_analytics():
    return _load_json(ANALYTICS_PATH)
