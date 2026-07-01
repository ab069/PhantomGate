from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident
from app.schemas.incident import IncidentResponse


async def list_incidents(db: AsyncSession, user_id: str) -> list[IncidentResponse]:
    result = await db.execute(
        select(Incident).where(Incident.user_id == user_id).order_by(Incident.created_at.desc())
    )
    incidents = result.scalars().all()
    return [IncidentResponse.model_validate(i) for i in incidents]


async def get_incident(db: AsyncSession, incident_id: str) -> Incident | None:
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    return result.scalar_one_or_none()
