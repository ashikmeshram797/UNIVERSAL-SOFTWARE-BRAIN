import os
import requests
import uuid

from ai_engine.prompt_builder import build_prompt
from ai_engine.output_cleaner import clean_output
from ai_engine.code_formatter import format_code
from ai_engine.language_detector import detect_language
from ai_engine.file_generator import split_files
from ai_engine.file_writer import write_project
from ai_engine.zip_generator import zip_project
from ai_engine.filename_detector import detect_filename


# ============================================================
# CLOUD API
# ============================================================

COLAB_API = os.getenv(
    "COLAB_API",
    "https://devotion-hut-paddle.ngrok-free.dev/generate"
)


# ============================================================
# LOAD LOCAL MODEL ONLY ONCE
# ============================================================

tokenizer = None
local_model = None


def _get_local_model():
    global tokenizer, local_model

    if tokenizer is None or local_model is None:
        from ai_engine.load_model import load_ai_model

        tokenizer, local_model = load_ai_model()

    return tokenizer, local_model


# ============================================================
# GENERATE CODE
# ============================================================

def generate_code(user_prompt, model):

    print("=" * 60)
    print("SELECTED MODEL:", model)
    print("USER PROMPT:")
    print(user_prompt)
    print("=" * 60)

    # ========================================================
    # BUILD PROMPT
    # ========================================================

    full_prompt = build_prompt(user_prompt)

    print("\n================ GENERATED PROMPT ================")
    print(full_prompt)
    print("===================================================")


    # ========================================================
    # LOCAL QWEN 1.5B
    # ========================================================

    if model == "qwen-1.5b":

        print("\nGenerating with Local Qwen 1.5B...")

        import torch

        tokenizer, local_model = _get_local_model()
        model_prompt = full_prompt

        inputs = tokenizer(
            model_prompt,
            return_tensors="pt",
            truncation=True
        )

        inputs = {
            key: value.to(local_model.device)
            for key, value in inputs.items()
        }

        input_length = inputs["input_ids"].shape[1]

        print("\nInput tokens:", input_length)

        # Pad Token Safety Handling
        pad_id = tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id

        with torch.no_grad():
            outputs = local_model.generate(
                **inputs,
                max_new_tokens=1024,
                do_sample=False,
                repetition_penalty=1.05,
                pad_token_id=pad_id
                
            )

        generated_tokens = outputs[0][input_length:]

        print("Generated token count:", len(generated_tokens))

        generated = tokenizer.decode(
            generated_tokens,
            skip_special_tokens=False
        )

        print("\n==============================")
        print("LOCAL QWEN RAW OUTPUT")
        print("==============================")
        print(repr(generated))
        print("==============================")

        if not generated.strip():
            print("\nWARNING: LOCAL MODEL RETURNED EMPTY OUTPUT")

            test_output = tokenizer.decode(
                generated_tokens,
                skip_special_tokens=True
            )

            print("Decoded without special tokens:")
            print(repr(test_output))

            raise RuntimeError(
                "Local Qwen generated no usable code. "
                "Check tokenizer/model configuration."
            )


    # ========================================================
    # CLOUD MODEL
    # ========================================================

    else:

        print("\nGenerating with Cloud Model...")

        try:
            response = requests.post(
                COLAB_API,
                json={
                    "prompt": full_prompt
                },
                timeout=600
            )
            response.raise_for_status()
            data = response.json()
        except requests.Timeout as exc:
            raise RuntimeError(
                "Cloud code generation timed out after 600 seconds."
            ) from exc
        except requests.RequestException as exc:
            raise RuntimeError(
                f"Cloud code generation request failed: {exc}"
            ) from exc
        except ValueError as exc:
            raise RuntimeError(
                "Cloud API returned an invalid JSON response."
            ) from exc

        if not isinstance(data, dict) or not isinstance(data.get("code"), str):
            raise RuntimeError(
                f"Cloud model response must contain a string 'code': {data}"
            )

        generated = data["code"]
        if not generated.strip():
            raise RuntimeError("Cloud model returned empty generated code.")

        if (
            full_prompt.strip() in generated
            or (
                "STRICT GLOBAL RULES:" in generated
                and "USER TASK:" in generated
            )
        ):
            raise RuntimeError(
                "Cloud model repeated the generation prompt instead of producing code. "
                "Check that the Colab model is instruction-tuned "
                "(for example, Qwen2.5-Coder-7B-Instruct) and restart the Colab endpoint."
            )

        print("\n==============================")
        print("CLOUD RAW OUTPUT")
        print("==============================")
        print(repr(generated))
        print("==============================")


    # ========================================================
    # CLEAN OUTPUT
    # ========================================================

    generated = clean_output(generated)

    # ========================================================
    # DETECT LANGUAGE
    # ========================================================

    language = detect_language(user_prompt)

    print("\nDetected Language:", language)


    # ========================================================
    # SPLIT FILES
    # ========================================================

    files = split_files(generated)

    print("\n==============================")
    print("DETECTED FILES COUNT:", len(files))
    print("==============================")


    # ========================================================
    # MULTI FILE PROJECT (len(files) > 1)
    # ========================================================

    if len(files) > 1:

        formatted_files = []

        for file in files:
            filename = file["filename"].strip()
            code = file["code"]

            formatted_code = format_code(
                code,
                language
            )

            formatted_files.append(
                {
                    "filename": filename,
                    "code": formatted_code
                }
            )

        project_path = write_project(
            formatted_files,
            f"generated_project_{uuid.uuid4().hex}"
        )

        zip_path = zip_project(
            project_path
        )

        return {
            "language": language,
            "project_path": project_path,
            "zip_path": zip_path,
            "files": formatted_files
        }


    # ========================================================
    # SINGLE FILE (len(files) <= 1)
    # ========================================================

    
    if len(files) == 1:
        generated_code = files[0]["code"]
        filename = files[0]["filename"].strip()
    else:
        generated_code = generated
        filename = None

    formatted_code = format_code(
        generated_code,
        language
    )

    
    if not filename:
        filename = detect_filename(
            formatted_code,
            language
        )

    formatted_files = [
        {
            "filename": filename,
            "code": formatted_code
        }
    ]

    print("\n==============================")
    print("FINAL SINGLE FILE")
    print("==============================")
    print("Filename:", filename)
    print("Language:", language)
    print("==============================")

    return {
        "language": language,
        "files": formatted_files
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    prompt = "Write a Java program to print Hello World."

    result = generate_code(
        prompt,
        "qwen-1.5b"
    )

    print("\n==============================")
    print("FINAL RESULT")
    print("==============================")
    print(result)