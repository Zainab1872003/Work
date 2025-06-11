from flask import jsonify , request
from flask_jwt_extended import jwt_required
from app.models.user_model import User
from app.utils.auth_utils import admin_required
from app.models.event_model import Event


@jwt_required()
@admin_required
def get_all_users():
    users = User.objects()
    return jsonify({
        "count": len(users),
        "users": [
            {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for user in users
        ]
    }), 200

@jwt_required()
@admin_required
def update_user_role(user_id):
    data = request.get_json()
    new_role = data.get("role")

    if new_role not in ["admin", "vendor", "customer"]:
        return jsonify({"error": "Invalid role"}), 400

    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.role = new_role
    user.save()
    return jsonify({"message": f"User role updated to '{new_role}'"}), 200

@jwt_required()
@admin_required
def search_users():
    query = request.args.get("name", "").strip().lower()

    if not query:
        return jsonify({"error": "Please provide a name query"}), 400

    users = User.objects(name__icontains=query)

    return jsonify({
        "count": len(users),
        "users": [
            {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for user in users
        ]
    }), 200
@jwt_required()
@admin_required
def filter_users_by_role():
    role = request.args.get("role", "").lower().strip()

    if role not in ["admin", "vendor", "customer"]:
        return jsonify({"error": "Invalid role. Must be admin, vendor, or customer."}), 400

    users = User.objects(role=role)

    return jsonify({
        "count": len(users),
        "users": [
            {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for user in users
        ]
    }), 200
@jwt_required()
@admin_required
def delete_user(user_id):
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.delete()
    return jsonify({"message": "User deleted successfully"}), 200

@jwt_required()
@admin_required
def get_all_events():
    events = Event.objects()

    return jsonify({
        "count": len(events),
        "events": [
            {
                "id": str(event.id),
                "title": event.title,
                "organizer": str(event.organizer.id),
                "date": event.date.strftime("%Y-%m-%d %H:%M"),
                "city": event.city,
                "country": event.country,
                "seats_available": getattr(event, "seats_available", "N/A")
            }
            for event in events
        ]
    }), 200

@jwt_required()
@admin_required
def delete_event(event_id):
    event = Event.objects(id=event_id).first()

    if not event:
        return jsonify({"error": "Event not found"}), 404

    event.delete()
    return jsonify({"message": "Event deleted successfully"}), 200

@jwt_required()
@admin_required
def filter_events():
    query = {}
    organizer_id = request.args.get("organizer")
    country = request.args.get("country")
    city = request.args.get("city")

    from_date_str = request.args.get("from")
    to_date_str = request.args.get("to")

    # Optional time breakdown
    year = request.args.get("year", type=int)
    month = request.args.get("month", type=int)
    day = request.args.get("day", type=int)
    hour = request.args.get("hour", type=int)

    if organizer_id:
        query["organizer"] = organizer_id
    if country:
        query["country__iexact"] = country
    if city:
        query["city__iexact"] = city

    # Date range filters
    if from_date_str and to_date_str:
        try:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d")
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d")
            query["date__gte"] = from_date
            query["date__lte"] = to_date
        except ValueError:
            return jsonify({"error": "Date format should be YYYY-MM-DD"}), 400

    elif year:
        from_date = datetime(year, month or 1, day or 1, hour or 0)
        to_date = datetime(
            year,
            month or 12,
            day or 31 if not day else day,
            hour if hour is not None else 23,
            59, 59
        )
        query["date__gte"] = from_date
        query["date__lte"] = to_date

    events = Event.objects(**query)

    return jsonify({
        "count": len(events),
        "events": [
            {
                "id": str(event.id),
                "title": event.title,
                "organizer": str(event.organizer.id),
                "country": event.country,
                "city": event.city,
                "date": event.date.strftime("%Y-%m-%d %H:%M"),
                "seats_available": getattr(event, "seats_available", "N/A")
            }
            for event in events
        ]
    }), 200
