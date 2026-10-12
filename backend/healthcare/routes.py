from flask import Blueprint, request, jsonify
import requests
from database import get_db_connection
from utils.jwt_handler import verify_token

from healthcare.symptom_service import analyze_symptoms
from healthcare.medicine_service import get_medicine_info
from healthcare.report_service import analyze_report
import os
from healthcare.medical_parser import parse_medical_report
from healthcare.ai_service import explain_medical_report
from healthcare.hospital_service import search_hospitals


healthcare = Blueprint("healthcare", __name__)

def get_authenticated_user_id():
    """Return the user_id from the JWT Bearer token, or None if invalid."""
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return None

    payload = verify_token(token)
    if not payload:
        return None

    return payload.get("user_id")


def unauthorized_response():
    return jsonify({
        "status": "error",
        "message": "Authentication required or token is invalid"
    }), 401



# =========================================================
# SYMPTOM CHECK
# =========================================================

@healthcare.route("/symptom-check", methods=["POST"])
def symptom_check():

    try:

        user_id = get_authenticated_user_id()
        if not user_id:
            return unauthorized_response()

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

        # Accept comma-separated string
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


# =========================================================
# MEDICINE INFO
# =========================================================

@healthcare.route("/medicine-info", methods=["POST"])
def medicine_info():

    try:

        user_id = get_authenticated_user_id()
        if not user_id:
            return unauthorized_response()

        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty"
            }), 400

        medicine = data.get("medicine", "").strip()

        if not medicine:
            return jsonify({
                "status": "error",
                "message": "Medicine name is required"
            }), 400

        result = get_medicine_info(medicine)

        if not result:
            return jsonify({
                "status": "error",
                "message": "Medicine information not found",
                "medicine": medicine
            }), 404

        return jsonify({
            "status": "success",
            "medicine": result
        })

    except Exception as e:

        print("MEDICINE ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# =========================================================
# HEALTH TIPS
# =========================================================

@healthcare.route("/health-tips", methods=["GET"])
def health_tips():

    conn = None
    cursor = None

    try:
        category = request.args.get("category")
        search = request.args.get("search")

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT
                id,
                title,
                category,
                short_description,
                why_it_matters,
                quick_action,
                source_name,
                source_url,
                icon,
                is_featured
            FROM health_tips
            WHERE is_active = TRUE
        """

        params = []

        # Category filter
        if category:
            query += " AND category = %s"
            params.append(category)

        # Search filter
        if search:
            query += """
                AND (
                    title ILIKE %s
                    OR short_description ILIKE %s
                    OR category ILIKE %s
                )
            """

            search_pattern = f"%{search}%"

            params.extend([
                search_pattern,
                search_pattern,
                search_pattern
            ])

        # Featured tips first
        query += """
            ORDER BY
                is_featured DESC,
                created_at DESC,
                id DESC
        """

        cursor.execute(query, tuple(params))

        rows = cursor.fetchall()

        tips = []

        for row in rows:
            tips.append({
                "id": row[0],
                "title": row[1],
                "category": row[2],
                "short_description": row[3],
                "why_it_matters": row[4],
                "quick_action": row[5],
                "source_name": row[6],
                "source_url": row[7],
                "icon": row[8],
                "is_featured": row[9]
            })

        return jsonify({
            "status": "success",
            "count": len(tips),
            "tips": tips
        }), 200

    except Exception as e:

        print("Health Tips Error:", str(e))

        return jsonify({
            "status": "error",
            "message": "Failed to fetch health tips"
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
# =========================================================
# FIND HOSPITALS
# =========================================================

@healthcare.route("/hospitals", methods=["GET"])
def find_hospitals():

    try:

        user_id = get_authenticated_user_id()
        if not user_id:
            return unauthorized_response()

        latitude = request.args.get("latitude")
        longitude = request.args.get("longitude")

        radius = request.args.get(
            "radius",
            default=5000,
            type=int
        )

        # -----------------------------------------
        # Validate coordinates
        # -----------------------------------------

        if not latitude or not longitude:

            return jsonify({
                "status": "error",
                "message": "Latitude and longitude are required"
            }), 400

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return jsonify({
                "status": "error",
                "message": "Invalid latitude or longitude"
            }), 400

        # -----------------------------------------
        # Validate coordinate range
        # -----------------------------------------

        if not -90 <= latitude <= 90:

            return jsonify({
                "status": "error",
                "message": "Invalid latitude"
            }), 400

        if not -180 <= longitude <= 180:

            return jsonify({
                "status": "error",
                "message": "Invalid longitude"
            }), 400

        # -----------------------------------------
        # Limit search radius
        # -----------------------------------------

        radius = max(
            1000,
            min(radius, 25000)
        )

        print("=" * 60)
        print("HOSPITAL SEARCH")
        print("LATITUDE:", latitude)
        print("LONGITUDE:", longitude)
        print("RADIUS:", radius)
        print("=" * 60)

        hospitals = search_hospitals(
            latitude,
            longitude,
            radius
        )

        return jsonify({
            "status": "success",
            "count": len(hospitals),
            "latitude": latitude,
            "longitude": longitude,
            "radius_meters": radius,
            "hospitals": hospitals
        })

    except requests.RequestException as e:

        print(
            "HOSPITAL API ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": "Hospital service is temporarily unavailable"
        }), 503

    except Exception as e:

        print(
            "HOSPITAL SEARCH ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": "Unable to find hospitals"
        }), 500
@healthcare.route("/report-analyze", methods=["POST"])
def report_analyze():

    try:

        user_id = get_authenticated_user_id()
        if not user_id:
            return unauthorized_response()

        # ============================================
        # CHECK FILE
        # ============================================

        if "file" not in request.files:

            return jsonify({
                "status": "error",
                "message": "Report file is required"
            }), 400

        file = request.files["file"]

        if not file.filename:

            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400

        # ============================================
        # UPLOAD DIRECTORY
        # ============================================

        upload_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "uploads",
            "healthcare"
        )

        os.makedirs(
            upload_dir,
            exist_ok=True
        )

        # ============================================
        # SAVE FILE
        # ============================================

        filename = file.filename

        file_path = os.path.join(
            upload_dir,
            filename
        )

        file.save(file_path)

        print("=" * 60)
        print("REPORT UPLOAD")
        print("Filename:", filename)
        print("=" * 60)

        # ============================================
        # EXTRACT TEXT FROM REPORT
        # ============================================

        result = analyze_report(file_path)

        print("TEXT EXTRACTION COMPLETED")

        # ============================================
        # PARSE MEDICAL VALUES
        # ============================================

        parsed_data = parse_medical_report(
            result.get("text", "")
        )

        print("MEDICAL PARAMETERS:")
        print(parsed_data)

        # ============================================
        # SAVE PARSED PARAMETERS TO HEALTH VITALS
        # ============================================

        parameters = parsed_data.get("parameters", [])

        if parameters:
            conn = get_db_connection()
            cursor = conn.cursor()

            try:
                for parameter in parameters:
                    if parameter.get("value") is None or not parameter.get("name"):
                        continue

                    cursor.execute("""
                        INSERT INTO health_vitals
                        (
                            user_id,
                            vital_name,
                            value,
                            unit,
                            source,
                            report_name
                        )
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        user_id,
                        parameter.get("name"),
                        parameter.get("value"),
                        parameter.get("unit"),
                        "report",
                        filename
                    ))

                conn.commit()
            except Exception:
                conn.rollback()
                raise
            finally:
                cursor.close()
                conn.close()

        # ============================================
        # EXPLAIN MEDICAL REPORT
        # ============================================

        ai_explanation = explain_medical_report(
        parsed_data.get("parameters", []),
        result.get("text", "")
        )

        # ============================================
        # DELETE TEMPORARY FILE
        # ============================================

        try:

            os.remove(file_path)

        except Exception:

            pass

        # ============================================
        # FINAL RESPONSE
        # ============================================

        return jsonify({

            "status": "success",

            "filename": result.get(
                "filename",
                filename
            ),

            "text": result.get(
                "text",
                ""
            ),

            "parameters": parsed_data.get(
                "parameters",
                []
            ),
            "summary": parsed_data.get("summary", {}),
            "ai_explanation": ai_explanation

        })

    except Exception as e:

        print("=" * 60)
        print("REPORT ANALYZER ERROR:")
        print(repr(e))
        print("=" * 60)

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500
    # =========================================================
