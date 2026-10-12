import os

from flask import Blueprint, request, jsonify
from database import get_db_connection
from utils.security import verify_password, hash_password
from utils.jwt_handler import create_token
import random
from utils.email import send_otp
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import base64
import io
import numpy as np
from PIL import Image
import face_recognition
from extensions import mail

from flask_mail import Message

auth = Blueprint("auth", __name__)
reset_otps = {}  # Dictionary to store OTPs for password reset

@auth.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()

        full_name = data.get("full_name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not full_name or not email or not password:
            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        otp = str(random.randint(100000, 999999))
        otp_expiry = datetime.now() + timedelta(minutes=5)

        hashed_password = hash_password(password)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO users (full_name, email, password, otp, otp_expiry, is_verified)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (full_name, email, hashed_password.decode("utf-8"), otp, otp_expiry, False)
        )

        conn.commit()
        send_otp(current_app.extensions['mail'], email, otp)

        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "User Registered Successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT id, full_name, email, password FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        cur.close()
        conn.close()

        if user is None:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        stored_password = user[3].encode("utf-8")

        if verify_password(password, stored_password):
            token = create_token(user[0], user[2])
            return jsonify({
                "success": True,
                "message": "Login Successful",
                "token": token,
                "user": {
                    "id": user[0],
                    "full_name": user[1],
                    "email": user[2]
                }
            }), 200

        else:
            return jsonify({
                "success": False,
                "message": "Invalid Password"
            }), 401

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/verify-otp", methods=["POST"])
def verify_otp():
    try:
        data = request.get_json()

        email = data["email"]
        otp = data["otp"]

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT otp, otp_expiry
            FROM users
            WHERE email=%s
        """, (email,))

        user = cur.fetchone()

        if user is None:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        db_otp = user[0]
        otp_expiry = user[1]

        if datetime.now() > otp_expiry:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "OTP Expired"
            }), 400

        if otp != db_otp:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Invalid OTP"
            }), 400

        cur.execute("""
            UPDATE users
            SET is_verified = TRUE,
                otp = NULL,
                otp_expiry = NULL
            WHERE email=%s
        """, (email,))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "OTP Verified Successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/register-face", methods=["POST"])
def register_face():
    try:
        data = request.get_json()

        email = data["email"]
        image_data = data["image"]

        # Remove Base64 header
        image_data = image_data.split(",")[1]

        # Decode image
        image_bytes = base64.b64decode(image_data)

        # Convert image to numpy array
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)

        # Detect face
        face_locations = face_recognition.face_locations(image_array)

        if len(face_locations) == 0:
            return jsonify({
                "success": False,
                "message": "No face detected"
            }), 400

        if len(face_locations) > 1:
            return jsonify({
                "success": False,
                "message": "Multiple faces detected. Please keep only one face."
            }), 400

        # Generate face encoding
        face_encodings = face_recognition.face_encodings(
            image_array,
            face_locations
        )

        if not face_encodings:
            return jsonify({
                "success": False,
                "message": "Could not generate face encoding"
            }), 400

        face_encoding = face_encodings[0]

        # Convert encoding to string
        face_encoding_string = ",".join(
            map(str, face_encoding)
        )

        # Save to database
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE users
            SET face_encoding = %s
            WHERE email = %s
            """,
            (face_encoding_string, email)
        )

        if cur.rowcount == 0:
            cur.close()
            conn.close()

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Face Registered Successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/face-login", methods=["POST"])
def face_login():
    try:
        data = request.get_json()

        image_data = data["image"]

        # Remove Base64 header
        image_data = image_data.split(",")[1]

        # Decode image
        image_bytes = base64.b64decode(image_data)

        # Convert image to numpy array
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)

        # Detect face
        face_locations = face_recognition.face_locations(image_array)

        if len(face_locations) == 0:
            return jsonify({
                "success": False,
                "message": "No face detected"
            }), 400

        if len(face_locations) > 1:
            return jsonify({
                "success": False,
                "message": "Multiple faces detected"
            }), 400

        # Generate face encoding
        face_encodings = face_recognition.face_encodings(
            image_array,
            face_locations
        )

        if not face_encodings:
            return jsonify({
                "success": False,
                "message": "Could not generate face encoding"
            }), 400

        current_encoding = face_encodings[0]

        # Get all registered users
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, full_name, email, face_encoding
            FROM users
            WHERE face_encoding IS NOT NULL
            AND is_verified = TRUE
            """
        )

        users = cur.fetchall()

        cur.close()
        conn.close()

        # Compare face
        for user in users:

            stored_encoding = np.array(
                [float(x) for x in user[3].split(",")]
            )

            match = face_recognition.compare_faces(
                [stored_encoding],
                current_encoding,
                tolerance=0.6
            )[0]

            if match:

                token = create_token(
                    user[0],
                    user[2]
                )

                return jsonify({
                    "success": True,
                    "message": "Face Login Successful",
                    "token": token,
                    "user": {
                        "id": user[0],
                        "full_name": user[1],
                        "email": user[2]
                    }
                }), 200

        return jsonify({
            "success": False,
            "message": "Face not recognized"
        }), 401

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()

        email = data.get("email", "").strip()

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT id FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        cur.close()
        conn.close()

        if user is None:
            return jsonify({
                "success": False,
                "message": "Email not registered"
            }), 404

        otp = str(random.randint(100000, 999999))

        reset_otps[email] = otp

        msg = Message(
            subject="Universal Software Brain - Password Reset OTP",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=[email]
        )

        msg.body = f"""
Hello,

Your OTP for password reset is:

{otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

Regards,
Universal Software Brain
"""

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/verify-reset-otp", methods=["POST"])
def verify_reset_otp():
    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        otp = data.get("otp", "").strip()

        if not email or not otp:
            return jsonify({
                "success": False,
                "message": "Email and OTP are required"
            }), 400

        stored_otp = reset_otps.get(email)

        if stored_otp is None:
            return jsonify({
                "success": False,
                "message": "OTP expired or not found"
            }), 400

        if stored_otp != otp:
            return jsonify({
                "success": False,
                "message": "Invalid OTP"
            }), 400

        return jsonify({
            "success": True,
            "message": "OTP verified successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@auth.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        new_password = data.get("new_password", "").strip()

        if not email or not new_password:
            return jsonify({
                "success": False,
                "message": "Email and new password are required"
            }), 400

        hashed_password = hash_password(new_password)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE users
            SET password=%s
            WHERE email=%s
            """,
            (
                hashed_password.decode("utf-8"),
                email
            )
        )

        if cur.rowcount == 0:
            cur.close()
            conn.close()

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        conn.commit()

        cur.close()
        conn.close()

        # Remove used OTP
        reset_otps.pop(email, None)

        return jsonify({
            "success": True,
            "message": "Password reset successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
     