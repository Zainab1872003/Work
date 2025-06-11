from mongoengine import Document, StringField, DateTimeField, ReferenceField
from datetime import datetime, timedelta
from app.models.user_model import User

class RefreshToken(Document):
    token = StringField(required=True, unique=True)
    user = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    expires_at = DateTimeField(default=lambda: datetime.utcnow() + timedelta(days=7))

    meta = {"collection": "refresh_tokens"}
