from mongoengine import Document, ReferenceField, DateTimeField
from app.models.user_model import User
from app.models.event_model import Event
from datetime import datetime

class Booking(Document):
    customer = ReferenceField(User, required=True)
    event = ReferenceField(Event, required=True)
    booked_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'bookings'}

    def to_json(self):
        """
        Serializes the document to a JSON-friendly dictionary, now including
        the full customer and event details.
        """
        # --- START OF REQUIRED FIX ---

        # Safely dereference the User document to get customer details
        customer_details = {
            "id": str(self.customer.id),
            "name": self.customer.name,
            "email": self.customer.email
        } if self.customer else None

        return {
            "id": str(self.id),
            "customer": customer_details,  # This is now a rich object, not just an ID
            "event": self.event.to_json(),  # This already returns a full event object
            "booked_at": self.booked_at.strftime("%Y-%m-%d %H:%M")
        }

