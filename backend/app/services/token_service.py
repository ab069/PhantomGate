from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.token import HoneyToken
from app.schemas.token import HoneyTokenCreate, HoneyTokenResponse


async def create_token(db: AsyncSession, user_id: str, data: HoneyTokenCreate) -> HoneyTokenResponse:
    token = HoneyToken(
        user_id=user_id,
        name=data.name,
        token_type=data.token_type,
        value=data.value,
        environment=data.environment,
    )
    db.add(token)
    await db.commit()
    await db.refresh(token)
    return HoneyTokenResponse.model_validate(token)


async def list_tokens(db: AsyncSession, user_id: str) -> list[HoneyTokenResponse]:
    result = await db.execute(
        select(HoneyToken).where(HoneyToken.user_id == user_id).order_by(HoneyToken.created_at.desc())
    )
    tokens = result.scalars().all()
    return [HoneyTokenResponse.model_validate(t) for t in tokens]


async def get_token(db: AsyncSession, token_id: str) -> HoneyToken | None:
    result = await db.execute(select(HoneyToken).where(HoneyToken.id == token_id))
    return result.scalar_one_or_none()


async def delete_token(db: AsyncSession, token_id: str) -> bool:
    result = await db.execute(select(HoneyToken).where(HoneyToken.id == token_id))
    token = result.scalar_one_or_none()
    if not token:
        return False
    await db.delete(token)
    await db.commit()
    return True
