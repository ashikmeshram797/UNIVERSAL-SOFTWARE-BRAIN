from flask import Blueprint, current_app, jsonify, request
from ai_engine.generator import generate_code


code_ai = Blueprint(
    "code_ai",
    __name__
)


@code_ai.route("/generate", methods=["POST"])
def generate():

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must be a JSON object"
        }), 400

    prompt = data.get("prompt")
    model = data.get("model", "qwen-1.5b")

    if not isinstance(prompt, str) or not prompt.strip():
        return jsonify({
            "error": "A non-empty prompt is required"
        }), 400

    try:
        result = generate_code(prompt.strip(), model)
        return jsonify(result)
    except Exception as exc:
        current_app.logger.exception("Code generation failed")
        return jsonify({
            "error": str(exc)
        }), 502