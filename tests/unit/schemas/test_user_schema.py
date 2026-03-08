import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate


class TestUserCreateSchema:

    def test_valid_payload(self):
        user = UserCreate(name="John Doe", email="john@example.com", password="Testpass1!")
        assert user.email == "john@example.com"

    def test_password_no_uppercase(self):
        with pytest.raises(ValidationError, match="uppercase"):
            UserCreate(name="John", email="john@example.com", password="testpass1!")

    def test_password_no_digit(self):
        with pytest.raises(ValidationError, match="digit"):
            UserCreate(name="John", email="john@example.com", password="Testpass!")

    def test_password_no_special_char(self):
        with pytest.raises(ValidationError, match="special"):
            UserCreate(name="John", email="john@example.com", password="Testpass1")

    def test_password_too_short(self):
        with pytest.raises(ValidationError):
            UserCreate(name="John", email="john@example.com", password="T1!")

    def test_invalid_email(self):
        with pytest.raises(ValidationError):
            UserCreate(name="John", email="not-an-email", password="Testpass1!")

    def test_name_too_short(self):
        with pytest.raises(ValidationError):
            UserCreate(name="J", email="john@example.com", password="Testpass1!")

    def test_name_special_characters(self):
        with pytest.raises(ValidationError, match="invalid"):
            UserCreate(name="John@Doe", email="john@example.com", password="Testpass1!")

    def test_name_is_stripped(self):
        user = UserCreate(name="  John  ", email="john@example.com", password="Testpass1!")
        assert user.name == "John"