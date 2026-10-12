import os
import time

from pypdf import PdfReader

from .ai_service import client, MODELS


def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file.

    Args:
        file_path: Full path of the PDF file.

    Returns:
        Extracted text as a string.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            "PDF file not found"
        )

    try:
        reader = PdfReader(file_path)

        extracted_text = []

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text.append(text)

        final_text = "\n\n".join(extracted_text).strip()

        if not final_text:
            raise ValueError(
                "No readable text found in PDF"
            )

        return final_text

    except Exception as e:
        print(
            "PDF TEXT EXTRACTION ERROR:",
            repr(e)
        )
        raise
def generate_notes_summary(extracted_text):
    if not extracted_text or not extracted_text.strip():
        raise ValueError(
            "PDF text is required for summarization"
        )

    prompt = f"""
You are an AI Notes Analyzer inside an Education Agent.

Analyze the following study material extracted from a PDF.

Your task is to create a clear, accurate and student-friendly summary.

IMPORTANT RULES:

1. Summarize only the information provided in the PDF.
2. Do not invent facts or information.
3. Keep important concepts and definitions.
4. Remove unnecessary repetition.
5. Use simple language suitable for students.
6. Organize the summary with headings and bullet points where useful.
7. Preserve important technical terms, formulas and concepts.
8. Do not mention that you are an AI.
9. Do not add information that is not present in the PDF.

PDF CONTENT:

{extracted_text}

Return a concise but useful study summary.
"""

    last_error = None

    for model_name in MODELS:

        print("=" * 60)
        print("TRYING NOTES GEMINI MODEL:", model_name)
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
                        "NOTES AI SUMMARY SUCCESS:",
                        model_name
                    )

                    return response.text.strip()

            except Exception as e:

                last_error = e

                print(
                    "NOTES GEMINI ERROR:",
                    repr(e)
                )

                time.sleep(2)

    raise RuntimeError(
        f"Unable to generate notes summary: {last_error}"
    )
def generate_key_points(extracted_text):
    if not extracted_text or not extracted_text.strip():
        raise ValueError(
            "PDF text is required for extracting key points"
        )

    prompt = f"""
You are an AI Notes Analyzer inside an Education Agent.

Analyze the following study material extracted from a PDF.

Your task is to extract the most important key points
that a student should remember for study and revision.

IMPORTANT RULES:

1. Use only information provided in the PDF.
2. Do not invent or add information.
3. Focus on important concepts, definitions, facts,
   formulas, processes and important technical points.
4. Remove unnecessary details and repetition.
5. Keep each point clear and concise.
6. Use bullet points.
7. Group related points under headings when useful.
8. Preserve important technical terms and formulas.
9. Make the output useful for quick exam revision.
10. Do not mention that you are an AI.

PDF CONTENT:

{extracted_text}

Return the key points in a clear, structured format.
"""

    last_error = None

    for model_name in MODELS:

        print("=" * 60)
        print("TRYING KEY POINTS GEMINI MODEL:", model_name)
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
                        "KEY POINTS AI SUCCESS:",
                        model_name
                    )

                    return response.text.strip()

            except Exception as e:

                last_error = e

                print(
                    "KEY POINTS GEMINI ERROR:",
                    repr(e)
                )

                time.sleep(2)

    raise RuntimeError(
        f"Unable to generate key points: {last_error}"
    )
def generate_structured_notes(extracted_text):
    if not extracted_text or not extracted_text.strip():
        raise ValueError(
            "PDF text is required for generating notes"
        )

    prompt = f"""
You are an AI Notes Analyzer inside an Education Agent.

Create structured study notes from the following PDF content.

IMPORTANT RULES:

1. Use only information provided in the PDF.
2. Do not invent or add information.
3. Organize the content into clear headings and subheadings.
4. Convert important concepts into concise study notes.
5. Include important definitions.
6. Include formulas wherever present.
7. Include important processes or steps.
8. Preserve important technical terms.
9. Remove unnecessary repetition.
10. Make the notes easy to understand and useful for exam preparation.
11. Use Markdown formatting.
12. Do not mention that you are an AI.

PDF CONTENT:

{extracted_text}

Return complete, well-structured study notes.
"""

    last_error = None

    for model_name in MODELS:

        print("=" * 60)
        print("TRYING NOTES GEMINI MODEL:", model_name)
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
                        "STRUCTURED NOTES AI SUCCESS:",
                        model_name
                    )

                    return response.text.strip()

            except Exception as e:

                last_error = e

                print(
                    "STRUCTURED NOTES GEMINI ERROR:",
                    repr(e)
                )

                time.sleep(2)

    raise RuntimeError(
        f"Unable to generate structured notes: {last_error}"
    )    
def ask_question_about_notes(extracted_text, question):
    if not extracted_text:
        raise ValueError("No PDF content available.")

    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    prompt = f"""
You are an AI study assistant.

Answer the student's question using ONLY the content
provided from the uploaded PDF.

IMPORTANT RULES:
- Do not use outside knowledge.
- Do not invent information.
- If the answer is not available in the PDF, clearly say:
  "This information is not available in the uploaded PDF."
- Keep the answer accurate and student-friendly.
- Use headings or bullet points when useful.
- Preserve technical terms, definitions and formulas from the PDF.

PDF CONTENT:
{extracted_text}

STUDENT QUESTION:
{question.strip()}

ANSWER:
"""

    last_error = None

    for model_name in MODELS:

        for attempt in range(3):

            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                answer = getattr(response, "text", None)

                if answer and answer.strip():
                    return answer.strip()

                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            except Exception as e:
                last_error = e

                print(
                    f"NOTES CHAT ERROR | "
                    f"model={model_name} | "
                    f"attempt={attempt + 1} | "
                    f"error={repr(e)}"
                )

                if attempt < 2:
                    time.sleep(2)

    raise RuntimeError(
        f"Failed to generate answer: {repr(last_error)}"
    )