#what the api is exspecting 
from pydantic import BaseModel

class BikeData(BaseModel):
    mileage: float
    last_oil_change: float