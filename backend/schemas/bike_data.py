#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.
from pydantic import BaseModel

class BikeData(BaseModel):
    mileage: float
    last_oil_change: float