import re


def split_files(generated_code):

    files = []

    if not generated_code:
        return files

    # =========================================================
    # Find all FILE markers
    # =========================================================

    pattern = (
        r"^[ \t]*(?://[ \t]*)?(?:#[ \t]*)?FILE:[ \t]*([^\r\n]+)"
        r"[ \t]*\r?\n"
    )

    matches = list(
        re.finditer(
            pattern,
            generated_code,
            flags=re.MULTILINE
        )
    )

    # =========================================================
    # No FILE markers
    # =========================================================

    if not matches:
        print("No FILE markers detected.")
        return files

    # =========================================================
    # Extract each file
    # =========================================================

    for index, match in enumerate(matches):

        filename = match.group(1).strip()

        # Start of file content
        start = match.end()

        # End of file content
        if index + 1 < len(matches):
            end = matches[index + 1].start()
        else:
            end = len(generated_code)

        code = generated_code[start:end].strip()

        # =====================================================
        # Remove accidental README/documentation
        # =====================================================

        readme_markers = [
            "\n/README.md",
            "\nREADME.md",
            "\n# Code Generation Assistant",
            "\n## Tasks",
            "\n## Contributing",
            "\n## License",
            "\n## Acknowledgments"
        ]

        for marker in readme_markers:

            position = code.lower().find(marker.lower())

            if position != -1:
                code = code[:position].rstrip()

        # =====================================================
        # Ignore README file completely
        # =====================================================

        if filename.lower().lstrip("/\\") in {
            "readme.md",
            "readme"
        }:
            continue

        # =====================================================
        # Remove markdown fences
        # =====================================================

        code = re.sub(
            r"^```[a-zA-Z0-9_+#.-]*\s*",
            "",
            code
        )

        code = re.sub(
            r"\s*```$",
            "",
            code
        )

        code = code.strip()

        # =====================================================
        # Add valid file
        # =====================================================

        if filename and code:

            files.append({
                "filename": filename,
                "code": code
            })

    # =========================================================
    # DEBUG
    # =========================================================

    print("\n==============================")
    print("SPLIT FILES RESULT")
    print("==============================")

    for file in files:

        print(
            "FILE:",
            file["filename"],
            "| CODE LENGTH:",
            len(file["code"])
        )

    print("==============================")

    return files