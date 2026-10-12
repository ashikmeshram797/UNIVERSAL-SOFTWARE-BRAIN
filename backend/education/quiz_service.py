import os
import json
import time
import requests
from urllib.parse import quote

from google import genai


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured"
    )

client = genai.Client(
    api_key=API_KEY
)


# Gemini fallback models
MODELS = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
]


# ============================================================
# WIKIPEDIA
# ============================================================

WIKIPEDIA_API_URL = (
    "https://en.wikipedia.org/api/rest_v1/page/summary/"
)


def fetch_wikipedia_content(topic: str) -> str:
    """
    Fetch a short summary of the requested topic from Wikipedia.

    If Wikipedia content is not available, return an empty string.
    """

    if not topic or not topic.strip():
        return ""

    try:
        topic_clean = topic.strip().replace(" ", "_")

        url = WIKIPEDIA_API_URL + quote(
            topic_clean,
            safe=""
        )

        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "UniversalSoftwareBrain-EducationAgent/1.0"
            }
        )

        if response.status_code != 200:
            print(
                "Wikipedia content not found:",
                response.status_code
            )
            return ""

        data = response.json()

        extract = data.get("extract", "")

        if not extract:
            return ""

        print("Wikipedia content found for:", topic)

        return extract.strip()

    except Exception as e:
        print(
            "Wikipedia API error:",
            repr(e)
        )

        return ""


# ============================================================
# VALIDATION
# ============================================================

ALLOWED_QUESTION_TYPES = {
    "MCQs",
    "True/False",
    "Short Answer"
}

ALLOWED_DIFFICULTIES = {
    "Easy",
    "Medium",
    "Hard"
}


def validate_quiz_request(
    subject,
    topic,
    question_types,
    count,
    difficulty
):
    if not subject or not subject.strip():
        raise ValueError(
            "Subject is required."
        )

    if not topic or not topic.strip():
        raise ValueError(
            "Topic is required."
        )

    if not isinstance(question_types, list):
        raise ValueError(
            "question_types must be a list."
        )

    if not question_types:
        raise ValueError(
            "At least one question type is required."
        )

    invalid_types = [
        q_type
        for q_type in question_types
        if q_type not in ALLOWED_QUESTION_TYPES
    ]

    if invalid_types:
        raise ValueError(
            f"Invalid question type(s): {invalid_types}"
        )

    try:
        count = int(count)
    except (TypeError, ValueError):
        raise ValueError(
            "Question count must be a number."
        )

    if count < 1 or count > 50:
        raise ValueError(
            "Question count must be between 1 and 50."
        )

    if difficulty not in ALLOWED_DIFFICULTIES:
        raise ValueError(
            "Difficulty must be Easy, Medium, or Hard."
        )

    return count


# ============================================================
# GEMINI RESPONSE CLEANING
# ============================================================

def clean_json_response(text: str) -> str:
    """
    Remove markdown code fences if Gemini returns JSON
    inside ```json ... ```.
    """

    if not text:
        return ""

    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]

    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


# ============================================================
# QUIZ VALIDATION
# ============================================================

def validate_generated_quiz(
    quiz_data,
    expected_count
):
    if not isinstance(quiz_data, dict):
        raise ValueError(
            "Gemini response must be a JSON object."
        )

    questions = quiz_data.get("questions")

    if not isinstance(questions, list):
        raise ValueError(
            "Quiz response does not contain questions."
        )

    if len(questions) != expected_count:
        raise ValueError(
            f"Expected {expected_count} questions, "
            f"but received {len(questions)}."
        )

    validated_questions = []

    for index, question in enumerate(questions, start=1):

        if not isinstance(question, dict):
            raise ValueError(
                f"Question {index} is invalid."
            )

        kind = question.get("kind")
        text = question.get("text")
        options = question.get("options")
        answer = question.get("answer")
        explanation = question.get("explanation")
        correct_answer = question.get("correct_answer")

        if not isinstance(correct_answer, str) or not correct_answer.strip():
            raise ValueError(
            f"Question {index}: correct_answer is required."
            )

        if kind not in ALLOWED_QUESTION_TYPES:
            raise ValueError(
                f"Question {index}: invalid kind."
            )

        if not text or not isinstance(text, str):
            raise ValueError(
                f"Question {index}: question text missing."
            )

        if not isinstance(options, list):
            raise ValueError(
                f"Question {index}: options must be a list."
            )

        if not isinstance(explanation, str):
            explanation = ""

        # ----------------------------------------------------
        # MCQ
        # ----------------------------------------------------

        if kind == "MCQs":

            if len(options) != 4:
                raise ValueError(
                    f"Question {index}: MCQ must have "
                    f"exactly 4 options."
                )

            if not isinstance(answer, int):
                raise ValueError(
                    f"Question {index}: MCQ answer "
                    f"must be an integer."
                )

            if answer < 0 or answer >= len(options):
                raise ValueError(
                    f"Question {index}: MCQ answer index "
                    f"is invalid."
                )
            if correct_answer.strip() != str(options[answer]).strip():
                raise ValueError(
                    f"Question {index}: correct_answer must "
                    f"match the selected MCQ option."
                )

        # ----------------------------------------------------
        # TRUE / FALSE
        # ----------------------------------------------------

        elif kind == "True/False":

            if len(options) != 2:
                raise ValueError(
                    f"Question {index}: True/False must have "
                    f"2 options."
                )

            if options != ["True", "False"]:
                raise ValueError(
                    f"Question {index}: True/False options "
                    f"must be ['True', 'False']."
                )

            if answer not in [0, 1]:
                raise ValueError(
                    f"Question {index}: True/False answer "
                    f"must be 0 or 1."
                )
            expected_answer = options[answer]

            if correct_answer.strip() != expected_answer:
                raise ValueError(
                    f"Question {index}: correct_answer must "
                    f"match the True/False answer."
                )

        # ----------------------------------------------------
        # SHORT ANSWER
        # ----------------------------------------------------

        elif kind == "Short Answer":

            if options != []:
                raise ValueError(
                    f"Question {index}: Short Answer "
                    f"must have empty options."
                )

            if answer != -1:
                raise ValueError(
                    f"Question {index}: Short Answer "
                    f"answer must be -1."
                )

        validated_questions.append({
            "kind": kind,
            "text": text.strip(),
            "options": options,
            "answer": answer,
            "correct_answer": correct_answer.strip(),
            "explanation": explanation.strip()
        })

    return {
        "questions": validated_questions
    }


