from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from app.models.user_model import User

def vendor_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()

        if not user or user.role != "vendor":
            return jsonify({"error": "Access forbidden: vendors only"}), 403

        return fn(*args, **kwargs)
    return wrapper
def customer_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if not user or user.role != "customer":
            return jsonify({"error": "Access forbidden: customers only"}), 403
        return fn(*args, **kwargs)
    return wrapper
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from app.models.user_model import User

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()

        if not user or user.role != "admin":
            return jsonify({"error": "Access forbidden: admins only"}), 403

        return fn(*args, **kwargs)
    return wrapper