# GET MEDICATIONS
# =========================================================

@healthcare.route("/medications", methods=["GET"])
def get_medications():

    try:
        user_id = get_authenticated_user_id()

        if not user_id:
            return unauthorized_response()

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                user_id,
                medicine_name,
                dosage,
                frequency,
                time,
                start_date,
                end_date,
                status,
                completed,
                created_at
            FROM medications
            WHERE user_id = %s
            ORDER BY time ASC
        """, (user_id,))

        rows = cursor.fetchall()

        medications = []

        for row in rows:
            medications.append({
                "id": row[0],
                "user_id": row[1],
                "medicine_name": row[2],
                "dosage": row[3],
                "frequency": row[4],
                "time": row[5].strftime("%H:%M") if row[5] else None,
                "start_date": row[6].isoformat() if row[6] else None,
                "end_date": row[7].isoformat() if row[7] else None,
                "status": row[8],
                "completed": row[9],
                "created_at": row[10].isoformat() if row[10] else None
            })

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "count": len(medications),
            "medications": medications
        })

    except Exception as e:

        print("GET MEDICATIONS ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Unable to fetch medications"
        }), 500
    
    # =========================================================
# UPDATE MEDICATION STATUS
# =========================================================

@healthcare.route("/medications/<int:medication_id>", methods=["PUT"])
def update_medication(medication_id):

    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return unauthorized_response()

        data = request.get_json() or {}

        completed = data.get("completed")

        if completed is None:
            return jsonify({
                "status": "error",
                "message": "completed is required"
            }), 400

        status = "Done" if completed else "Upcoming"

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE medications
            SET
                completed = %s,
                status = %s
            WHERE id = %s AND user_id = %s
            RETURNING id
        """, (
            completed,
            status,
            medication_id,
            user_id
        ))

        updated = cursor.fetchone()

        if not updated:
            cursor.close()
            conn.close()

            return jsonify({
                "status": "error",
                "message": "Medication not found"
            }), 404

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Medication updated successfully",
            "medication_id": medication_id,
            "completed": completed,
            "status": status
        })

    except Exception as e:

        print("UPDATE MEDICATION ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Unable to update medication"
        }), 500
    # =========================================================
