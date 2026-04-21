import joblib
import pandas as pd
from pathlib import Path


#getting project folder so i can load the files correctly.
BASE_DIR = Path(__file__).resolve().parent.parent

#loading trained model the .pkl file. model and columns.
model = joblib.load(BASE_DIR / "models" / "tyre_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "tyre_columns.pkl")


#--------------------Preprocessing user input------------------.
def predict_tyre(data):
    mileage = data.mileage_since_tyre_change

    # --------------------threshold safety override------------------.
    if mileage >= 8000:
        return {
            "status": "Critical",
            "recommendation": "Tyres likely worn out. Replace ASAP for safe riding."
        }

    #--------------------Preprocessing user input------------------.
    # convert input to dataframe
    input_df = pd.DataFrame([data.model_dump()])

    # recreate encoding categorical to numerical format.
    input_df = pd.get_dummies(input_df)

    # need to match exact feature structure used when model was trained. This ensures all expected features are present, and any missing ones are filled with 0.
    input_df = input_df.reindex(columns=columns, fill_value=0)

    #--------------------Model Prediction------------------.
    prediction = model.predict(input_df)[0]
    status = str(prediction)

    # --------------------Status logic and recommendation message------------------.
    if status == "Safe":
        recommendation = "Tyre wear looks normal. You're good to keep riding."

    elif status == "Warning":
        recommendation = "Tyres are wearing down. Plan an inspection soon."

    else:
        recommendation = "Tyres likely worn out. Replace ASAP for safe riding."


    #------------------Return result in JSON schema format------------------.
    return {
        "status": status,
        "recommendation": recommendation
    }