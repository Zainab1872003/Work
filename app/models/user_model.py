from mongoengine import Document, StringField, EmailField

class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(required=True, choices=("vendor", "customer"))

    meta = {
        'collection': 'users'
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "role": self.role
        }
