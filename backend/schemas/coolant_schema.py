from pydantic import BaseModel
from datetime import date

class CoolantInput(BaseModel):
    date_last_coolant_change: date

class CoolantResponse(BaseModel):
    status: str
    recommendation: str