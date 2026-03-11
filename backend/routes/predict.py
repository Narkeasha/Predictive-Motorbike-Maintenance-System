from fastapi import APIRouter
from schemas.engine_oil_schema import EngineOilInput
from services.engine_oil_service import predict_engine_oil

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/engine-oil")
def engine_oil_prediction(data: EngineOilInput):
    return predict_engine_oil(data.model_dump())