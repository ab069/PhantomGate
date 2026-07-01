from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.token import HoneyTokenCreate, HoneyTokenResponse
from app.services import token_service

router = APIRouter(prefix="/api/tokens", tags=["tokens"])


@router.post("", response_model=HoneyTokenResponse)
async def create_token(data: HoneyTokenCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await token_service.create_token(db, user.id, data)


@router.get("", response_model=list[HoneyTokenResponse])
async def list_tokens(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await token_service.list_tokens(db, user.id)


@router.delete("/{token_id}")
async def delete_token(token_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await token_service.delete_token(db, token_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"ok": True}
