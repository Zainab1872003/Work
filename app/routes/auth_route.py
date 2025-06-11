from flask import Blueprint
from app.controllers.auth_controller import register_user, login_user , get_current_user



auth_bp = Blueprint("auth_bp", __name__)

auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)
auth_bp.route("/me", methods=["GET"])(get_current_user)
