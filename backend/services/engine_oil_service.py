import joblib
import pandas as pd
from pathlib import Path

# locate models folder
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "engine_oil_model.pkl"
COLUMNS_PATH = BASE_DIR / "models" / "engine_oil_columns.pkl"

# load model
model = joblib.load(MODEL_PATH)
columns = joblib.load(COLUMNS_PATH)

def predict_engine_oil(data: dict):

    miles = data["miles_since_oil_change"]

    # safety rule from your notebook
    if miles > 5000:
        return {
            "oil_remaining_miles": 0,
            "warning": "Oil change overdue (>5000 miles). Seek professional service ASAP."
        }

    # convert input to dataframe
    input_df = pd.DataFrame([data])

    # recreate encoding
    input_df = pd.get_dummies(input_df)

    # match training columns
    input_df = input_df.reindex(columns=columns, fill_value=0)

    # run model
    prediction = model.predict(input_df)[0]

    return {
        "oil_remaining_miles": round(float(prediction), 1),
        "warning": None
    }