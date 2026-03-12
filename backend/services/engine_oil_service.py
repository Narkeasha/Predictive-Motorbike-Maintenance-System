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

def predict_engine_oil(data):
    miles = data.miles_since_oil_change

    # safety rule from notebook
    if miles > 5000:
        return {
            "status": "Critical",
            "recommendation": "Oil change overdue. Seek professional service as soon as possible."
        }

    # convert input to dataframe
    input_df = pd.DataFrame([data.model_dump()])

    # recreate encoding
    input_df = pd.get_dummies(input_df)

    # match training columns
    input_df = input_df.reindex(columns=columns, fill_value=0)

    # run model
    prediction = model.predict(input_df)[0]

    # determine status based on remaining miles
    if prediction > 1000:
        status = "Safe"
        recommendation = "Engine oil looks healthy. You're good to ride for now."

    elif prediction > 300:
        status = "Warning"
        recommendation = "Oil service coming up soon. Plan a change in the next few rides."

    else:
        status = "Critical"
        recommendation = "Oil change overdue. Service ASAP to avoid engine damage."

    return {
        "status": status,
        "recommendation": recommendation
    }