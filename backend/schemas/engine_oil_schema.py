from pydantic import BaseModel
from typing import Optional

class EngineOilInput(BaseModel):
    miles_since_oil_change: float
    trip_type: str
    riding_style: str


class EngineOilResponse(BaseModel):
    status: str
    recommendation: str


