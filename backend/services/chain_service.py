import joblib
import pandas as pd
from pathlib import Path


#getting project folder so i can load the files correctly.
BASE_DIR = Path(__file__).resolve().parent.parent

#loading trained model the .pkl file. model and columns.
model = joblib.load(BASE_DIR / "models" / "chain_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "chain_columns.pkl")

def predict_chain(data):
    mileage = data.miles_since_chain_change

    # ------------------Threshold safety override --------------.
    if mileage >= 15000:
        return {
            "status": "Critical",
            "recommendation": "Chain likely worn out. Replace immediately to avoid failure."
        }

    #------------------Preproccessing user input----------------.
    #input into dataframe format for model.
    df = pd.DataFrame([data.model_dump()])

    #one-hot encoding for categorical variables to numerical/
    df = pd.get_dummies(df)

    #aligning data to the same structure during model training.
    df = df.reindex(columns=columns, fill_value=0)

    #------------------Model Prediction----------------------.
    #model running on processed input to get wear score.
    wear_score = model.predict(df)[0]

    #----------------------Status logic----------------------.
    if wear_score < 40:
        status = "Safe"
        recommendation = "Chain condition looks good. Keep up regular cleaning and lubrication."

    elif wear_score < 70:
        status = "Warning"
        recommendation = "Chain wear increasing. Inspect and adjust tension soon."

    else:
        status = "Critical"
        recommendation = "Chain heavily worn. Replace as soon as possible."


    #---------return result in JSON schema format-----------------.
    return {
        "status": status,
        "recommendation": recommendation
    }