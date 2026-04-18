from app.models.payment import PaymentStatus
from app.services.payment_service import sign_for_testing, verify_webhook_signature


def test_signature_round_trip():
    sig = sign_for_testing("ext_123", PaymentStatus.SUCCEEDED)
    assert verify_webhook_signature("ext_123", PaymentStatus.SUCCEEDED, sig)


def test_signature_rejects_tamper():
    sig = sign_for_testing("ext_123", PaymentStatus.SUCCEEDED)
    assert not verify_webhook_signature("ext_999", PaymentStatus.SUCCEEDED, sig)
    assert not verify_webhook_signature("ext_123", PaymentStatus.FAILED, sig)
