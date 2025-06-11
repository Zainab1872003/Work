from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.event_model import Event
from app.models.booking_model import Booking
from app.utils.auth_utils import customer_required , vendor_required

@jwt_required()
@customer_required
def book_event(event_id):
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()

    # Check if event exists
    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({"error": "Event not found"}), 404

        # Check if seats are available
    if event.seats_available <= 0:
        return jsonify({"error": "Event is fully booked"}), 400

    # Check if already booked
    existing = Booking.objects(customer=user, event=event).first()
    if existing:
        return jsonify({"error": "You already booked this event"}), 400

    # Save booking
    booking = Booking(customer=user, event=event)
    booking.save()
    event.seats_available -= 1
    event.save()
    return jsonify({"message": "Booking successful", "booking": booking.to_json()}), 201

@jwt_required()
@customer_required
def get_my_bookings():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()

    bookings = Booking.objects(customer=user).order_by('-booked_at')

    return jsonify({
        "count": len(bookings),
        "bookings": [b.to_json() for b in bookings]
    }), 200

@jwt_required()
@customer_required
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()

    booking = Booking.objects(id=booking_id, customer=user).first()

    if not booking:
        return jsonify({"error": "Booking not found or not yours"}), 404

    # Increase available seats
    booking.event.seats_available += 1
    booking.event.save()

    booking.delete()

    return jsonify({"message": "Booking cancelled successfully"}), 200
@jwt_required()
@vendor_required
def get_event_bookings(event_id):
    user_id = get_jwt_identity()
    vendor = User.objects(id=user_id).first()

    event = Event.objects(id=event_id, organizer=vendor).first()
    if not event:
        return jsonify({"error": "Event not found or not owned by you"}), 404

    bookings = Booking.objects(event=event).order_by("-booked_at")

    return jsonify({
        "event": event.to_json(),
        "count": len(bookings),
        "bookings": [b.to_json() for b in bookings]
    }), 200
