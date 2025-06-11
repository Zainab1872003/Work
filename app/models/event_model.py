from mongoengine import Document, StringField, DateTimeField, ReferenceField , IntField
from app.models.user_model import User
from datetime import datetime

class Event(Document):
    title = StringField(required=True)
    seats_available = IntField(required=True, min_value=1)
    description = StringField()
    date = DateTimeField(required=True)
    country = StringField(required=True)
    poster_url = StringField()
    city = StringField(required=True)
    location = StringField()
    organizer = ReferenceField(User, required=True)

    meta = {'collection': 'events'}

    def to_json(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "seats_available": self.seats_available,
            "date": self.date.strftime("%Y-%m-%d %H:%M"),
            "country": self.country,
            "city": self.city,
            "location": self.location,
            "organizer": str(self.organizer.id)
        }
