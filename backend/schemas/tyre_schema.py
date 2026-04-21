#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.

from pydantic import BaseModel

class TyreInput(BaseModel):
    mileage_since_tyre_change: float
    riding_style: str
    road_type: str

class TyreResponse(BaseModel):
    status: str
    recommendation: str