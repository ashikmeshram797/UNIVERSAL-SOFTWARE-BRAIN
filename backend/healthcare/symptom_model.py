import os
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TRAINING_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "Training.csv"
)

TESTING_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "Testing.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "symptom_model.pkl"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "label_encoder.pkl"
)


def train_model():

    print("=" * 60)
    print("HEALTHCARE SYMPTOM MODEL TRAINING")
    print("=" * 60)

    # Load dataset
    train_df = pd.read_csv(TRAINING_PATH)
    test_df = pd.read_csv(TESTING_PATH)

    # Remove unwanted columns
    train_df = train_df.loc[
        :,
        ~train_df.columns.str.startswith("Unnamed")
    ]

    test_df = test_df.loc[
        :,
        ~test_df.columns.str.startswith("Unnamed")
    ]

    print("Training data:", train_df.shape)
    print("Testing data :", test_df.shape)

    # Separate features and target
    X_train = train_df.drop(columns=["prognosis"])
    y_train = train_df["prognosis"]

    X_test = test_df.drop(columns=["prognosis"])
    y_test = test_df["prognosis"]

    # Make sure both datasets have same symptom columns
    X_test = X_test[X_train.columns]

    # Encode disease names
    encoder = LabelEncoder()

    y_train_encoded = encoder.fit_transform(y_train)
    y_test_encoded = encoder.transform(y_test)

    print("Number of diseases:", len(encoder.classes_))

    # Random Forest model
    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )

    print("\nTraining model...")

    model.fit(
        X_train,
        y_train_encoded
    )

    print("Training completed.")

    # Test model
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test_encoded,
        predictions
    )

    print("\nModel Accuracy:")
    print(f"{accuracy * 100:.2f}%")

    # Save model
    joblib.dump(
        model,
        MODEL_PATH
    )

    joblib.dump(
        encoder,
        ENCODER_PATH
    )

    print("\nModel saved:")
    print(MODEL_PATH)

    print("\nEncoder saved:")
    print(ENCODER_PATH)

    print("=" * 60)


if __name__ == "__main__":
    train_model()