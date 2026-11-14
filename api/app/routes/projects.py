from flask import Blueprint, jsonify

from app.decorators import login_required
from app.models import Project

projects_bp = Blueprint("projects", __name__, url_prefix="/api")


@projects_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.filter_by(published=True).order_by(Project.sort_order.asc(), Project.created_at.desc()).all()
    return jsonify({"items": [project.to_public_dict() for project in projects]})


@projects_bp.route("/projects/<slug>", methods=["GET"])
def get_project(slug):
    project = Project.query.filter_by(slug=slug).first()
    if project is None or not project.published:
        return jsonify({"error": "Project not found."}), 404
    return jsonify({"project": project.to_public_dict()})


@projects_bp.route("/admin/projects/<int:project_id>", methods=["DELETE"])
@login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    from app.extensions import db

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted."})