# ADD MEDICATION
# =========================================================

@healthcare.route("/medications", methods=["POST"])
def add_medication():
    try:
        data = request.get_json()

        # -----------------------------------------
        # CHECK REQUEST BODY
        # -----------------------------------------

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty"
            }), 400

        # -----------------------------------------
        # GET DATA
        # -----------------------------------------

        user_id = get_authenticated_user_id()
        medicine_name = data.get("medicine_name")
        dosage = data.get("dosage")
        frequency = data.get("frequency")
        medicine_time = data.get("time")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # -----------------------------------------
        # VALIDATION
        # -----------------------------------------

        if not user_id:
            return unauthorized_response()

        if not medicine_name:
            return jsonify({
                "status": "error",
                "message": "Medicine name is required"
            }), 400

        if not medicine_time:
            return jsonify({
                "status": "error",
                "message": "Medicine time is required"
            }), 400

        # -----------------------------------------
        # DATABASE CONNECTION
        # -----------------------------------------

        conn = get_db_connection()
        cursor = conn.cursor()

        # -----------------------------------------
        # INSERT MEDICATION
        # -----------------------------------------

        cursor.execute(
            """
            INSERT INTO medications
            (
                user_id,
                medicine_name,
                dosage,
                frequency,
                time,
                start_date,
                end_date,
                status,
                completed
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                'Upcoming',
                FALSE
            )
            RETURNING id
            """,
            (
                user_id,
                medicine_name,
                dosage,
                frequency,
                medicine_time,
                start_date,
                end_date
            )
        )

        # -----------------------------------------
        # GET INSERTED ID
        # -----------------------------------------

        result = cursor.fetchone()

        if result is None:
            conn.rollback()
            cursor.close()
            conn.close()

            return jsonify({
                "status": "error",
                "message": "Medication was not inserted"
            }), 500

        medication_id = result[0]

        # -----------------------------------------
        # COMMIT
        # -----------------------------------------

        conn.commit()

        # -----------------------------------------
        # CLOSE DATABASE
        # -----------------------------------------

        cursor.close()
        conn.close()

        # -----------------------------------------
        # RESPONSE
        # -----------------------------------------

        return jsonify({
            "status": "success",
            "message": "Medication added successfully",
            "medication_id": medication_id
        }), 201

    except Exception as e:
        print("ADD MEDICATION ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    # =========================================================
# ADD HEALTH VITAL
# =========================================================

@healthcare.route("/vitals", methods=["POST"])
def add_vital():

    try:
        data = request.get_json() or {}

        user_id = get_authenticated_user_id()
        vital_name = data.get("vital_name")
        value = data.get("value")
        unit = data.get("unit")
        source = data.get("source", "manual")
        recorded_at = data.get("recorded_at")
        report_name = data.get("report_name")

        # -----------------------------------------
        # VALIDATION
        # -----------------------------------------

        if not user_id:
            return unauthorized_response()

        if not vital_name:
            return jsonify({
                "status": "error",
                "message": "vital_name is required"
            }), 400

        if value is None:
            return jsonify({
                "status": "error",
                "message": "value is required"
            }), 400

        # -----------------------------------------
        # DATABASE CONNECTION
        # -----------------------------------------

        conn = get_db_connection()
        cursor = conn.cursor()

        # -----------------------------------------
        # INSERT WITH RECORDED DATE
        # -----------------------------------------

        if recorded_at:

            cursor.execute(
                """
                INSERT INTO health_vitals
                (
                    user_id,
                    vital_name,
                    value,
                    unit,
                    source,
                    recorded_at,
                    report_name
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    user_id,
                    vital_name,
                    value,
                    unit,
                    source,
                    recorded_at,
                    report_name
                )
            )

        # -----------------------------------------
        # INSERT WITHOUT RECORDED DATE
        # -----------------------------------------

        else:

            cursor.execute(
                """
                INSERT INTO health_vitals
                (
                    user_id,
                    vital_name,
                    value,
                    unit,
                    source,
                    report_name
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    user_id,
                    vital_name,
                    value,
                    unit,
                    source,
                    report_name
                )
            )

        # -----------------------------------------
        # GET INSERTED ID
        # -----------------------------------------

        row = cursor.fetchone()

        if not row:

            conn.rollback()
            cursor.close()
            conn.close()

            return jsonify({
                "status": "error",
                "message": "Unable to retrieve saved vital"
            }), 500

        vital_id = row[0]

        # -----------------------------------------
        # COMMIT
        # -----------------------------------------

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Vital saved successfully",
            "vital_id": vital_id
        }), 201

    except Exception as e:

        print("ADD VITAL ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Unable to save vital"
        }), 500


