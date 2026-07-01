from datetime import datetime

from pydantic import BaseModel


class HoneyTokenCreate(BaseModel):
    name: str
    token_type: str
    value: str
    environment: str


class HoneyTokenResponse(BaseModel):
    id: str
    name: str
    token_type: str
    value: str
    environment: str
    is_active: bool
    created_at: datetime
    last_triggered_at: datetime | None = None

    model_config = {"from_attributes": True}
