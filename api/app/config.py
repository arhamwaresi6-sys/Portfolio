import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "development-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///portfolio.db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Strict"
    SESSION_COOKIE_SECURE = False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
