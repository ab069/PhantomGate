import json
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db, async_session
from app.models.token import HoneyToken
from app.models.incident import Incident
from app.agents.graph import run_agent_pipeline
from app.services import token_service

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(user_id, []).append(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        self.active.setdefault(user_id, []).remove(ws)
        if not self.active[user_id]:
            del self.active[user_id]

    async def broadcast(self, user_id: str, message: dict):
        for ws in self.active.get(user_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            if data.get("action") == "token_triggered":
                token_id = data.get("token_id")
                source_ip = data.get("source_ip", "unknown")
                user_agent = data.get("user_agent", "")
                async with async_session() as db:
                    token = await token_service.get_token(db, token_id)
                    if not token:
                        await ws.send_json({"error": "Token not found"})
                        continue
                    agent_result = run_agent_pipeline(
                        token_type=token.token_type,
                        token_name=token.name,
                        environment=token.environment,
                        source_ip=source_ip,
                        user_agent=user_agent,
                    )
                    incident = Incident(
                        user_id=user_id,
                        token_id=token_id,
                        classification=agent_result.get("classification"),
                        severity=agent_result.get("severity"),
                        source_ip=source_ip,
                        user_agent=user_agent,
                        enrichment_data=agent_result.get("enrichment"),
                        report=agent_result.get("report"),
                        recommended_action=agent_result.get("recommended_action"),
                    )
                    db.add(incident)
                    token.last_triggered_at = datetime.now(timezone.utc)
                    await db.commit()
                    await db.refresh(incident)
                    await manager.broadcast(user_id, {
                        "type": "incident",
                        "incident": {
                            "id": incident.id,
                            "token_name": token.name,
                            "classification": incident.classification,
                            "severity": incident.severity,
                            "report": incident.report,
                            "recommended_action": incident.recommended_action,
                            "created_at": incident.created_at.isoformat(),
                        },
                    })
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
