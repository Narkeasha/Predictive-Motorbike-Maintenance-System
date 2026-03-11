from pydantic import BaseModel

class BrakeInput(BaseModel):
    miles_since_pad_change: float
    riding_style: str
    city_riding: str