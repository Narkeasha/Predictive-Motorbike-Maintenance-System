from pydantic import BaseModel

class ChainInput(BaseModel):
    miles_since_chain_change: float
    weather_exposure: str
    maintenance_frequency: str


class ChainResponse(BaseModel):
    status: str
    recommendation: str