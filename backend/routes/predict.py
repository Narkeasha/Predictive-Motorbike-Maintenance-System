from fastapi import APIRouter

router = APIRouter(prefix="/predict", tags=["Prediction"])
#dummy prediction endpoint that takes mileage and last oil change as input and returns a simple prediction about oil status.
@router.post("/")
def predict(data: dict):

    mileage = data.get("mileage")
    last_oil_change = data.get("last_oil_change")

    if mileage - last_oil_change > 3000:
        oil_status = "Change Oil Soon"
    else:
        oil_status = "Oil OK"

    return {
        "oil_prediction": oil_status
    }