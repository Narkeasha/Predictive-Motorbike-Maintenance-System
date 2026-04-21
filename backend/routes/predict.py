from fastapi import APIRouter



#defines all API endpoints for prediction. 


#engine oil
# importing the schema fo inut and output structure)
# using logic function from the service file.
from schemas.engine_oil_schema import EngineOilInput, EngineOilResponse
from services.engine_oil_service import predict_engine_oil


#tyres
from schemas.tyre_schema import TyreInput
from services.tyre_service import predict_tyre
from schemas.tyre_schema import TyreInput, TyreResponse


#brakes
from schemas.brake_schema import BrakeInput, BrakeResponse
from services.brake_service import predict_brakes


#chain n sporket 
from schemas.chain_schema import ChainInput, ChainResponse
from services.chain_service import predict_chain

#brake fluid 
from schemas.brake_fluid_schema import BrakeFluidInput, BrakeFluidResponse
from services.brake_fluid_service import evaluate_brake_fluid_status

#coolant 
from schemas.coolant_schema import CoolantInput, CoolantResponse
from services.coolant_service import evaluate_coolant_status

#router creation for all endpoints - everything under predict in the api.
router = APIRouter(prefix="/predict", tags=["Prediction"])




@router.post("/engine-oil", response_model=EngineOilResponse)
def predict_engine_oil_route(data: EngineOilInput):
    #data is validateed by schema 
    #pass it through service file
    return predict_engine_oil(data)

@router.post("/tyre", response_model=TyreResponse)
def tyre_prediction(data: TyreInput):
    return predict_tyre(data)

@router.post("/brakes", response_model=BrakeResponse)
def brake_prediction(data: BrakeInput):
    return predict_brakes(data)

@router.post("/chain", response_model=ChainResponse)
def chain_prediction(data: ChainInput):
    return predict_chain(data)


@router.post("/brake-fluid", response_model=BrakeFluidResponse)
def brake_fluid_prediction(data: BrakeFluidInput):
    return evaluate_brake_fluid_status(data)


@router.post("/coolant", response_model=CoolantResponse)
def coolant_prediction(data: CoolantInput):
    return evaluate_coolant_status(data)