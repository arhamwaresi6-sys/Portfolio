from flask import Flask

from app.config import Config
from app.extensions import db, limiter, migrate
from app.routes import admin_bp, projects_bp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)

    app.register_blueprint(admin_bp)
    app.register_blueprint(projects_bp)

    @app.get("/api/health")
    def health_check():
        return {"status": "ok", "service": "portfolio-api"}

    @app.get("/")
    def home():
        return {"message": "Portfolio API is running."}

    with app.app_context():
        db.create_all()

    return app
