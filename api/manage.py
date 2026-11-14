from argparse import ArgumentParser

from app import create_app
from app.extensions import db
from app.models import Admin
from argon2 import PasswordHasher

password_hasher = PasswordHasher()


def create_admin(email: str, password: str):
    app = create_app()
    with app.app_context():
        admin = Admin.query.filter_by(email=email.lower()).first()
        if admin is not None:
            raise ValueError(f"Admin already exists for {email.lower()}")
        db.session.add(Admin(email=email.lower(), password_hash=password_hasher.hash(password)))
        db.session.commit()
        print(f"Created admin: {email.lower()}")


if __name__ == "__main__":
    parser = ArgumentParser(description="Portfolio admin management CLI")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--password", required=True, help="Admin password")
    args = parser.parse_args()
    try:
        create_admin(args.email, args.password)
    except ValueError as exc:
        raise SystemExit(str(exc))
