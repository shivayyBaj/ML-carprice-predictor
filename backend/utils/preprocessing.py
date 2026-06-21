import re
import pandas as pd
import numpy as np


def clean_price(value):
    if pd.isna(value):
        return np.nan
    if isinstance(value, str):
        if "ask for price" in value.lower():
            return np.nan
        return float(re.sub(r"[^\d.]", "", value.replace(",", "")))
    return float(value)


def clean_kms(value):
    if pd.isna(value):
        return np.nan
    if isinstance(value, str):
        cleaned = re.sub(r"[^\d.]", "", value.replace(",", ""))
        return int(float(cleaned)) if cleaned else np.nan
    return int(value)


def clean_car_name(name):
    if pd.isna(name):
        return ""
    name = str(name).strip()
    name = re.sub(r"\s+", " ", name)
    return name


def extract_model(name, company):
    if pd.isna(name) or pd.isna(company):
        return ""
    name = str(name).strip()
    company = str(company).strip()
    if name.lower().startswith(company.lower()):
        model = name[len(company):].strip()
    else:
        model = name
    return model if model else name


def preprocess_dataframe(df):
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower()

    column_map = {
        "name": "car_name",
        "price": "price",
        "kms_driven": "kms_driven",
        "fuel_type": "fuel_type",
        "company": "company",
        "year": "year",
    }
    df = df.rename(columns={k: v for k, v in column_map.items() if k in df.columns})

    df = df.dropna(subset=["company", "year", "fuel_type"], how="any")

    df["price"] = df["price"].apply(clean_price)
    df["kms_driven"] = df["kms_driven"].apply(clean_kms)

    df = df.dropna(subset=["price", "kms_driven"])

    df["car_name"] = df["car_name"].apply(clean_car_name)
    df["company"] = df["company"].astype(str).str.strip()
    df["fuel_type"] = df["fuel_type"].astype(str).str.strip().str.title()
    df["year"] = pd.to_numeric(df["year"], errors="coerce").astype("Int64")
    df = df.dropna(subset=["year"])
    df["year"] = df["year"].astype(int)

    df["model"] = df.apply(lambda row: extract_model(row["car_name"], row["company"]), axis=1)

    df = df.drop_duplicates()

    df = remove_outliers(df)

    df = df.reset_index(drop=True)
    return df


def remove_outliers(df):
    df = df.copy()
    for col in ["price", "kms_driven", "year"]:
        q1 = df[col].quantile(0.01)
        q3 = df[col].quantile(0.99)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        df = df[(df[col] >= lower) & (df[col] <= upper)]
    df = df[df["price"] > 10000]
    df = df[df["kms_driven"] >= 0]
    current_year = pd.Timestamp.now().year + 1
    df = df[(df["year"] >= 1990) & (df["year"] <= current_year)]
    return df


def load_and_preprocess(csv_path):
    df = pd.read_csv(csv_path)
    return preprocess_dataframe(df)
