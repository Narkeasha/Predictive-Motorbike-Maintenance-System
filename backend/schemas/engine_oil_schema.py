from pydantic import BaseModel
from typing import Optional

class EngineOilInput(BaseModel):
    miles_since_oil_change: float
    trip_type: str
    riding_style: str


class EngineOilResponse(BaseModel):
    oil_remaining_miles: float
    status: str
    recommendation: str
    remaining_to_warning: Optional[dict] = None