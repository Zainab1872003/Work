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
        return {
            "id": str(self.id),
            "customer": str(self.customer.id),
            "event": self.event.to_json(),
            "booked_at": self.booked_at.strftime("%Y-%m-%d %H:%M")
        }
