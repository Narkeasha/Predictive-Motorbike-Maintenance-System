from pydantic import BaseModel

class CoolantInput(BaseModel):
    date_last_coolant_change: str | None = None