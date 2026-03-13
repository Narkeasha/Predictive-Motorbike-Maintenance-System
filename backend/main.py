from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router

# Main entry point for the backend server
app = FastAPI(title="Motorbike Predictive Maintenance API")

# Enable CORS so the React frontend can call the backend
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

# Include prediction routes
app.include_router(predict_router)

# Basic health check endpoint
@app.get("/")
def root():
    return {"message": "API is running"}