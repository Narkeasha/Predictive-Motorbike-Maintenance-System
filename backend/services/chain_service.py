import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "chain_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "chain_columns.pkl")


def predict_chain(data):
    mileage = data.miles_since_chain_change

    # safety override
    if mileage >= 5000:
        return {
            "status": "Critical",
            "recommendation": "Chain likely worn out. Replace immediately to avoid failure."
        }

    df = pd.DataFrame([data.model_dump()])
    df = pd.get_dummies(df)
    df = df.reindex(columns=columns, fill_value=0)

    wear_score = model.predict(df)[0]

    # status logic
    if wear_score < 40:
        status = "Safe"
        recommendation = "Chain condition looks good. Keep up regular cleaning and lubrication."

    elif wear_score < 70:
        status = "Warning"
        recommendation = "Chain wear increasing. Inspect and adjust tension soon."

    else:
        status = "Critical"
        recommendation = "Chain heavily worn. Replace as soon as possible."

    return {
        "status": status,
        "recommendation": recommendation
    }