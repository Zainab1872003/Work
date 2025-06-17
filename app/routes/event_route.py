from flask import Blueprint
from app.controllers.event_controller import (create_event , get_events ,  get_event_by_id,get_vendor_events,
update_event,
delete_event
)
event_bp = Blueprint("event_bp", __name__)
event_bp.route("/create", methods=["POST"])(create_event)
event_bp.route("/filter", methods=["GET"])(get_events)
event_bp.route("/my-events", methods=['GET'])(get_vendor_events)
# event_bp.route("/",methods=["GET"])(get_events_withoutlogin)
event_bp.route("/<event_id>", methods=["GET"])(get_event_by_id)
event_bp.route("/<event_id>", methods=['PUT'])(update_event)
event_bp.route("/<event_id>", methods=['DELETE'])(delete_event)