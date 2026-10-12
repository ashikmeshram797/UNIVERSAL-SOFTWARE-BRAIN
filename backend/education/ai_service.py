import os
import time

from google import genai


# =========================================================
# GEMINI CONFIGURATION
# =========================================================

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured"
    )


client = genai.Client(
    api_key=API_KEY
)


MODELS = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
]


# =========================================================
# STUDY ASSISTANT
# =========================================================

def ask_study_assistant(
    question,
    subject="",
    topic=""
):

    if not question or not question.strip():
        raise ValueError(
            "Question is required"
        )


    # -----------------------------------------------------
    # EDUCATION PROMPT
    # -----------------------------------------------------

    prompt = f"""
You are an AI Study Assistant inside an Education Agent.

Your job is to help students understand academic topics
clearly and accurately.

Student Subject:
{subject if subject else "Not specified"}

Student Topic:
{topic if topic else "Not specified"}

Student Question:
{question}


IMPORTANT RULES:

1. Answer the student's question directly.
2. Explain concepts in simple and student-friendly language.
3. Do not unnecessarily make the answer complicated.
4. If the question is about a technical or difficult topic,
   explain it step-by-step.
5. Use examples when they help understanding.
6. For mathematics, show the calculation step-by-step.
7. For programming questions, explain the logic and provide
   correct code when appropriate.
8. If the student asks for a definition, give the definition
   first and then explain it.
9. If the question is ambiguous, clearly mention what is
   unclear instead of inventing information.
10. Do not fabricate facts, formulas, examples, or references.
11. Keep the response focused on the student's question.
12. Adapt the explanation to a student learning level.
13. Do not behave like a medical, legal, or financial advisor.
14. If the requested information is outside the provided
    academic context, answer only when you are reasonably
    confident about it.

Return the answer in a clear structure when appropriate:

Answer

Explanation

Example

Key Points

Use only the sections that are useful for the question.
Do not force unnecessary sections.
"""


    # -----------------------------------------------------
    # GEMINI MODEL FALLBACK + RETRY
    # -----------------------------------------------------

    last_error = None

    for model_name in MODELS:

        print("=" * 60)
        print("TRYING EDUCATION GEMINI MODEL:", model_name)
        print("=" * 60)

        for attempt in range(2):

            try:

                print(
                    f"Attempt {attempt + 1}/2"
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                if response.text:

                    print(
                        "EDUCATION AI RESPONSE SUCCESS:",
                        model_name
                    )

                    return response.text.strip()

            except Exception as e:

                last_error = e

                print(
                    "EDUCATION GEMINI ERROR:",
                    repr(e)
                )

                time.sleep(2)


    # -----------------------------------------------------
    # ALL MODELS FAILED
    # -----------------------------------------------------

    raise RuntimeError(
        f"Unable to generate study assistant response: {last_error}"
    )