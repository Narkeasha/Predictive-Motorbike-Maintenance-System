import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "tyre_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "tyre_columns.pkl")


def predict_tyre(data):
    mileage = data.mileage_since_tyre_change

    # safety override
    if mileage >= 6000:
        return {
            "status": "Critical",
            "recommendation": "Tyres likely worn out. Replace ASAP for safe riding."
        }

    input_df = pd.DataFrame([data.model_dump()])
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(input_df)[0]
    status = str(prediction)

    if status == "Safe":
        recommendation = "Tyre wear looks normal. You're good to keep riding."

    elif status == "Warning":
        recommendation = "Tyres are wearing down. Plan an inspection soon."

    else:
        recommendation = "Tyres likely worn out. Replace ASAP for safe riding."

    return {
        "status": status,
        "recommendation": recommendation
    }