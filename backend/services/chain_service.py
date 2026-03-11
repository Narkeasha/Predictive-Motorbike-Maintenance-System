import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "chain_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "chain_columns.pkl")

def predict_chain(data: dict):
    mileage = data["miles_since_chain_change"]

    df = pd.DataFrame([data])

    # encode categories
    df = pd.get_dummies(df)

    # match training columns
    df = df.reindex(columns=columns, fill_value=0)

    prediction = float(model.predict(df)[0])

    # keep score in sensible range
    wear_score = max(0, min(100, prediction))

    # threshold conversion from your notebook/report
    if wear_score < 60:
        chain_status = "Safe"
        advice = "Continue regular cleaning and lubrication schedule."
    elif wear_score < 85:
        chain_status = "Warning"
        advice = "Clean and lubricate soon and inspect chain and sprocket."
    else:
        chain_status = "Critical"
        advice = "Inspect immediately; chain and sprocket replacement likely required."

    return {
        "wear_score": round(wear_score, 1),
        "chain_status": chain_status,
        "advice": advice
    }