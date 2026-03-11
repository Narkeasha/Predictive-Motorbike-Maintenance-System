from pydantic import BaseModel

class ChainInput(BaseModel):
    miles_since_chain_change: int
    weather_exposure: str
    maintenance_frequency: str