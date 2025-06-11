from flask import Blueprint
from app.controllers.admin_controller import (
    get_all_users, update_user_role, search_users,filter_users_by_role , delete_user,
get_all_events , delete_event , filter_events
)


admin_bp = Blueprint("admin_bp", __name__)
admin_bp.route("/users", methods=["GET"])(get_all_users)
admin_bp.route("/user/<string:user_id>", methods=["DELETE"])(delete_user)
admin_bp.route("/user/<string:user_id>/role", methods=["POST"])(update_user_role)
admin_bp.route("/users/search", methods=["GET"])(search_users)
admin_bp.route("/users/filter", methods=["GET"])(filter_users_by_role)
admin_bp.route("/events", methods=["GET"])(get_all_events)
admin_bp.route("/admin/event/<string:event_id>", methods=["DELETE"])(delete_event)
admin_bp.route("/admin/events/filter", methods=["GET"])(filter_events)