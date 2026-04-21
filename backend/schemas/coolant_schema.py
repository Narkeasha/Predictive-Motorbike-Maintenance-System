#what the api is exspecting 
#the structure -> data checker before anything else happens.
#needs to validate data type's and the presence of all required fields.

from pydantic import BaseModel
from datetime import date

class CoolantInput(BaseModel):
    date_last_coolant_change: date

class CoolantResponse(BaseModel):
    status: str
    recommendation: str