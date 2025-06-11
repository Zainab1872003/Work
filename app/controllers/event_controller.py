from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.event_model import Event
from datetime import datetime
from app.utils.auth_utils import vendor_required
from bson import ObjectId
from mongoengine.errors import ValidationError, DoesNotExist
import os
from werkzeug.utils import secure_filename
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError
from app.config.cloudinary_config import cloudinary


UPLOAD_TEMP = "temp_uploads"

@jwt_required()
@vendor_required
def create_event():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()

    title = request.form.get("title")
    description = request.form.get("description")
    date_str = request.form.get("date")
    country = request.form.get("country")
    city = request.form.get("city")
    location = request.form.get("location")
    seats = request.form.get("seats_available")
    poster = request.files.get("poster")
    poster_url = None



    # Basic required field validation
    if not title or not date_str or not country or not city:
        return jsonify({"error": "Missing required fields: title, date, country, or city"}), 400

    try:
        seats = int(seats)
        if seats < 1:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "seats_available is required and should be a number ≥ 1"}), 400

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM"}), 400

    if poster:
        # 1. Save locally first
        filename = secure_filename(poster.filename)
        os.makedirs(UPLOAD_TEMP, exist_ok=True)
        local_path = os.path.join(UPLOAD_TEMP, filename)
        poster.save(local_path)

        try:
            # 2. Upload to Cloudinary from local path
            result = upload(local_path, folder="event_posters")
            poster_url = result.get("secure_url")

            # 3. Delete local temp file
            os.remove(local_path)

        except CloudinaryError as e:
            if os.path.exists(local_path):
                os.remove(local_path)  # Always cleanup
            return jsonify({"error": "Image upload failed", "details": str(e)}), 500

    event = Event(
        title=title,
        description=description,
        date=date,
        country=country,
        city=city,
        poster_url=poster_url,
        location=location,
        seats_available = seats,
        organizer=user
    )
    event.save()

    return jsonify({"message": "Event created successfully", "event": event.to_json()}), 201


from flask import request, jsonify
from app.models.event_model import Event
from datetime import datetime

def get_events():
    country = request.args.get("country")
    city = request.args.get("city")

    # Start date parts
    start_year = request.args.get("start_year", type=int)
    start_month = request.args.get("start_month", type=int)
    start_day = request.args.get("start_day", type=int)

    # End date parts
    end_year = request.args.get("end_year", type=int)
    end_month = request.args.get("end_month", type=int)
    end_day = request.args.get("end_day", type=int)

    query = {}
    if country:
        query["country__iexact"] = country
    if city:
        query["city__iexact"] = city

    # Build date range filter if both start and end date are valid
    if start_year and start_month and start_day and end_year and end_month and end_day:
        try:
            from_date = datetime(start_year, start_month, start_day)
            to_date = datetime(end_year, end_month, end_day, 23, 59, 59)
            query["date__gte"] = from_date
            query["date__lte"] = to_date
        except ValueError:
            return jsonify({"error": "Invalid date range"}), 400

    events = Event.objects(**query)

    return jsonify({
        "count": len(events),
        "events": [event.to_json() for event in events]
    }), 200


def get_event_by_id(event_id):
    try:
        # Validate if event_id is a valid ObjectId
        ObjectId(event_id)

        # Find the event by ID
        event = Event.objects.get(id=event_id)
        return jsonify({"event": event.to_json()}), 200

    except (ValidationError, DoesNotExist):
        return jsonify({"error": "Event not found"}), 404