# =========================================================
# GET HEALTH VITALS
# =========================================================

@healthcare.route("/vitals", methods=["GET"])
def get_vitals():

    try:

        user_id = get_authenticated_user_id()

        if not user_id:
            return unauthorized_response()

        # -----------------------------------------
        # DATABASE CONNECTION
        # -----------------------------------------

        conn = get_db_connection()
        cursor = conn.cursor()

        # -----------------------------------------
        # FETCH VITALS
        # -----------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                vital_name,
                value,
                unit,
                source,
                recorded_at,
                report_name,
                created_at
            FROM health_vitals
            WHERE user_id = %s
            ORDER BY recorded_at DESC
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        vitals = []

        # -----------------------------------------
        # FORMAT RESPONSE
        # -----------------------------------------

        for row in rows:

            vitals.append({
                "id": row[0],
                "user_id": row[1],
                "vital_name": row[2],
                "value": float(row[3]),
                "unit": row[4],
                "source": row[5],
                "recorded_at": (
                    row[6].isoformat()
                    if row[6]
                    else None
                ),
                "report_name": row[7],
                "created_at": (
                    row[8].isoformat()
                    if row[8]
                    else None
                )
            })

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "count": len(vitals),
            "vitals": vitals
        })

    except Exception as e:

        print("GET VITALS ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Unable to fetch vitals"
        }), 500