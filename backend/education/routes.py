import json
import os
import uuid

from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename

from .ai_service import ask_study_assistant
from utils.jwt_handler import verify_token
from database import get_db_connection
from .quiz_service import generate_quiz
from .notes_service import (
    extract_text_from_pdf,
    generate_notes_summary,
    generate_key_points,
    generate_structured_notes,
    ask_question_about_notes
)
from .lesson_service import generate_lesson_plan
from .resource_service import get_lesson_resources
from .exam_service import generate_exam_preparation


education = Blueprint(
    "education",
    __name__
)
def get_logged_in_user():
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

@education.route("/study/conversations", methods=["POST"])
def create_conversation():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    title = data.get("title", "New Study Chat").strip()
    subject = data.get("subject", "").strip()
    topic = data.get("topic", "").strip()

    if not title:
        title = "New Study Chat"

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO study_conversations
                (user_id, title, subject, topic)
            VALUES
                (%s, %s, %s, %s)
            RETURNING id, title, subject, topic, created_at, updated_at
        """, (
            user_id,
            title,
            subject,
            topic
        ))

        conversation = cursor.fetchone()
        if conversation is None:
            conn.rollback()

            return jsonify({
                "status": "error",
                "message": "Conversation was not created"
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "conversation": {
                "id": conversation[0],
                "title": conversation[1],
                "subject": conversation[2],
                "topic": conversation[3],
                "created_at": conversation[4],
                "updated_at": conversation[5]
            }
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()

        print("CREATE CONVERSATION ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if conn:
            conn.close()
@education.route("/study/conversations", methods=["GET"])
def get_conversations():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                title,
                subject,
                topic,
                created_at,
                updated_at
            FROM study_conversations
            WHERE user_id = %s
            ORDER BY updated_at DESC
            LIMIT 50
        """, (user_id,))

        rows = cursor.fetchall()

        conversations = []

        for row in rows:
            conversations.append({
                "id": row[0],
                "title": row[1],
                "subject": row[2],
                "topic": row[3],
                "created_at": row[4],
                "updated_at": row[5]
            })

        cursor.close()

        return jsonify({
            "status": "success",
            "conversations": conversations
        }), 200

    except Exception as e:
        print("GET CONVERSATIONS ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if conn:
            conn.close()
@education.route("/study/conversations/<int:conversation_id>", methods=["GET"])
def get_conversation(conversation_id):
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # First verify that this conversation belongs to logged-in user
        cursor.execute("""
            SELECT
                id,
                title,
                subject,
                topic,
                created_at,
                updated_at
            FROM study_conversations
            WHERE id = %s
              AND user_id = %s
        """, (conversation_id, user_id))

        conversation = cursor.fetchone()

        if conversation is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Conversation not found"
            }), 404

        # Get all messages of this conversation
        cursor.execute("""
            SELECT
                id,
                role,
                message,
                created_at
            FROM study_messages
            WHERE conversation_id = %s
            ORDER BY id ASC
        """, (conversation_id,))

        rows = cursor.fetchall()

        messages = []

        for row in rows:
            messages.append({
                "id": row[0],
                "role": row[1],
                "message": row[2],
                "created_at": row[3]
            })

        cursor.close()

        return jsonify({
            "status": "success",
            "conversation": {
                "id": conversation[0],
                "title": conversation[1],
                "subject": conversation[2],
                "topic": conversation[3],
                "created_at": conversation[4],
                "updated_at": conversation[5]
            },
            "messages": messages
        }), 200

    except Exception as e:
        print("GET CONVERSATION ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if conn:
            conn.close()



# =========================================================
# EDUCATION BACKEND TEST
# =========================================================

@education.route("/test", methods=["GET"])
def education_test():

    return jsonify({
        "status": "success",
        "message": "Education Agent Backend is working!"
    })


# =========================================================
# STUDY ASSISTANT
# =========================================================

@education.route("/study/ask", methods=["POST"])
def study_ask():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is empty"
            }), 400


        question = data.get("question", "").strip()
        subject = data.get("subject", "").strip()
        topic = data.get("topic", "").strip()


        if not question:

            return jsonify({
                "status": "error",
                "message": "Question is required"
            }), 400


        print("=" * 60)
        print("EDUCATION STUDY ASSISTANT")
        print("SUBJECT:", subject)
        print("TOPIC:", topic)
        print("QUESTION:", question)
        print("=" * 60)


        answer = ask_study_assistant(
            question=question,
            subject=subject,
            topic=topic
        )


        return jsonify({
            "status": "success",
            "answer": answer
        })


    except ValueError as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


    except Exception as e:

        print(
            "STUDY ASSISTANT ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
# =========================================================
# STUDY CONVERSATION ASK
# =========================================================

@education.route(
    "/study/conversations/<int:conversation_id>/ask",
    methods=["POST"]
)
def conversation_ask(conversation_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "status": "error",
            "message": "Question is required"
        }), 400

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # -------------------------------------------------
        # 1. Verify conversation belongs to logged-in user
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                id,
                title,
                subject,
                topic
            FROM study_conversations
            WHERE id = %s
              AND user_id = %s
        """, (
            conversation_id,
            user_id
        ))

        conversation = cursor.fetchone()

        if conversation is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Conversation not found"
            }), 404

        conversation_subject = conversation[2] or ""
        conversation_topic = conversation[3] or ""

        # -------------------------------------------------
        # 2. Save USER message
        # -------------------------------------------------

        cursor.execute("""
            INSERT INTO study_messages
                (conversation_id, role, message)
            VALUES
                (%s, %s, %s)
            RETURNING id, role, message, created_at
        """, (
            conversation_id,
            "user",
            question
        ))

        user_message = cursor.fetchone()

        if user_message is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "User message was not saved"
            }), 500

        # -------------------------------------------------
        # 3. Ask AI
        # -------------------------------------------------

        answer = ask_study_assistant(
            question=question,
            subject=conversation_subject,
            topic=conversation_topic
        )

        # -------------------------------------------------
        # 4. Save BOT message
        # -------------------------------------------------

        cursor.execute("""
            INSERT INTO study_messages
                (conversation_id, role, message)
            VALUES
                (%s, %s, %s)
            RETURNING id, role, message, created_at
        """, (
            conversation_id,
            "bot",
            answer
        ))

        bot_message = cursor.fetchone()

        if bot_message is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Bot message was not saved"
            }), 500

        # -------------------------------------------------
        # 5. Update conversation timestamp
        # -------------------------------------------------

        cursor.execute("""
            UPDATE study_conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (
            conversation_id,
        ))

        # -------------------------------------------------
        # 6. Commit everything
        # -------------------------------------------------

        conn.commit()

        cursor.close()

        # -------------------------------------------------
        # 7. Return response
        # -------------------------------------------------

        return jsonify({
            "status": "success",
            "conversation_id": conversation_id,

            "user_message": {
                "id": user_message[0],
                "role": user_message[1],
                "message": user_message[2],
                "created_at": user_message[3]
            },

            "bot_message": {
                "id": bot_message[0],
                "role": bot_message[1],
                "message": bot_message[2],
                "created_at": bot_message[3]
            },

            "answer": answer
        }), 200

    except ValueError as e:

        if conn:
            conn.rollback()

        print(
            "CONVERSATION ASK VALUE ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "CONVERSATION ASK ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
# =========================================================
# QUIZ GENERATOR
# =========================================================

@education.route("/quiz/generate", methods=["POST"])
def quiz_generate():

    try:

        data = request.get_json() or {}

        subject = data.get("subject", "").strip()
        topic = data.get("topic", "").strip()

        question_types = data.get(
            "question_types",
            ["MCQs"]
        )

        count = data.get(
            "count",
            10
        )

        difficulty = data.get(
            "difficulty",
            "Medium"
        )

        # -------------------------------------------------
        # BASIC VALIDATION
        # -------------------------------------------------

        if not subject:

            return jsonify({
                "status": "error",
                "message": "Subject is required"
            }), 400

        if not topic:

            return jsonify({
                "status": "error",
                "message": "Topic is required"
            }), 400

        # -------------------------------------------------
        # QUESTION COUNT
        # -------------------------------------------------

        try:
            count = int(count)

        except (TypeError, ValueError):

            return jsonify({
                "status": "error",
                "message": "Question count must be a number"
            }), 400

        if count not in [10, 20, 30]:

            return jsonify({
                "status": "error",
                "message": "Question count must be 10, 20 or 30"
            }), 400

        # -------------------------------------------------
        # DIFFICULTY
        # -------------------------------------------------

        if difficulty not in [
            "Easy",
            "Medium",
            "Hard"
        ]:

            return jsonify({
                "status": "error",
                "message": (
                    "Difficulty must be Easy, Medium or Hard"
                )
            }), 400

        # -------------------------------------------------
        # QUESTION TYPES
        # -------------------------------------------------

        if not isinstance(question_types, list):

            return jsonify({
                "status": "error",
                "message": "question_types must be a list"
            }), 400

        if not question_types:

            return jsonify({
                "status": "error",
                "message": "At least one question type is required"
            }), 400

        # -------------------------------------------------
        # GENERATE QUIZ
        # -------------------------------------------------

        print("=" * 60)
        print("EDUCATION QUIZ GENERATOR")
        print("SUBJECT:", subject)
        print("TOPIC:", topic)
        print("QUESTION TYPES:", question_types)
        print("COUNT:", count)
        print("DIFFICULTY:", difficulty)
        print("=" * 60)

        quiz = generate_quiz(
            subject=subject,
            topic=topic,
            question_types=question_types,
            count=count,
            difficulty=difficulty
        )

        # -------------------------------------------------
        # TIMER CALCULATION
        # -------------------------------------------------

        time_per_question = {
            "Easy": 60,
            "Medium": 90,
            "Hard": 120
        }

        total_time_seconds = (
            count *
            time_per_question[difficulty]
        )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({

            "status": "success",

            "quiz": quiz,

            "quiz_settings": {
                "subject": subject,
                "topic": topic,
                "question_types": question_types,
                "count": count,
                "difficulty": difficulty
            },

            "timer": {
                "total_seconds": total_time_seconds,
                "minutes": total_time_seconds // 60
            }

        }), 200

    except ValueError as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:

        print(
            "QUIZ GENERATOR ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@education.route("/quiz/save", methods=["POST"])
def quiz_save():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    subject = data.get("subject", "").strip()
    topic = data.get("topic", "").strip()
    question_types = data.get("question_types", [])
    count = data.get("count")
    difficulty = data.get("difficulty", "")
    questions = data.get("questions", [])

    score = data.get("score", 0)
    correct_count = data.get("correct_count", 0)
    answers = data.get("answers", {})
    short_answers = data.get("short_answers", {})
    wrong_count = data.get("wrong_count", 0)
    skipped_count = data.get("skipped_count", 0)
    accuracy = data.get("accuracy", 0)
    time_taken = data.get("time_taken", 0)

    # Basic validation
    if not subject or not topic:
        return jsonify({
            "status": "error",
            "message": "Subject and topic are required"
        }), 400

    if not isinstance(question_types, list) or not question_types:
        return jsonify({
            "status": "error",
            "message": "Question types are required"
        }), 400

    if not isinstance(questions, list) or not questions:
        return jsonify({
            "status": "error",
            "message": "Questions are required"
        }), 400

    if difficulty not in ["Easy", "Medium", "Hard"]:
        return jsonify({
            "status": "error",
            "message": "Invalid difficulty"
        }), 400

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO quiz_history (
                user_id,
                subject,
                topic,
                question_types,
                question_count,
                difficulty,
                questions,
                answers,
                short_answers,
                score,
                correct_count,
                wrong_count,
                skipped_count,
                accuracy,
                time_taken
            )
            VALUES (
                %s,
                %s,
                %s,
                %s::jsonb,
                %s,
                %s,
                %s::jsonb,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id, created_at
        """, (
            user_id,
            subject,
            topic,
            json.dumps(question_types),
            count,
            difficulty,
            json.dumps(questions),
            json.dumps(answers),
            json.dumps(short_answers),
            score,
            correct_count,
            wrong_count,
            skipped_count,
            accuracy,
            time_taken
        ))

        result = cursor.fetchone()
        if result is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Quiz was not saved"
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Quiz saved successfully",
            "quiz_id": result[0],
            "created_at": result[1]
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()

        print("QUIZ SAVE ERROR:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to save quiz",
            "error": str(e)
        }), 500

    finally:
        if conn:
            conn.close()
@education.route("/quiz/recent", methods=["GET"])
def quiz_recent():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                subject,
                topic,
                question_types,
                question_count,
                difficulty,
                score,
                correct_count,
                wrong_count,
                skipped_count,
                accuracy,
                time_taken,
                created_at
            FROM quiz_history
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        """, (user_id,))

        rows = cursor.fetchall()

        quizzes = []

        for row in rows:
            quizzes.append({
                "id": row[0],
                "subject": row[1],
                "topic": row[2],
                "question_types": row[3],
                "count": row[4],
                "difficulty": row[5],
                "score": row[6],
                "correct_count": row[7],
                "wrong_count": row[8],
                "skipped_count": row[9],
                "accuracy": float(row[10]),
                "time_taken": row[11],
                "created_at": row[12]
            })

        cursor.close()

        return jsonify({
            "status": "success",
            "quizzes": quizzes
        }), 200

    except Exception as e:
        print("QUIZ RECENT ERROR:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to fetch recent quizzes",
            "error": str(e)
        }), 500

    finally:
        if conn:
            conn.close()                            
@education.route("/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                subject,
                topic,
                question_types,
                question_count,
                difficulty,
                questions,
                answers,
                short_answers,
                score,
                correct_count,
                wrong_count,
                skipped_count,
                accuracy,
                time_taken,
                created_at
            FROM quiz_history
            WHERE id = %s
              AND user_id = %s
        """, (
            quiz_id,
            user_id
        ))

        row = cursor.fetchone()

        if row is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Quiz not found"
            }), 404

        quiz = {
            "id": row[0],
            "subject": row[1],
            "topic": row[2],
            "question_types": row[3],
            "count": row[4],
            "difficulty": row[5],
            "questions": row[6],
            "answers": row[7],
            "short_answers": row[8],
            "score": row[9],
            "correct_count": row[10],
            "wrong_count": row[11],
            "skipped_count": row[12],
            "accuracy": float(row[13]),
            "time_taken": row[14],
            "created_at": row[15]
        }

        cursor.close()

        return jsonify({
            "status": "success",
            "quiz": quiz
        }), 200

    except Exception as e:

        print("GET QUIZ ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Failed to fetch quiz",
            "error": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
# =========================================================
# NOTES ANALYZER - PDF UPLOAD
# =========================================================

@education.route("/notes/upload", methods=["POST"])
def upload_notes_pdf():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    # -----------------------------------------------------
    # Check file
    # -----------------------------------------------------

    if "file" not in request.files:
        return jsonify({
            "status": "error",
            "message": "PDF file is required"
        }), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({
            "status": "error",
            "message": "No file selected"
        }), 400

    # -----------------------------------------------------
    # Secure filename
    # -----------------------------------------------------

    original_filename = secure_filename(file.filename)

    if not original_filename:
        return jsonify({
            "status": "error",
            "message": "Invalid file name"
        }), 400

    # -----------------------------------------------------
    # Only PDF
    # -----------------------------------------------------

    if not original_filename.lower().endswith(".pdf"):
        return jsonify({
            "status": "error",
            "message": "Only PDF files are supported"
        }), 400

    # -----------------------------------------------------
    # Check file size - Maximum 10 MB
    # -----------------------------------------------------

    file.seek(0, 2)
    file_size = file.tell()
    file.seek(0)

    if file_size > 10 * 1024 * 1024:
        return jsonify({
            "status": "error",
            "message": "File is larger than 10MB"
        }), 400

    # -----------------------------------------------------
    # Create user-specific upload folder
    # -----------------------------------------------------

    upload_dir = os.path.join(
        current_app.root_path,
        "uploads",
        "notes",
        str(user_id)
    )

    os.makedirs(upload_dir, exist_ok=True)

    # -----------------------------------------------------
    # Generate unique filename
    # -----------------------------------------------------

    unique_filename = (
        f"{uuid.uuid4().hex}_{original_filename}"
    )

    file_path = os.path.join(
        upload_dir,
        unique_filename
    )

    conn = None

    try:

        # -------------------------------------------------
        # 1. Save PDF physically
        # -------------------------------------------------

        file.save(file_path)

        print("PDF SAVED:", file_path)
        # -------------------------------------------------
        # Extract text from PDF
        # -------------------------------------------------

        extracted_text = extract_text_from_pdf(file_path)

        print(
            "PDF TEXT EXTRACTED:",
            len(extracted_text),
            "characters"
        )

        # -------------------------------------------------
        # 2. Save document information in database
        # -------------------------------------------------

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO notes_documents
                (
                    user_id,
                    file_name,
                    file_size,
                    file_path,
                    extracted_text,
                    status
                )
            VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
            RETURNING
                id,
                file_name,
                file_size,
                file_path,
                status,
                created_at
        """, (
            user_id,
            original_filename,
            file_size,
            file_path,
            extracted_text,
            "uploaded"
        ))

        document = cursor.fetchone()

        if document is None:
            conn.rollback()
            cursor.close()

            # Remove PDF if DB insert failed
            if os.path.exists(file_path):
                os.remove(file_path)

            return jsonify({
                "status": "error",
                "message": "Document was not saved"
            }), 500

        # -------------------------------------------------
        # 3. Commit DB
        # -------------------------------------------------

        conn.commit()
        cursor.close()

        # -------------------------------------------------
        # 4. Response
        # -------------------------------------------------

        return jsonify({
            "status": "success",
            "message": "PDF uploaded successfully",

            "document": {
                "id": document[0],
                "file_name": document[1],
                "file_size": document[2],
                "file_path": document[3],
                "status": document[4],
                "created_at": document[5]
            }
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        # -------------------------------------------------
        # Remove PDF if something failed
        # -------------------------------------------------

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

        print(
            "NOTES PDF UPLOAD ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
# =========================================================
# NOTES ANALYZER - GET USER FILES
# =========================================================

@education.route("/notes/files", methods=["GET"])
def get_notes_files():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                file_name,
                file_size,
                status,
                created_at
            FROM notes_documents
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))

        rows = cursor.fetchall()

        files = []

        for row in rows:
            files.append({
                "id": row[0],
                "file_name": row[1],
                "file_size": row[2],
                "status": row[3],
                "created_at": row[4]
            })

        cursor.close()

        return jsonify({
            "status": "success",
            "files": files
        }), 200

    except Exception as e:

        print(
            "GET NOTES FILES ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route("/notes/saved", methods=["GET"])
def get_saved_notes():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                d.id,
                d.file_name,
                d.file_size,
                d.subject,
                d.created_at,

                COALESCE(
                    (
                        SELECT a.summary
                        FROM notes_analysis a
                        WHERE a.document_id = d.id
                          AND a.summary IS NOT NULL
                        ORDER BY a.created_at DESC
                        LIMIT 1
                    ),
                    ''
                ) AS summary,

                COALESCE(
                    (
                        SELECT a.key_points
                        FROM notes_analysis a
                        WHERE a.document_id = d.id
                          AND a.key_points IS NOT NULL
                        ORDER BY a.created_at DESC
                        LIMIT 1
                    ),
                    ''
                ) AS key_points,

                COALESCE(
                    (
                        SELECT a.generated_notes
                        FROM notes_analysis a
                        WHERE a.document_id = d.id
                          AND a.generated_notes IS NOT NULL
                        ORDER BY a.created_at DESC
                        LIMIT 1
                    ),
                    ''
                ) AS generated_notes

            FROM notes_documents d

            WHERE d.user_id = %s

            ORDER BY d.created_at DESC
        """, (user_id,))

        rows = cursor.fetchall()

        cursor.close()

        notes = []

        for row in rows:

            has_analysis = any([
                row[5],
                row[6],
                row[7]
            ])

            notes.append({
                "document_id": row[0],
                "file_name": row[1],
                "file_size": row[2],
                "subject": row[3],
                "document_created_at": row[4],

                "analysis": {
                    "summary": row[5],
                    "key_points": row[6],
                    "generated_notes": row[7]
                } if has_analysis else None
            })

        return jsonify({
            "status": "success",
            "notes": notes
        }), 200

    except Exception as e:

        print(
            "GET SAVED NOTES ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route("/notes/<int:document_id>", methods=["GET"])
def get_notes_document(document_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                file_name,
                file_size,
                file_path,
                extracted_text,
                status,
                created_at,
                updated_at
            FROM notes_documents
            WHERE id = %s
              AND user_id = %s
        """, (document_id, user_id))

        row = cursor.fetchone()

        cursor.close()

        if row is None:
            return jsonify({
                "status": "error",
                "message": "Document not found"
            }), 404

        document = {
            "id": row[0],
            "file_name": row[1],
            "file_size": row[2],
            "file_path": row[3],
            "extracted_text": row[4],
            "status": row[5],
            "created_at": row[6],
            "updated_at": row[7]
        }

        return jsonify({
            "status": "success",
            "document": document
        }), 200

    except Exception as e:
        print("GET NOTES DOCUMENT ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if conn:
            conn.close()
@education.route("/notes/<int:document_id>/summarize", methods=["POST"])
def summarize_notes_document(document_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get document text
        cursor.execute("""
            SELECT
                id,
                file_name,
                extracted_text
            FROM notes_documents
            WHERE id = %s
              AND user_id = %s
        """, (document_id, user_id))

        document = cursor.fetchone()

        if document is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Document not found"
            }), 404

        extracted_text = document[2]

        if not extracted_text:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "No extracted text available for this PDF"
            }), 400

        # Temporary summary
        # AI summary integration will be added next
        summary = generate_notes_summary(extracted_text)

        # Save summary
        cursor.execute("""
            INSERT INTO notes_analysis
            (
                document_id,
                summary
            )
            VALUES
            (
                %s,
                %s
            )
            RETURNING
                id,
                document_id,
                summary,
                created_at
        """, (
            document_id,
            summary
        ))

        analysis = cursor.fetchone()
        if analysis is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Summary was not saved"
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Summary generated successfully",
            "analysis": {
                "id": analysis[0],
                "document_id": analysis[1],
                "summary": analysis[2],
                "created_at": analysis[3]
            }
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "SUMMARIZE NOTES ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route(
    "/notes/<int:document_id>/key-points",
    methods=["POST"]
)
def extract_notes_key_points(document_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                file_name,
                extracted_text
            FROM notes_documents
            WHERE id = %s
              AND user_id = %s
        """, (document_id, user_id))

        document = cursor.fetchone()

        if document is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Document not found"
            }), 404

        extracted_text = document[2]

        if not extracted_text:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "No extracted text available for this PDF"
            }), 400

        key_points = generate_key_points(
            extracted_text
        )

        cursor.execute("""
            INSERT INTO notes_analysis
            (
                document_id,
                key_points
            )
            VALUES
            (
                %s,
                %s
            )
            RETURNING
                id,
                document_id,
                key_points,
                created_at
        """, (
            document_id,
            key_points
        ))

        analysis = cursor.fetchone()

        if analysis is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Key points were not saved"
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Key points generated successfully",
            "analysis": {
                "id": analysis[0],
                "document_id": analysis[1],
                "key_points": analysis[2],
                "created_at": analysis[3]
            }
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "KEY POINTS NOTES ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route(
    "/notes/<int:document_id>/generate-notes",
    methods=["POST"]
)
def generate_notes(document_id):

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                file_name,
                extracted_text
            FROM notes_documents
            WHERE id = %s
              AND user_id = %s
        """, (document_id, user_id))

        document = cursor.fetchone()

        if document is None:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Document not found"
            }), 404

        extracted_text = document[2]

        if not extracted_text:
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "No extracted text available for this PDF"
            }), 400

        generated_notes = generate_structured_notes(
            extracted_text
        )

        cursor.execute("""
            INSERT INTO notes_analysis
            (
                document_id,
                generated_notes
            )
            VALUES
            (
                %s,
                %s
            )
            RETURNING
                id,
                document_id,
                generated_notes,
                created_at
        """, (
            document_id,
            generated_notes
        ))

        analysis = cursor.fetchone()

        if analysis is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Generated notes were not saved"
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Notes generated successfully",
            "analysis": {
                "id": analysis[0],
                "document_id": analysis[1],
                "generated_notes": analysis[2],
                "created_at": analysis[3]
            }
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "GENERATE NOTES ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route("/notes/chat", methods=["POST"])
def chat_with_notes():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json(silent=True) or {}

    document_id = data.get("document_id")
    question = (data.get("question") or "").strip()

    if not document_id:
        return jsonify({
            "status": "error",
            "message": "document_id is required"
        }), 400

    if not question:
        return jsonify({
            "status": "error",
            "message": "Question is required"
        }), 400

    conn = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                file_name,
                extracted_text
            FROM notes_documents
            WHERE id = %s
              AND user_id = %s
        """, (document_id, user_id))

        row = cursor.fetchone()

        cursor.close()

        if not row:
            return jsonify({
                "status": "error",
                "message": "Document not found"
            }), 404

        document_id_db, file_name, extracted_text = row

        if not extracted_text:
            return jsonify({
                "status": "error",
                "message": "No extracted text available for this PDF."
            }), 400

        answer = ask_question_about_notes(
            extracted_text,
            question
        )

        return jsonify({
            "status": "success",
            "document_id": document_id_db,
            "file_name": file_name,
            "question": question,
            "answer": answer
        }), 200

    except ValueError as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:

        print(
            "NOTES CHAT ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route("/lesson/generate", methods=["POST"])
def generate_lesson():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json(silent=True) or {}

    subject = (data.get("subject") or "").strip()
    topic = (data.get("topic") or "").strip()
    grade = (data.get("grade") or "").strip()
    duration = (data.get("duration") or "").strip()
    objectives = (data.get("objectives") or "").strip()

    if not subject:
        return jsonify({
            "status": "error",
            "message": "Subject is required."
        }), 400

    if not topic:
        return jsonify({
            "status": "error",
            "message": "Topic is required."
        }), 400

    if not grade:
        return jsonify({
            "status": "error",
            "message": "Grade is required."
        }), 400

    if not duration:
        return jsonify({
            "status": "error",
            "message": "Duration is required."
        }), 400

    if not objectives:
        return jsonify({
            "status": "error",
            "message": "Learning objectives are required."
        }), 400

    try:

        lesson_plan = generate_lesson_plan(
            subject=subject,
            topic=topic,
            grade=grade,
            duration=duration,
            objectives=objectives
        )

        return jsonify({
            "status": "success",
            "lesson_plan": lesson_plan,
            "subject": subject,
            "topic": topic,
            "grade": grade,
            "duration": duration
        }), 200

    except ValueError as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:

        print(
            "LESSON PLANNER ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@education.route("/lesson/resources", methods=["POST"])
def lesson_resources():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    subject = data.get("subject", "").strip()
    topic = data.get("topic", "").strip()
    grade = data.get("grade", "").strip()

    if not topic:
        return jsonify({
            "status": "error",
            "message": "Topic is required."
        }), 400

    try:

        resources = get_lesson_resources(
            subject=subject,
            topic=topic,
            grade=grade
        )

        return jsonify({
            "status": "success",
            "resources": resources
        }), 200

    except Exception as e:

        print(
            f"LESSON RESOURCES ROUTE ERROR: {repr(e)}"
        )

        return jsonify({
            "status": "error",
            "message": "Failed to fetch lesson resources."
        }), 500
# =========================================================
# LESSON PLANNER - SAVE LESSON PLAN
# =========================================================

@education.route("/lesson/save", methods=["POST"])
def save_lesson_plan():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json(silent=True) or {}

    subject = (data.get("subject") or "").strip()
    topic = (data.get("topic") or "").strip()
    grade = (data.get("grade") or "").strip()
    duration = (data.get("duration") or "").strip()
    objectives = (data.get("objectives") or "").strip()
    lesson_plan = (data.get("lesson_plan") or "").strip()

    # -----------------------------------------------------
    # Validation
    # -----------------------------------------------------

    if not subject:
        return jsonify({
            "status": "error",
            "message": "Subject is required."
        }), 400

    if not topic:
        return jsonify({
            "status": "error",
            "message": "Topic is required."
        }), 400

    if not grade:
        return jsonify({
            "status": "error",
            "message": "Grade is required."
        }), 400

    if not duration:
        return jsonify({
            "status": "error",
            "message": "Duration is required."
        }), 400

    if not objectives:
        return jsonify({
            "status": "error",
            "message": "Learning objectives are required."
        }), 400

    if not lesson_plan:
        return jsonify({
            "status": "error",
            "message": "Lesson plan is required."
        }), 400

    conn = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO lesson_plans (
                user_id,
                subject,
                topic,
                grade,
                duration,
                objectives,
                lesson_plan
            )
            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id, created_at
        """, (
            user_id,
            subject,
            topic,
            grade,
            duration,
            objectives,
            lesson_plan
        ))

        result = cursor.fetchone()

        if result is None:
            conn.rollback()
            cursor.close()

            return jsonify({
                "status": "error",
                "message": "Lesson plan was not saved."
            }), 500

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Lesson plan saved successfully.",
            "lesson_plan_id": result[0],
            "created_at": result[1]
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "LESSON PLAN SAVE ERROR:",
            repr(e)
        )

        return jsonify({
            "status": "error",
            "message": "Failed to save lesson plan.",
            "error": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
@education.route("/lesson/recent", methods=["GET"])
def get_recent_lesson_plans():

    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                subject,
                topic,
                grade,
                duration,
                objectives,
                lesson_plan,
                created_at
            FROM lesson_plans
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        """, (user_id,))

        rows = cursor.fetchall()

        lesson_plans = []

        for row in rows:
            lesson_plans.append({
                "id": row[0],
                "subject": row[1],
                "topic": row[2],
                "grade": row[3],
                "duration": row[4],
                "objectives": row[5],
                "lesson_plan": row[6],
                "created_at": row[7].isoformat() if row[7] else None
            })

        cursor.close()

        return jsonify({
            "status": "success",
            "lesson_plans": lesson_plans
        }), 200

    except Exception as e:

        print("RECENT LESSON PLANS ERROR:", repr(e))

        return jsonify({
            "status": "error",
            "message": "Failed to fetch recent lesson plans."
        }), 500

    finally:
        if conn:
            conn.close()
@education.route("/exam/generate", methods=["POST"])
def generate_exam_plan():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    exam = data.get("exam", "").strip()
    paper = data.get("paper", "").strip()
    exam_date = data.get("exam_date", "").strip()
    daily_hours = data.get("daily_hours")
    level = data.get("level", "Beginner").strip()

    if not exam:
        return jsonify({
            "status": "error",
            "message": "Exam is required."
        }), 400

    if not paper:
        return jsonify({
            "status": "error",
            "message": "Paper / Subject is required."
        }), 400

    if not exam_date:
        return jsonify({
            "status": "error",
            "message": "Exam date is required."
        }), 400

    if daily_hours is None:
        return jsonify({
            "status": "error",
            "message": "Daily study hours are required."
        }), 400

    try:
        plan = generate_exam_preparation(
            exam=exam,
            paper=paper,
            exam_date=exam_date,
            daily_hours=daily_hours,
            level=level
        )

        return jsonify({
            "status": "success",
            "message": "Exam preparation plan generated successfully.",
            "data": plan
        }), 200

    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:
        print("Exam preparation error:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to generate exam preparation plan."
        }), 500
@education.route("/exam/save", methods=["POST"])
def save_exam_plan():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    exam = str(data.get("exam") or "").strip()
    paper = str(data.get("paper") or "").strip()
    exam_date = str(data.get("exam_date") or "").strip()
    level = str(data.get("level") or "Beginner").strip()

    daily_hours = data.get("daily_hours")
    total_days = data.get("total_days")
    total_hours = data.get("total_hours")
    days = data.get("days") or []

    # ---------------------------------------------------------
    # Validation
    # ---------------------------------------------------------

    if not exam:
        return jsonify({
            "status": "error",
            "message": "Exam is required."
        }), 400

    if not paper:
        return jsonify({
            "status": "error",
            "message": "Paper / Subject is required."
        }), 400

    if not exam_date:
        return jsonify({
            "status": "error",
            "message": "Exam date is required."
        }), 400

    if daily_hours is None:
        return jsonify({
            "status": "error",
            "message": "Daily study hours are required."
        }), 400

    if total_days is None:
        return jsonify({
            "status": "error",
            "message": "Total days are missing."
        }), 400

    if total_hours is None:
        return jsonify({
            "status": "error",
            "message": "Total hours are missing."
        }), 400

    if not isinstance(days, list) or not days:
        return jsonify({
            "status": "error",
            "message": "Study plan days are required."
        }), 400

    # Convert numeric values safely
    try:
        daily_hours_value = float(daily_hours)
        total_days_value = int(total_days)
        total_hours_value = float(total_hours)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Invalid numeric values in study plan."
        }), 400

    # ---------------------------------------------------------
    # Database
    # ---------------------------------------------------------

    conn = None
    cur = None

    try:
        from datetime import date, timedelta

        # Validate exam date
        try:
            target_date = date.fromisoformat(exam_date)
        except ValueError:
            return jsonify({
                "status": "error",
                "message": "Invalid exam date."
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # -----------------------------------------------------
        # 1. Save main preparation
        # -----------------------------------------------------

        cur.execute("""
            INSERT INTO exam_preparations
            (
                user_id,
                exam,
                paper,
                exam_date,
                daily_hours,
                level,
                total_days,
                total_hours
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id,
            exam,
            paper,
            target_date,
            daily_hours_value,
            level,
            total_days_value,
            total_hours_value
        ))

        preparation_result = cur.fetchone()

        if preparation_result is None:
            raise RuntimeError(
                "Failed to create exam preparation."
            )

        preparation_id = preparation_result[0]

        # -----------------------------------------------------
        # 2. Save every day
        # -----------------------------------------------------

        for day in days:

            if not isinstance(day, dict):
                continue

            day_number_raw = day.get("day_number")

            if day_number_raw is None:
                continue

            try:
                day_number = int(day_number_raw)
            except (TypeError, ValueError):
                continue

            focus = str(day.get("focus") or "").strip()

            # Day 1 = today
            # Last day = exam date
            days_before_exam = total_days_value - day_number

            plan_date = target_date - timedelta(
                days=days_before_exam
            )

            cur.execute("""
                INSERT INTO exam_preparation_days
                (
                    preparation_id,
                    day_number,
                    plan_date
                )
                VALUES (%s, %s, %s)
                RETURNING id
            """, (
                preparation_id,
                day_number,
                plan_date
            ))

            day_result = cur.fetchone()

            if day_result is None:
                raise RuntimeError(
                    f"Failed to create day {day_number}."
                )

            day_id = day_result[0]

            # -------------------------------------------------
            # 3. Save tasks
            # -------------------------------------------------

            tasks = day.get("tasks") or []

            if not isinstance(tasks, list):
                tasks = []

            for task in tasks:

                if not isinstance(task, dict):
                    continue

                task_type = str(
                    task.get("type") or "theory"
                ).strip()

                title = str(
                    task.get("title") or "Study Task"
                ).strip()

                description = str(
                    task.get("description") or ""
                ).strip()

                duration_raw = task.get("duration_minutes")
                questions_raw = task.get("questions_count")

                try:
                    duration_minutes = int(
                        duration_raw or 0
                    )
                except (TypeError, ValueError):
                    duration_minutes = 0

                try:
                    questions_count = int(
                        questions_raw or 0
                    )
                except (TypeError, ValueError):
                    questions_count = 0

                cur.execute("""
                    INSERT INTO exam_preparation_tasks
                    (
                        day_id,
                        task_type,
                        title,
                        description,
                        duration_minutes,
                        questions_count
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    day_id,
                    task_type,
                    title,
                    description,
                    duration_minutes,
                    questions_count
                ))

        # -----------------------------------------------------
        # Commit
        # -----------------------------------------------------

        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Exam preparation plan saved successfully.",
            "preparation_id": preparation_id
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print("Exam preparation save error:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to save exam preparation plan."
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()
@education.route("/exam/today", methods=["GET"])
def get_today_exam_plan():
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None
    cur = None

    try:
        from datetime import date

        today = date.today()

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                ep.id,
                ep.exam,
                ep.paper,
                ep.exam_date,
                ep.daily_hours,
                ep.level,
                ep.total_days,
                ep.total_hours,
                epd.id,
                epd.day_number,
                epd.plan_date,
                epd.status
            FROM exam_preparations ep
            JOIN exam_preparation_days epd
                ON ep.id = epd.preparation_id
            WHERE ep.user_id = %s
              AND ep.status = 'active'
              AND epd.plan_date = %s
            ORDER BY ep.created_at DESC
            LIMIT 1
        """, (
            user_id,
            today
        ))

        result = cur.fetchone()

        if result is None:
            return jsonify({
                "status": "success",
                "message": "No study plan found for today.",
                "data": None
            }), 200

        (
            preparation_id,
            exam,
            paper,
            exam_date,
            daily_hours,
            level,
            total_days,
            total_hours,
            day_id,
            day_number,
            plan_date,
            day_status
        ) = result

        cur.execute("""
            SELECT
                id,
                task_type,
                title,
                description,
                duration_minutes,
                questions_count,
                status,
                completed_at
            FROM exam_preparation_tasks
            WHERE day_id = %s
            ORDER BY id ASC
        """, (day_id,))

        task_rows = cur.fetchall()

        tasks = []

        for task in task_rows:
            tasks.append({
                "id": task[0],
                "type": task[1],
                "title": task[2],
                "description": task[3],
                "duration_minutes": task[4],
                "questions_count": task[5],
                "status": task[6],
                "completed_at": task[7]
            })

        return jsonify({
            "status": "success",
            "message": "Today's study plan fetched successfully.",
            "data": {
                "preparation_id": preparation_id,
                "exam": exam,
                "paper": paper,
                "exam_date": exam_date,
                "daily_hours": float(daily_hours),
                "level": level,
                "total_days": total_days,
                "total_hours": float(total_hours),
                "day": {
                    "id": day_id,
                    "day_number": day_number,
                    "plan_date": plan_date,
                    "status": day_status,
                    "tasks": tasks
                }
            }
        }), 200

    except Exception as e:

        print("Today's exam plan error:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to fetch today's study plan."
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()
@education.route("/exam/task/<int:task_id>/complete", methods=["PATCH"])
def complete_exam_task(task_id):
    user_id = get_logged_in_user()

    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Unauthorized"
        }), 401

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Make sure this task belongs to the logged-in user
        cur.execute("""
            SELECT t.id
            FROM exam_preparation_tasks t
            JOIN exam_preparation_days d
                ON t.day_id = d.id
            JOIN exam_preparations p
                ON d.preparation_id = p.id
            WHERE t.id = %s
              AND p.user_id = %s
        """, (
            task_id,
            user_id
        ))

        task = cur.fetchone()

        if task is None:
            return jsonify({
                "status": "error",
                "message": "Task not found."
            }), 404

        # Mark task completed
        cur.execute("""
            UPDATE exam_preparation_tasks
            SET
                status = 'completed',
                completed_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, status, completed_at
        """, (task_id,))

        result = cur.fetchone()

        if result is None:
            raise RuntimeError(
                "Failed to update task."
            )

        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Task completed successfully.",
            "data": {
                "task_id": result[0],
                "status": result[1],
                "completed_at": result[2]
            }
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print("Complete exam task error:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to complete task."
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()                                                                                                                                                