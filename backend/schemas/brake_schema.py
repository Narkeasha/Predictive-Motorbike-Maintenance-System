#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.

from pydantic import BaseModel

class BrakeInput(BaseModel):
    miles_since_pad_change: float
    riding_style: str
    city_riding: str

class BrakeResponse(BaseModel):
    status: str
    recommendation: str