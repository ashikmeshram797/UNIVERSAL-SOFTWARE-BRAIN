from pathlib import Path

def write_project(files, project_name="generated_project"):

    output_root = Path(__file__).resolve().parents[1] / "generated_projects"
    base_path = (output_root / project_name).resolve()
    if output_root.resolve() not in base_path.parents:
        raise ValueError("Project name must stay inside generated_projects")

    base_path.mkdir(parents=True, exist_ok=True)

    for file in files:
        clean_filename = str(file["filename"]).lstrip("/\\")
        filepath = (base_path / clean_filename).resolve()
        if base_path not in filepath.parents:
            raise ValueError(
                f"Generated filename must stay inside the project: {file['filename']}"
            )

        filepath.parent.mkdir(parents=True, exist_ok=True)
        with filepath.open("w", encoding="utf-8") as f:
            f.write(file["code"])

    return str(base_path)