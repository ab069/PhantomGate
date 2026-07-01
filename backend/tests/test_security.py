from app.core.security import hash_password, verify_password, create_access_token, decode_token


def test_password_hashing():
    pw = "test_password_123"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed)
    assert not verify_password("wrong", hashed)


def test_jwt_token():
    user_id = "test-user-id"
    token = create_access_token(user_id)
    payload = decode_token(token)
    assert payload.sub == user_id
    assert payload.exp is not None
