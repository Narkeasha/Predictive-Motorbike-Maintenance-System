#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.

from pydantic import BaseModel
from typing import Optional

class EngineOilInput(BaseModel):
    miles_since_oil_change: float
    trip_type: str
    riding_style: str


class EngineOilResponse(BaseModel):
    status: str
    recommendation: str


