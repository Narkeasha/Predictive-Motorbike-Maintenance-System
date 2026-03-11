from pydantic import BaseModel

class TyreInput(BaseModel):
    mileage_since_tyre_change: float
    riding_style: str
    road_type: str