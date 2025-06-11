from flask import request, jsonify
from app import bcrypt
from mongoengine.errors import NotUniqueError
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    set_access_cookies, unset_jwt_cookies, get_jwt_identity, get_jwt , set_refresh_cookies
)
from app.models.refresh_token_model import RefreshToken
from app.models.user_model import User
from datetime import datetime


def register_user():
    data = request.get_json()

    # Extract user data
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not name or not email or not password or role not in ["vendor", "customer"]:
        return jsonify({"error": "Missing or invalid fields"}), 400

    # Hash password
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        user = User(
            name=name,
            email=email,
            password=hashed_pw,
            role=role
        )
        user.save()
    except NotUniqueError:
        return jsonify({"error": "Email already exists"}), 409

    return jsonify({"message": "User registered successfully", "user": user.to_json()}), 201

def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user by email
    user = User.objects(email=email).first()

    # Check if user exists and password matches
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    RefreshToken(token=refresh_token, user=user).save()

    response = jsonify({"message": "Login successful"})
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200

@jwt_required(refresh=True)
def refresh():
    jwt_data = get_jwt()
    user_id = jwt_data["sub"]
    jti = jwt_data["jti"]

    # Verify refresh token exists in DB
    token_entry = RefreshToken.objects(token=jti, user=user_id).first()
    if not token_entry or token_entry.expires_at < datetime.utcnow():
        return jsonify({"error": "Invalid or expired refresh token"}), 403

        # 2. Delete the old refresh token
    token_entry.delete()

    # 3. Generate new tokens
    new_access_token = create_access_token(identity=user_id)
    new_refresh_token = create_refresh_token(identity=user_id)

    # 4. Save new refresh token in DB
    RefreshToken(token=new_refresh_token, user=user_id).save()

    # 5. Set both tokens in HttpOnly cookies
    response = jsonify({"message": "Token rotated"})
    set_access_cookies(response, new_access_token)
    set_refresh_cookies(response, new_refresh_token)
    return response, 200

@jwt_required()
def logout():
    user_id = get_jwt_identity()
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
        RefreshToken.objects(token=refresh_token, user=user_id).delete()

    response = jsonify({"message": "Logged out successfully"})
    unset_jwt_cookies(response)  # clears access_token_cookie and refresh_token_cookie
    response.set_cookie("refresh_token", "", expires=0)  # explicitly clear in case not handled
    return response, 200

@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "User fetched successfully",
        "user": user.to_json()
    }), 200