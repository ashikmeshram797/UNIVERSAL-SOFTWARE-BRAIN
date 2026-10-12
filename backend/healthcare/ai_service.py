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
# REPORT EXPLANATION
# =========================================================

def explain_medical_report(parameters, report_text=""):

    if not parameters:
        return (
            "No medical parameters were detected "
            "in the report."
        )

    # -----------------------------------------------------
    # Prepare structured data
    # -----------------------------------------------------

    parameter_text = "\n".join(
        [
            (
                f"- {p['name']}: "
                f"{p['value']} {p['unit']} "
                f"(Reference: {p['reference_range']}, "
                f"Status: {p['status']})"
            )
            for p in parameters
        ]
    )

    # -----------------------------------------------------
    # Medical safety-focused prompt
    # -----------------------------------------------------

    prompt = f"""
You are a medical report explanation assistant.

Explain the following laboratory report results
in simple language for a general user.

IMPORTANT RULES:

1. Do NOT diagnose any disease.
2. Do NOT prescribe medicines.
3. Do NOT recommend specific medication or dosage.
4. Do NOT claim that an abnormal result proves a disease.
5. Explain possible general reasons for abnormal values
   carefully using words such as "may", "can", or "could".
6. Encourage consultation with a qualified healthcare
   professional when values are abnormal.
7. Use only the provided report information.
8. Do not invent missing laboratory values.
9. Keep the explanation concise and easy to understand.

Detected laboratory parameters:

{parameter_text}

Report text:

{report_text}

Return the explanation using these sections:

Overall Summary
Abnormal Findings
What These Results May Mean
What To Discuss With A Doctor
Safety Note
"""

    # -----------------------------------------------------
    # Gemini model fallback
    # -----------------------------------------------------

    last_error = None

    for model_name in MODELS:

        print("=" * 60)
        print("TRYING GEMINI MODEL:", model_name)
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
                        "GEMINI RESPONSE SUCCESS:",
                        model_name
                    )

                    return response.text.strip()

            except Exception as e:

                last_error = e

                print(
                    "GEMINI ERROR:",
                    repr(e)
                )

                # Wait before retry
                time.sleep(2)

    # -----------------------------------------------------
    # All models failed
    # -----------------------------------------------------

    raise RuntimeError(
        f"Unable to generate AI report explanation: {last_error}"
    )