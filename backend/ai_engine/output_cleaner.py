import re


def clean_output(text: str) -> str:

    if not text:
        return ""

    # ============================================================
    # 1. Remove thinking blocks
    # ============================================================

    text = re.sub(
        r"<think>.*?</think>",
        "",
        text,
        flags=re.DOTALL | re.IGNORECASE
    )

    # ============================================================
    # 2. Stop at end-of-text tokens
    # ============================================================

    end_tokens = [
        "<|endoftext|>",
        "<|im_end|>",
        "<|eot_id|>",
        "</s>"
    ]

    for token in end_tokens:

        if token in text:
            text = text.split(token, 1)[0]

    # ============================================================
    # 3. Remove special model tokens
    # ============================================================

    special_tokens = [
        "<|fim_prefix|>",
        "<|fim_middle|>",
        "<|fim_suffix|>",
        "<|file_sep|>",
        "<|im_start|>",
        "<|im_end|>",
        "<|eot_id|>"
    ]

    for token in special_tokens:
        text = text.replace(token, "")

    # ============================================================
    # 4. Remove markdown code fences ONLY
    #
    # IMPORTANT:
    # Do NOT remove normal source-code characters.
    # Do NOT remove FILE: markers.
    # ============================================================

    text = re.sub(
        r"```[a-zA-Z0-9_+#.-]*\s*",
        "",
        text
    )

    text = text.replace("```", "")

    # ============================================================
    # 5. Remove common leading labels
    # ============================================================

    text = re.sub(
        r"^\s*(?:Code|Response|Answer|Solution)\s*:\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    # ============================================================
    # 6. Remove language label ONLY if it is the first line
    #
    # IMPORTANT:
    # FILE: markers are preserved.
    # ============================================================

    language_labels = {
        "python",
        "java",
        "javascript",
        "typescript",
        "c",
        "c++",
        "cpp",
        "c#",
        "csharp",
        "go",
        "golang",
        "rust",
        "php",
        "html",
        "css",
        "sql",
        "kotlin",
        "swift",
        "dart",
        "flutter"
    }

    lines = text.splitlines()

    while lines and not lines[0].strip():
        lines.pop(0)

    if lines:

        first_line = lines[0].strip().lower()

        if first_line in language_labels:
            lines.pop(0)

    text = "\n".join(lines)

    # ============================================================
    # 7. Remove accidental "script" prefix
    # ============================================================

    if text.strip().lower().startswith("script"):

        text = text.strip()[6:].strip()

    # ============================================================
    # 8. Remove trailing explanations
    # ============================================================

    explanation_patterns = [
        r"\n\s*Explanation\s*:.*$",
        r"\n\s*Output\s*:.*$",
        r"\n\s*Example Usage\s*:.*$",
        r"\n\s*Requirements\s*:.*$"
    ]

    for pattern in explanation_patterns:

        text = re.sub(
            pattern,
            "",
            text,
            flags=re.DOTALL | re.IGNORECASE
        )

    # ============================================================
    # 9. Remove accidental repeated user task
    # ============================================================

    extra_task_markers = [
        "\nWrite a Java program",
        "\nWrite a Python program",
        "\nWrite a C program",
        "\nWrite a C++ program",
        "\nWrite a JavaScript program",
        "\nWrite a TypeScript program",
        "\nYour task is to implement"
    ]

    lower_text = text.lower()

    cut_position = None

    for marker in extra_task_markers:

        position = lower_text.find(marker.lower())

        if position != -1:

            if cut_position is None or position < cut_position:
                cut_position = position

    if cut_position is not None:

        text = text[:cut_position]

    # ============================================================
    # 10. Normalize excessive blank lines
    # ============================================================

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    # ============================================================
    # 11. Final cleanup
    # ============================================================

    return text.strip()