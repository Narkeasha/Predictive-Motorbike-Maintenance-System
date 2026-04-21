#the route uses the schema to validate the input first, and only valid data is then passed to the service file.
#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.
from pydantic import BaseModel
from datetime import date

class BrakeFluidInput(BaseModel):
    date_last_brake_fluid_change: date

class BrakeFluidResponse(BaseModel):
    status: str
    recommendation: str