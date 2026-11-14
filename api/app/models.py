from datetime import datetime, timezone

from .extensions import db


def utc_now():
    return datetime.now(timezone.utc)


class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utc_now)

    def to_public_dict(self):
        return {"id": self.id, "email": self.email}


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(120), nullable=False, default="General")
    overview = db.Column(db.Text, default="")
    problem = db.Column(db.Text, default="")
    solution = db.Column(db.Text, default="")
    description = db.Column(db.Text, default="")
    features = db.Column(db.JSON, default=list)
    challenges = db.Column(db.Text, default="")
    implementation_notes = db.Column(db.Text, default="")
    tech_stack = db.Column(db.JSON, default=list)
    live_url = db.Column(db.String(512), nullable=True)
    github_url = db.Column(db.String(512), nullable=True)
    featured = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=False)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=utc_now)
    updated_at = db.Column(db.DateTime, nullable=False, default=utc_now, onupdate=utc_now)

    def to_public_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "short_description": self.short_description,
            "category": self.category,
            "overview": self.overview,
            "problem": self.problem,
            "solution": self.solution,
            "description": self.description,
            "features": self.features or [],
            "tech_stack": self.tech_stack or [],
            "live_url": self.live_url,
            "github_url": self.github_url,
            "featured": self.featured,
            "published": self.published,
            "sort_order": self.sort_order,
        }
