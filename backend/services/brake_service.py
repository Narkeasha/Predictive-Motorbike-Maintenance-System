import joblib
import pandas as pd
from pathlib import Path


#getting project folder so i can load the files correctly.
BASE_DIR = Path(__file__).resolve().parent.parent

#loading trained model the .pkl file. model and columns.
model = joblib.load(BASE_DIR / "models" / "brake_model.pkl")
columns = joblib.load(BASE_DIR / "models" / "brake_columns.pkl")


def predict_brakes(data):
    mileage = data.miles_since_pad_change

    #-----------------threshold rule------------------------.
    if mileage >= 10000:
        return {
            "status": "Critical",
            "recommendation": "Brake pads likely worn out. Service ASAP for safety."
        }


    #-------------Preproccessing user input----------------.
    #input to datafram expect tabulat input.
    df = pd.DataFrame([data.model_dump()])

    #one-hot encoding categorical to numerical.
    df = pd.get_dummies(df)

    #aligning data to the same structure during model training.
    df = df.reindex(columns=columns, fill_value=0)


    #-----------------Model Prediction----------------------.
    #model running on processed input.
    prediction = model.predict(df)[0]

    #converting prediction to string - safe, warning, ciritcal.
    status = str(prediction)

    #-----------------Recommendation logic message-------------.
    if status == "Safe":
        recommendation = "Brake wear looks normal. You're good to ride."

    elif status == "Warning":
        recommendation = "Brake pads may be wearing. Plan an inspection soon."

    else:
        recommendation = "Brake pads likely worn out. Service ASAP for safety."


    #retunring final result as same json shcema format.
    return {
        "status": status,
        "recommendation": recommendation
    }