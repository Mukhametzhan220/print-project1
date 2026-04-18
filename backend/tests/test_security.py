from app.core.security import create_access_token, decode_access_token


def test_jwt_round_trip():
    token = create_access_token("42", extra_claims={"phone": "+77001234567"})
    payload = decode_access_token(token)
    assert payload["sub"] == "42"
    assert payload["phone"] == "+77001234567"
