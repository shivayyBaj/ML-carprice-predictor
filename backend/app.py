import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, str(Path(__file__).resolve().parent))

from routes import data, predict

app = FastAPI(
    title="AI Car Price Predictor API",
    description="Machine Learning powered used car price prediction",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, tags=["Prediction"])
app.include_router(data.router, tags=["Data"])


@app.get("/")
def root():
    return {"message": "AI Car Price Predictor API", "status": "running"}


@app.get("/health")
def health():
    model_path = Path(__file__).resolve().parent / "model.pkl"
    return {
        "status": "healthy",
        "model_loaded": model_path.exists(),
    }
