from flask import Flask, jsonify, request
import flask_cors
import psycopg2
from flask_cors import CORS
from database import get_db_connection
from routes.auth import auth
from routes.profile import profile
from dotenv import load_dotenv
import os
load_dotenv()
from extensions import mail
from routes.code_ai import code_ai
from ai_engine.run_engine import run_project
from healthcare.routes import healthcare
from education.routes import education
from altron.routes import altron



app = Flask(__name__)
flask_cors.CORS(app)
app.register_blueprint(auth)
app.register_blueprint(profile)
app.register_blueprint(
    code_ai,
    url_prefix="/api/code"
)
app.register_blueprint(
    healthcare,
    url_prefix="/api/health"
)
app.register_blueprint(
    education,
    url_prefix="/api/education"
)
app.register_blueprint(
    altron,
    url_prefix="/api/altron"
)

from database import get_db_connection

try:
    conn = get_db_connection()
    print("✅ PostgreSQL Connected Successfully!")
    conn.close()

except Exception as e:
    print("❌ Database Connection Error:", e)

from flask_mail import Mail

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail.init_app(app)




@app.route("/")
def home():
    return "Universal Software Brain Backend Running..."

@app.route("/api/code/run", methods=["POST"])
def run_generated_project():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty"
            }), 400

        project_path = data.get("project_path")

        if not project_path:
            return jsonify({
                "status": "error",
                "message": "Project path is required"
            }), 400

        print("=" * 60)
        print("RUN PROJECT")
        print("PROJECT PATH:", project_path)
        print("=" * 60)

        result = run_project(project_path)

        print("RUN RESULT:")
        print(result)

        return jsonify(result)

    except Exception as e:

        print("=" * 60)
        print("RUN ERROR:", repr(e))
        print("=" * 60)

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)