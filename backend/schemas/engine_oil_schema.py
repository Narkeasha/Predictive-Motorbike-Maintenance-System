from pydantic import BaseModel

class EngineOilInput(BaseModel):
    miles_since_oil_change: float
    trip_type: str
    riding_style: str