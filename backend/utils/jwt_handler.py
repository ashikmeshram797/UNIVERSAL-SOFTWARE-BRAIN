import jwt
import datetime

SECRET_KEY = "UniversalSoftwareBrain@2026"  # Replace with your own secret

def create_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None