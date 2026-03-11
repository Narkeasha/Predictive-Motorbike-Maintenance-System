import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "tyre_model.pkl"
COLUMNS_PATH = BASE_DIR / "models" / "tyre_columns.pkl"

model = joblib.load(MODEL_PATH)
columns = joblib.load(COLUMNS_PATH)

def predict_tyre(data: dict):
    mileage = data["mileage_since_tyre_change"]

    # Safety override from your notebook logic
    if mileage >= 6000:
        return {
            "tyre_status": "Critical",
            "warning": "Tyre mileage is above the safety threshold. Immediate inspection or replacement recommended."
        }

    input_df = pd.DataFrame([data])
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(input_df)[0]

    return {
        "tyre_status": str(prediction),
        "warning": None
    }