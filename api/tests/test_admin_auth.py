import pytest
from argon2 import PasswordHasher

from app import create_app
from app.extensions import db
from app.models import Admin

password_hasher = PasswordHasher()


@pytest.fixture
def app():
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})
    with app.app_context():
        db.create_all()
        db.session.add(Admin(email="owner@example.com", password_hash=password_hasher.hash("StrongPass123!")))
        db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_login_requires_valid_credentials(client):
    response = client.post("/api/admin/login", json={"email": "owner@example.com", "password": "wrong"})
    assert response.status_code == 401


def test_admin_routes_are_protected(client):
    response = client.get("/api/admin/projects")
    assert response.status_code == 401


def test_admin_login_sets_session_and_me_route_access(client):
    response = client.post(
        "/api/admin/login",
        json={"email": "owner@example.com", "password": "StrongPass123!"},
    )
    assert response.status_code == 200
    assert response.get_json()["admin"]["email"] == "owner@example.com"

    me_response = client.get("/api/admin/me")
    assert me_response.status_code == 200
    assert me_response.get_json()["admin"]["email"] == "owner@example.com"
