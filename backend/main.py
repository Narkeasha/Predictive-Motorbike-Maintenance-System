from fastapi import FastAPI
from routes.predict import router as predict_router


#main entry point for the backend server. It creates the FastAPI app and defines a basic root endpoint.
app = FastAPI(title="Motorbike Predictive Maintenance API")

#include the predict router which has the /predict endpoint

app.include_router(predict_router) #import the predict router from routes/predict.py and include it in the main app so that /predict endpoint is available.

@app.get("/")
def root():
    return {"message": "API is running"} #basic endpoint to check if server is alive