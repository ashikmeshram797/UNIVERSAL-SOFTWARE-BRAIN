import re


# =========================================================
# MEDICAL PARAMETER PATTERNS
# =========================================================

PARAMETERS = {
    "Hemoglobin": {
        "patterns": [
            r"hemoglobin\s*[:\-]?\s*([\d.]+)"
        ],
        "unit": "g/dL",
        "reference_low": 13.0,
        "reference_high": 17.0
    },

    "WBC Count": {
        "patterns": [
            r"wbc\s*count\s*[:\-]?\s*([\d,]+)",
            r"white\s*blood\s*cell(?:s)?\s*[:\-]?\s*([\d,]+)"
        ],
        "unit": "cells/µL",
        "reference_low": 4000,
        "reference_high": 11000
    },

    "Platelet Count": {
        "patterns": [
            r"platelet\s*count\s*[:\-]?\s*([\d,]+)",
            r"platelets?\s*[:\-]?\s*([\d,]+)"
        ],
        "unit": "cells/µL",
        "reference_low": 150000,
        "reference_high": 450000
    },

    "RBC Count": {
        "patterns": [
            r"rbc\s*count\s*[:\-]?\s*([\d.]+)",
            r"red\s*blood\s*cell(?:s)?\s*[:\-]?\s*([\d.]+)"
        ],
        "unit": "million/µL",
        "reference_low": 4.5,
        "reference_high": 5.9
    },

    "Fasting Blood Glucose": {
        "patterns": [
            r"fasting\s*blood\s*glucose\s*[:\-]?\s*([\d.]+)",
            r"fasting\s*glucose\s*[:\-]?\s*([\d.]+)"
        ],
        "unit": "mg/dL",
        "reference_low": 70,
        "reference_high": 99
    }
}


# =========================================================
# VALUE CONVERSION
# =========================================================

def convert_value(value):

    value = value.replace(",", "").strip()

    try:
        number = float(value)

        if number.is_integer():
            return int(number)

        return number

    except ValueError:
        return None


# =========================================================
# STATUS CHECK
# =========================================================

def get_status(value, reference_low, reference_high):

    if value < reference_low:
        return "low"

    if value > reference_high:
        return "high"

    return "normal"


# =========================================================
# MEDICAL REPORT PARSER
# =========================================================

def parse_medical_report(text):

    if not text or not text.strip():
        return {
            "parameters": [],
            "summary": {
                "total": 0,
                "normal": 0,
                "high": 0,
                "low": 0,
                "message": "No report text available"
            }
        }

    normalized_text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    parameters = []

    for name, config in PARAMETERS.items():

        found_value = None

        for pattern in config["patterns"]:

            match = re.search(
                pattern,
                normalized_text,
                re.IGNORECASE
            )

            if match:
                found_value = convert_value(
                    match.group(1)
                )

                if found_value is not None:
                    break

        if found_value is not None:

            status = get_status(
                found_value,
                config["reference_low"],
                config["reference_high"]
            )

            parameters.append({
                "name": name,
                "value": found_value,
                "unit": config["unit"],
                "reference_range": (
                    f"{config['reference_low']} - "
                    f"{config['reference_high']}"
                ),
                "status": status
            })

    # =====================================================
    # SUMMARY
    # =====================================================

    total = len(parameters)

    normal_count = sum(
        1 for p in parameters
        if p["status"] == "normal"
    )

    high_count = sum(
        1 for p in parameters
        if p["status"] == "high"
    )

    low_count = sum(
        1 for p in parameters
        if p["status"] == "low"
    )

    abnormal_count = high_count + low_count

    if total == 0:

        message = (
            "No supported medical parameters "
            "were detected in this report."
        )

    elif abnormal_count == 0:

        message = (
            f"All {total} detected parameters "
            "are within the provided reference ranges."
        )

    else:

        message = (
            f"{abnormal_count} parameter(s) "
            "are outside the provided reference ranges. "
            "Please discuss abnormal results with a "
            "qualified healthcare professional."
        )

    return {
        "parameters": parameters,

        "summary": {
            "total": total,
            "normal": normal_count,
            "high": high_count,
            "low": low_count,
            "abnormal": abnormal_count,
            "message": message
        }
    }