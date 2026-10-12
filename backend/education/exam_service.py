import json
from datetime import date

from .ai_service import client, MODELS


def generate_exam_preparation(
    exam,
    paper,
    exam_date,
    daily_hours,
    level="Beginner"
):
    """
    Generate a complete day-wise exam preparation plan.

    The plan is generated once and can then be stored
    in exam_preparations, exam_preparation_days and
    exam_preparation_tasks tables.
    """

    try:
        target_date = date.fromisoformat(exam_date)
    except ValueError:
        raise ValueError("Invalid exam date. Use YYYY-MM-DD format.")

    today = date.today()

    if target_date <= today:
        raise ValueError("Exam date must be in the future.")

    try:
        daily_hours = float(daily_hours)
    except (TypeError, ValueError):
        raise ValueError("Daily study hours must be a valid number.")

    if daily_hours <= 0:
        raise ValueError("Daily study hours must be greater than 0.")

    total_days = (target_date - today).days
    total_hours = round(total_days * daily_hours, 2)

    prompt = f"""
You are an expert exam preparation planner.

Create a complete personalized preparation plan.

EXAM DETAILS
Exam: {exam}
Paper / Subject: {paper}
Exam Date: {exam_date}
Available Days: {total_days}
Daily Study Hours: {daily_hours}
Preparation Level: {level}

IMPORTANT REQUIREMENTS:

1. Cover the complete syllabus of the selected exam/paper.
2. Divide the syllabus intelligently across the available days.
3. Do NOT put every activity on every day.
4. Balance:
   - Theory
   - Video Learning
   - Practice Questions
   - Revision
   - Previous Year Questions
   - Full Tests / Mock Tests
5. Difficult and important topics should receive more time.
6. Include revision after major topics.
7. Keep the final days mainly for revision, PYQs and mock tests.
8. The plan must fit within the available daily study hours.
9. Generate a plan for every day from Day 1 to Day {total_days}.
10. Return ONLY valid JSON.

Return exactly this structure:

{{
    "summary": {{
        "total_days": {total_days},
        "daily_hours": {daily_hours},
        "total_hours": {total_hours}
    }},
    "days": [
        {{
            "day_number": 1,
            "focus": "Main focus of the day",
            "tasks": [
                {{
                    "type": "theory",
                    "title": "Topic name",
                    "description": "What to study",
                    "duration_minutes": 60,
                    "questions_count": 0
                }},
                {{
                    "type": "video",
                    "title": "Video topic",
                    "description": "What to learn",
                    "duration_minutes": 30,
                    "questions_count": 0
                }},
                {{
                    "type": "practice",
                    "title": "Practice topic",
                    "description": "Questions to solve",
                    "duration_minutes": 45,
                    "questions_count": 20
                }}
            ]
        }}
    ]
}}

Allowed task types:

theory
video
practice
revision
pyq
full_test

Make sure the total duration of tasks for each day
does not unnecessarily exceed {daily_hours} hours.
"""

    last_error = None

    for model_name in MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            text = response.text.strip()

            # Remove markdown JSON fences if Gemini returns them.
            if text.startswith("```json"):
                text = text[7:]

            if text.startswith("```"):
                text = text[3:]

            if text.endswith("```"):
                text = text[:-3]

            text = text.strip()

            data = json.loads(text)

            if "days" not in data:
                raise ValueError("AI response does not contain days.")

            return {
                "exam": exam,
                "paper": paper,
                "exam_date": exam_date,
                "daily_hours": daily_hours,
                "level": level,
                "total_days": total_days,
                "total_hours": total_hours,
                "days": data["days"]
            }

        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(
        f"Unable to generate exam preparation plan: {last_error}"
    )