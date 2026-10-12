from flask import Blueprint, request, jsonify

from .agent import process_command


altron = Blueprint("altron", __name__)


@altron.route("/command", methods=["POST"])
def altron_command():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty."
            }), 400

        message = data.get("message")

        if not message:
            return jsonify({
                "status": "error",
                "message": "Message is required."
            }), 400

        print("=" * 60)
        print("ALTRON USER:", message)
        print("=" * 60)

        result = process_command(message)

        print("ALTRON RESPONSE:", result)

        return jsonify(result)

    except Exception as e:

        print("=" * 60)
        print("ALTRON ERROR:", repr(e))
        print("=" * 60)

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500