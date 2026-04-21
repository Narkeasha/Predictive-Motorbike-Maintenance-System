import joblib
import pandas as pd
from pathlib import Path

# locate models folders
BASE_DIR = Path(__file__).resolve().parent.parent

# define paths to model and columns files
MODEL_PATH = BASE_DIR / "models" / "engine_oil_model.pkl"
COLUMNS_PATH = BASE_DIR / "models" / "engine_oil_columns.pkl"

# ------------loading model and columns-----------------.
model = joblib.load(MODEL_PATH)
columns = joblib.load(COLUMNS_PATH)

#the schema validates the input structure, while the service file preprocesses the validated data into the same feature format used during model training.
def predict_engine_oil(data):
    # getting user input for miles since last oil change.
    miles = data.miles_since_oil_change


    # --------------------threshold safety override------------------.
    if miles > 5000:
        return {
            "status": "Critical",
            "recommendation": "Oil change overdue. Seek professional service as soon as possible."
        }

    #--------------------Preprocessing user input------------------.
    # convert input to dataframe
    input_df = pd.DataFrame([data.model_dump()])

    # recreate encoding categorical to numerical format.
    input_df = pd.get_dummies(input_df)

    # need to match exact feature structure used when model was trained. This ensures all expected features are present, and any missing ones are filled with 0.
    input_df = input_df.reindex(columns=columns, fill_value=0)

    #--------------------Model Prediction------------------.
    #predict remaining useful life in miles.
    prediction = model.predict(input_df)[0]

    # --------------------Status logic and recommendation message------------------.
    if prediction > 1000:
        status = "Safe"
        recommendation = "Engine oil looks healthy. You're good to ride for now."

    elif prediction > 300:
        status = "Warning"
        recommendation = "Oil service coming up soon. Plan a change in the next few rides."

    else:
        status = "Critical"
        recommendation = "Oil change overdue. Service ASAP to avoid engine damage."


    #------------------Return result in JSON schema format------------------.
    return {  #returns this as a JSON file through Api.js
        "status": status,
        "recommendation": recommendation
    }