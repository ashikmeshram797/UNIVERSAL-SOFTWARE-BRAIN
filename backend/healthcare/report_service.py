import os
import pytesseract

from PIL import Image
from pypdf import PdfReader


# =========================================================
# CONFIGURATION
# =========================================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg"
}


# =========================================================
# FILE VALIDATION
# =========================================================

def is_allowed_file(filename):

    if not filename:
        return False

    extension = os.path.splitext(filename)[1].lower()

    return extension in ALLOWED_EXTENSIONS


# =========================================================
# IMAGE TEXT EXTRACTION
# =========================================================

def extract_text_from_image(file_path):

    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return text.strip()


# =========================================================
# PDF TEXT EXTRACTION
# =========================================================

def extract_text_from_pdf(file_path):

    reader = PdfReader(file_path)

    extracted_text = []

    for page in reader.pages:

        text = page.extract_text()

        if text:
            extracted_text.append(text)

    return "\n".join(extracted_text).strip()


# =========================================================
# MAIN REPORT PROCESSOR
# =========================================================

def analyze_report(file_path):

    if not os.path.exists(file_path):

        raise FileNotFoundError(
            "Uploaded report file not found"
        )

    filename = os.path.basename(file_path)

    if not is_allowed_file(filename):

        raise ValueError(
            "Unsupported file type. "
            "Only PDF, PNG, JPG and JPEG are allowed."
        )

    extension = os.path.splitext(filename)[1].lower()

    # -----------------------------------------------------
    # PDF
    # -----------------------------------------------------

    if extension == ".pdf":

        text = extract_text_from_pdf(file_path)

    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    else:

        text = extract_text_from_image(file_path)

    # -----------------------------------------------------
    # Empty report
    # -----------------------------------------------------

    if not text:

        return {
            "status": "warning",
            "message": "No readable text found in the report.",
            "text": ""
        }

    return {
        "status": "success",
        "filename": filename,
        "text": text
    }