# ============================================================
# GEMINI QUIZ GENERATION
# ============================================================

def generate_quiz(
    subject,
    topic,
    question_types,
    count=10,
    difficulty="Medium"
):
    """
    Generate a quiz using:

    1. Wikipedia content when available.
    2. Gemini for quiz generation.
    3. Gemini fallback knowledge when Wikipedia
       content is unavailable.
    """

    count = validate_quiz_request(
        subject,
        topic,
        question_types,
        count,
        difficulty
    )

    # --------------------------------------------------------
    # FETCH WIKIPEDIA CONTENT
    # --------------------------------------------------------

    wikipedia_content = fetch_wikipedia_content(topic)

    if wikipedia_content:
        source_context = f"""
SOURCE: Wikipedia

The following information was retrieved from Wikipedia
for the requested topic:

{wikipedia_content}
"""
    else:
        source_context = """
SOURCE: No Wikipedia content was available.

Use your reliable academic knowledge about the topic.
Do not invent specific facts.
"""

    # --------------------------------------------------------
    # GEMINI PROMPT
    # --------------------------------------------------------

    requested_types = ", ".join(question_types)

    prompt = f"""
You are an AI Quiz Generator inside an Education Agent.

Create an academic quiz for a student.

SUBJECT:
{subject}

TOPIC:
{topic}

QUESTION TYPES:
{requested_types}

NUMBER OF QUESTIONS:
{count}

DIFFICULTY:
{difficulty}

{source_context}

IMPORTANT REQUIREMENTS:

1. Generate exactly {count} questions.

2. Only use these question types:
   - MCQs
   - True/False
   - Short Answer

3. For MCQs:
   - Provide exactly 4 options.
   - The answer must be a zero-based option index.
   - Example:
     options = ["A", "B", "C", "D"]
     answer = 2

4. For True/False:
   - options must be exactly:
     ["True", "False"]
   - answer must be:
     0 for True
     1 for False

5. For Short Answer:
   - options must be []
   - answer must be -1
   - Put the expected/correct answer inside
     the correct_answer field.

6. Every question must have an explanation.

7. Questions must match the requested subject,
   topic and difficulty.

8. Avoid duplicate questions.

9. Do not create questions unrelated to the topic.

10. Do not include markdown.

11. Return ONLY valid JSON.

12. Use exactly this structure:
13. The correct_answer field must always contain the
    actual correct answer as text.

    For MCQs:
    correct_answer must exactly match the option
    at the answer index.

    For True/False:
    correct_answer must be exactly "True" or "False".

    For Short Answer:
    correct_answer must contain the expected answer
    in text form.

{{
    "questions": [
        {{
            "kind": "MCQs",
            "text": "Question text",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ],
            "answer": 0,
            "correct_answer": "Option 1",
            "explanation": "Explanation"
        }}
    ]
}}
"""

    last_error = None

    # --------------------------------------------------------
    # TRY GEMINI MODELS
    # --------------------------------------------------------

    for model_name in MODELS:

        print("=" * 60)
        print(
            "TRYING QUIZ GEMINI MODEL:",
            model_name
        )
        print("=" * 60)

        for attempt in range(2):

            try:

                print(
                    f"Quiz attempt {attempt + 1}/2"
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                if not response.text:
                    raise ValueError(
                        "Gemini returned an empty response."
                    )

                cleaned_response = clean_json_response(
                    response.text
                )

                quiz_data = json.loads(
                    cleaned_response
                )

                validated_quiz = validate_generated_quiz(
                    quiz_data,
                    count
                )

                print(
                    "QUIZ GENERATION SUCCESS:",
                    model_name
                )

                return validated_quiz

            except Exception as e:

                last_error = e

                print(
                    "QUIZ GEMINI ERROR:",
                    repr(e)
                )

                time.sleep(2)

    raise RuntimeError(
        "Unable to generate quiz: "
        f"{last_error}"
    )