from flask import Blueprint
from app.controllers.booking_controller import book_event, get_my_bookings, cancel_booking, get_event_bookings

booking_bp = Blueprint("booking_bp", __name__)
booking_bp.route("/<event_id>", methods=["POST"])(book_event)
booking_bp.route("/my", methods=["GET"])(get_my_bookings)
booking_bp.route("/cancel/<booking_id>", methods=["DELETE"])(cancel_booking)
booking_bp.route("/event/<event_id>", methods=["GET"])(get_event_bookings)