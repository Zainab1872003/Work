from flask import Flask
from flask_mongoengine import MongoEngine
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from flask import jsonify
from flask_cors import CORS

db = MongoEngine()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({"error": "File too large. Max limit is 10MB."}), 413

    from app.routes.auth_route import auth_bp
    from app.routes.event_route import event_bp
    from app.routes.booking_route import booking_bp
    from app.routes.admin_routes import admin_bp
    # app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(booking_bp, url_prefix="/api/booking")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(event_bp, url_prefix="/api/event")


    return app
