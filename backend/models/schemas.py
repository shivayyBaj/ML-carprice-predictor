from pydantic import BaseModel, Field
from typing import Optional


class PredictRequest(BaseModel):
    company: str
    model: str
    fuel_type: str
    year: int = Field(..., ge=1990, le=2030)
    kms_driven: int = Field(..., ge=0)


class PredictResponse(BaseModel):
    predicted_price: float
    formatted_price: str
    confidence_score: float
    insight: str
    model_used: str


class MetricsResponse(BaseModel):
    best_model: str
    models: dict


class ErrorResponse(BaseModel):
    detail: str
