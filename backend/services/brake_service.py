import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "brake_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "brake_columns.pkl")


def predict_brakes(data):
    mileage = data.miles_since_pad_change

    # safety rule
    if mileage >= 10000:
        return {
            "status": "Critical",
            "recommendation": "Brake pads likely worn out. Service ASAP for safety."
        }

    df = pd.DataFrame([data.model_dump()])
    df = pd.get_dummies(df)
    df = df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(df)[0]
    status = str(prediction)

    if status == "Safe":
        recommendation = "Brake wear looks normal. You're good to ride."

    elif status == "Warning":
        recommendation = "Brake pads may be wearing. Plan an inspection soon."

    else:
        recommendation = "Brake pads likely worn out. Service ASAP for safety."

    return {
        "status": status,
        "recommendation": recommendation
    }