import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "brake_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "brake_columns.pkl")


def predict_brakes(data: dict):

    mileage = data["miles_since_pad_change"]

    # Safety rule
    if mileage >= 10000:
        return {
            "brake_status": "Critical",
            "warning": "Brake pads likely worn. Immediate inspection recommended."
        }

    df = pd.DataFrame([data])
    df = pd.get_dummies(df)
    df = df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(df)[0]

    return {
        "brake_status": str(prediction),
        "warning": None
    }