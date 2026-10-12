from flask import Blueprint, request, jsonify
from healthcare.symptom_service import analyze_symptoms

healthcare = Blueprint("healthcare", __name__)


@healthcare.route("/symptom-check", methods=["POST"])
def symptom_check():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty"
            }), 400

        symptoms = data.get("symptoms")

        if not symptoms:
            return jsonify({
                "status": "error",
                "message": "Symptoms are required"
            }), 400

        if isinstance(symptoms, str):
            symptoms = symptoms.split(",")

        predictions = analyze_symptoms(symptoms)

        return jsonify({
            "status": "success",
            "symptoms": symptoms,
            "predictions": predictions
        })

    except Exception as e:

        print("SYMPTOM ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500