from argon2 import PasswordHasher
from flask import Blueprint, jsonify, request, session

from app.decorators import login_required
from app.extensions import db
from app.models import Admin

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")
password_hasher = PasswordHasher()


@admin_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    admin = Admin.query.filter_by(email=email).first()
    if admin is None:
        return jsonify({"error": "Invalid credentials."}), 401

    try:
        password_valid = password_hasher.verify(admin.password_hash, password)
    except Exception:
        password_valid = False

    if not password_valid:
        return jsonify({"error": "Invalid credentials."}), 401

    session["admin_id"] = admin.id
    session.permanent = True
    return jsonify({"message": "Logged in successfully.", "admin": admin.to_public_dict()})


@admin_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."})


@admin_bp.route("/me", methods=["GET"])
@login_required
def me():
    admin_id = session.get("admin_id")
    admin = db.session.get(Admin, admin_id)
    if admin is None:
        return jsonify({"error": "Authentication required."}), 401
    return jsonify({"admin": admin.to_public_dict()})


@admin_bp.route("/projects", methods=["GET"])
@login_required
def list_projects():
    from app.models import Project

    projects = Project.query.order_by(Project.sort_order.asc(), Project.created_at.desc()).all()
    return jsonify({"items": [project.to_public_dict() for project in projects]})


@admin_bp.route("/projects", methods=["POST"])
@login_required
def create_project():
    from app.models import Project

    payload = request.get_json(silent=True) or {}
    slug = (payload.get("slug") or "new-project").strip()
    title = (payload.get("title") or "Untitled Project").strip()
    short_description = (payload.get("short_description") or "").strip()

    project = Project(
        slug=slug,
        title=title,
        short_description=short_description,
        category=payload.get("category", "General"),
        overview=payload.get("overview", ""),
        problem=payload.get("problem", ""),
        solution=payload.get("solution", ""),
        description=payload.get("description", ""),
        features=payload.get("features", []),
        challenges=payload.get("challenges", ""),
        implementation_notes=payload.get("implementation_notes", ""),
        tech_stack=payload.get("tech_stack", []),
        live_url=payload.get("live_url"),
        github_url=payload.get("github_url"),
        featured=bool(payload.get("featured", False)),
        published=bool(payload.get("published", False)),
        sort_order=int(payload.get("sort_order", 0) or 0),
    )

    db.session.add(project)
    db.session.commit()
    return jsonify({"message": "Project created.", "project": project.to_public_dict()}), 201
