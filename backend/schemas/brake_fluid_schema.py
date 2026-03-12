from pydantic import BaseModel

class BrakeFluidInput(BaseModel):
    date_last_brake_fluid_change: str | None = None