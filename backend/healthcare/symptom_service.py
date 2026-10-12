import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "symptom_model.pkl"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "label_encoder.pkl"
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "Training.csv"
)


# Load trained model
model = joblib.load(MODEL_PATH)

# Load disease encoder
encoder = joblib.load(ENCODER_PATH)

# Load symptom columns
training_df = pd.read_csv(DATASET_PATH)

training_df = training_df.loc[
    :,
    ~training_df.columns.str.startswith("Unnamed")
]

SYMPTOM_COLUMNS = [
    column
    for column in training_df.columns
    if column != "prognosis"
]

SYMPTOM_ALIASES = {
    "fever": ["high_fever"],
    "high fever": ["high_fever"],
    "mild fever": ["mild_fever"],

    "body pain": ["muscle_pain"],
    "body ache": ["muscle_pain"],
    "body aches": ["muscle_pain"],
    "muscle pain": ["muscle_pain"],

    "joint pain": ["joint_pain"],
    "stomach ache": ["stomach_pain"],
    "stomach pain": ["stomach_pain"],
    "belly pain": ["belly_pain"],
    "breathing problem": ["breathlessness"],
    "difficulty breathing": ["breathlessness"],
    "shortness of breath": ["breathlessness"],
    "vomit": ["vomiting"],
    "head pain": ["headache"],
    "dizzy": ["dizziness"],
    "weakness": ["muscle_weakness"],
    "coughing": ["cough"],
    "runny nose": ["runny_nose"],
    "sore throat": ["throat_irritation"],
}
def analyze_symptoms(symptoms):

    if not symptoms:
        return {
            "predictions": [],
            "matched_symptoms": [],
            "unknown_symptoms": []
        }

    # Create input vector
    input_data = pd.DataFrame(
        0,
        index=[0],
        columns=SYMPTOM_COLUMNS
    )

    matched_symptoms = []
    unknown_symptoms = []

    # Normalize and match symptoms
    for symptom in symptoms:

        original = symptom.strip()

        normalized = (
            original
            .lower()
            .strip()
            .replace("-", " ")
        )

        # ---------------------------------------
        # Check symptom aliases
        # ---------------------------------------

        if normalized in SYMPTOM_ALIASES:

            mapped_symptoms = SYMPTOM_ALIASES[normalized]

            for mapped_symptom in mapped_symptoms:

                if mapped_symptom in input_data.columns:

                    input_data.loc[0, mapped_symptom] = 1

                    if mapped_symptom not in matched_symptoms:
                        matched_symptoms.append(mapped_symptom)

                else:

                    unknown_symptoms.append(original)

        # ---------------------------------------
        # Exact dataset column match
        # ---------------------------------------

        else:

            column_name = normalized.replace(" ", "_")

            if column_name in input_data.columns:

                input_data.loc[0, column_name] = 1

                if column_name not in matched_symptoms:
                    matched_symptoms.append(column_name)

            else:

                unknown_symptoms.append(original)

    # ---------------------------------------
    # No valid symptoms matched
    # ---------------------------------------

    if not matched_symptoms:

        return {
            "predictions": [],
            "matched_symptoms": [],
            "unknown_symptoms": unknown_symptoms
        }

    # ---------------------------------------
    # Predict probabilities
    # ---------------------------------------

    probabilities = model.predict_proba(input_data)[0]

    # Top 3 predictions
    top_indices = probabilities.argsort()[-3:][::-1]

    predictions = []

    for index in top_indices:

        disease = encoder.inverse_transform(
            [index]
        )[0]

        confidence = probabilities[index] * 100

        predictions.append({
            "disease": disease.strip(),
            "confidence": round(float(confidence), 2)
        })

    # ---------------------------------------
    # Final response
    # ---------------------------------------

    return {
        "predictions": predictions,
        "matched_symptoms": matched_symptoms,
        "unknown_symptoms": unknown_symptoms
    }