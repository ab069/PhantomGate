from datetime import datetime

from pydantic import BaseModel


class IncidentResponse(BaseModel):
    id: str
    token_id: str
    classification: str | None = None
    severity: str | None = None
    source_ip: str | None = None
    user_agent: str | None = None
    enrichment_data: dict | None = None
    report: str | None = None
    recommended_action: str | None = None
    status: str
    created_at: datetime
    resolved_at: datetime | None = None

    model_config = {"from_attributes": True}
