#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.

from pydantic import BaseModel

class ChainInput(BaseModel):
    miles_since_chain_change: float
    weather_exposure: str
    maintenance_frequency: str


class ChainResponse(BaseModel):
    status: str
    recommendation: str