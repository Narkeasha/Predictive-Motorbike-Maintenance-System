from fastapi import APIRouter

#engine oil
from schemas.engine_oil_schema import EngineOilInput
from services.engine_oil_service import predict_engine_oil


#tyres
from schemas.tyre_schema import TyreInput
from services.tyre_service import predict_tyre

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/engine-oil")
def engine_oil_prediction(data: EngineOilInput):
    return predict_engine_oil(data.model_dump())

@router.post("/tyre")
def tyre_prediction(data: TyreInput):
    return predict_tyre(data.model_dump())