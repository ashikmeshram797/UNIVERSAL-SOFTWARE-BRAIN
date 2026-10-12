from flask import Blueprint, request, jsonify
from utils.jwt_handler import verify_token

profile = Blueprint("profile", __name__)

@profile.route("/profile", methods=["GET"])
def get_profile():

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({
            "success": False,
            "message": "Token Missing"
        }), 401

    token = auth_header.split(" ")[1]

    payload = verify_token(token)

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid Token"
        }), 401

    return jsonify({
        "success": True,
        "message": "Welcome",
        "user_id": payload["user_id"],
        "email": payload["email"]
    })