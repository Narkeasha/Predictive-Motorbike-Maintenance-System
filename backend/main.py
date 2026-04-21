from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router


#APP initialisation.
#entry point for the backend serverss and creates new API object/ instance is created then waits for request
app = FastAPI(title="Motorbike Predictive Maintenance API")
#configures fastapi application and configures it. and attaches the prediction routes from predict.py


#browser secutiry rule allows to specify which origins can access the API. This is important for development when frontend and backend are on different ports. 
#enabling CORS for to allow http://localhost:5173 to send requests to  http://127.0.0.1:8001 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#route registration connects all prediction from predict.py to this app.
#connects the routes from predict.py to the app.
app.include_router(predict_router)

#checkign thiks endpoint to make sure the API is runnin
@app.get("/")
def root():
    return {"message": "API is running and working!"}