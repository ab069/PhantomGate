from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.incident import IncidentResponse
from app.services import incident_service

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=list[IncidentResponse])
async def list_incidents(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await incident_service.list_incidents(db, user.id)


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    incident = await incident_service.get_incident(db, incident_id)
    if not incident or incident.user_id != user.id:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
