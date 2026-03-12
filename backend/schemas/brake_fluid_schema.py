from pydantic import BaseModel
from datetime import date

class BrakeFluidInput(BaseModel):
    date_last_brake_fluid_change: date

class BrakeFluidResponse(BaseModel):
    status: str
    recommendation: str