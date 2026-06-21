import json
import os
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from utils.preprocessing import load_and_preprocess

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "quikr_car.csv"
MODEL_PATH = BASE_DIR / "model.pkl"
METRICS_PATH = BASE_DIR / "metrics.json"
ANALYTICS_PATH = BASE_DIR / "analytics_data.json"


def build_preprocessor():
    categorical_features = ["company", "model", "fuel_type"]
    numeric_features = ["year", "kms_driven"]

    return ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numeric_features),
        ]
    )


def get_models():
    return {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=15, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=200, max_depth=6, random_state=42),
        "XGBoost": XGBRegressor(
            n_estimators=300,
            max_depth=8,
            learning_rate=0.1,
            random_state=42,
            n_jobs=-1,
        ),
    }


def evaluate_model(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return {"mae": round(float(mae), 2), "rmse": round(float(rmse), 2), "r2": round(float(r2), 4)}


def generate_analytics_data(df):
    fuel_dist = df["fuel_type"].value_counts().to_dict()
    company_dist = df["company"].value_counts().head(15).to_dict()
    avg_price_by_company = df.groupby("company")["price"].mean().sort_values(ascending=False).head(15)
    avg_price_by_company = {k: round(float(v), 2) for k, v in avg_price_by_company.items()}

    year_trend = df.groupby("year")["price"].mean().reset_index()
    year_trend = [{"year": int(r["year"]), "avg_price": round(float(r["price"]), 2)} for _, r in year_trend.iterrows()]

    scatter_sample = df.sample(min(200, len(df)), random_state=42)
    scatter_data = [
        {"kms_driven": int(r["kms_driven"]), "price": round(float(r["price"]), 2)}
        for _, r in scatter_sample.iterrows()
    ]

    companies_models = {}
    for company in sorted(df["company"].unique()):
        models = sorted(df[df["company"] == company]["model"].unique().tolist())
        companies_models[company] = models

    fuel_avg = df.groupby("fuel_type")["price"].mean()
    fuel_avg = {k: round(float(v), 2) for k, v in fuel_avg.items()}

    insights = generate_insights(df)

    return {
        "fuel_distribution": fuel_dist,
        "company_distribution": company_dist,
        "avg_price_by_company": avg_price_by_company,
        "year_vs_price": year_trend,
        "kms_vs_price": scatter_data,
        "companies_models": companies_models,
        "fuel_avg_price": fuel_avg,
        "insights": insights,
        "total_records": len(df),
        "price_stats": {
            "min": round(float(df["price"].min()), 2),
            "max": round(float(df["price"].max()), 2),
            "mean": round(float(df["price"].mean()), 2),
            "median": round(float(df["price"].median()), 2),
        },
    }


def generate_insights(df):
    avg_by_company = df.groupby("company")["price"].mean().sort_values()
    best_value = avg_by_company.head(3)
    most_expensive = avg_by_company.tail(3)

    fuel_trend = df.groupby("fuel_type")["price"].mean().sort_values(ascending=False)
    depreciation = df.groupby("year")["price"].mean().sort_index()
    dep_years = sorted(depreciation.index.tolist())
    if len(dep_years) >= 2:
        oldest = dep_years[0]
        newest = dep_years[-1]
        dep_rate = ((depreciation[oldest] - depreciation[newest]) / depreciation[oldest]) * 100
    else:
        dep_rate = 0

    mileage_corr = df["kms_driven"].corr(df["price"])

    return {
        "best_value_brands": [{"company": k, "avg_price": round(float(v), 2)} for k, v in best_value.items()],
        "most_expensive_brands": [{"company": k, "avg_price": round(float(v), 2)} for k, v in most_expensive.items()],
        "fuel_type_trends": [{"fuel_type": k, "avg_price": round(float(v), 2)} for k, v in fuel_trend.items()],
        "depreciation_rate": round(float(dep_rate), 2),
        "mileage_price_correlation": round(float(mileage_corr), 4),
        "mileage_impact": "Higher mileage significantly reduces resale value." if mileage_corr < -0.3 else "Mileage has moderate impact on resale value.",
    }


def train():
    print("Loading and preprocessing data...")
    df = load_and_preprocess(str(DATA_PATH))
    print(f"Processed {len(df)} records")

    feature_cols = ["company", "model", "fuel_type", "year", "kms_driven"]
    X = df[feature_cols]
    y = df["price"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = build_preprocessor()
    models = get_models()
    results = {}
    best_name = None
    best_r2 = -float("inf")
    best_pipeline = None

    for name, model in models.items():
        print(f"Training {name}...")
        pipeline = Pipeline([
            ("preprocessor", build_preprocessor()),
            ("regressor", model),
        ])
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        metrics = evaluate_model(y_test, y_pred)
        results[name] = metrics
        print(f"  MAE: {metrics['mae']}, RMSE: {metrics['rmse']}, R²: {metrics['r2']}")

        if metrics["r2"] > best_r2:
            best_r2 = metrics["r2"]
            best_name = name
            best_pipeline = pipeline

    print(f"\nBest model: {best_name} (R² = {best_r2:.4f})")

    artifact = {
        "pipeline": best_pipeline,
        "best_model_name": best_name,
        "feature_cols": feature_cols,
        "df_stats": df,
    }
    joblib.dump(artifact, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    metrics_output = {
        "best_model": best_name,
        "models": results,
    }
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics_output, f, indent=2)

    analytics = generate_analytics_data(df)
    with open(ANALYTICS_PATH, "w") as f:
        json.dump(analytics, f, indent=2)

    print("Training complete!")
    return best_name, results


if __name__ == "__main__":
    train()
