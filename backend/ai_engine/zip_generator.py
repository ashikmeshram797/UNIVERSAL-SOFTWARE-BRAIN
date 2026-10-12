import os
import zipfile


def zip_project(project_path):

    zip_path = project_path + ".zip"

    with zipfile.ZipFile(
        zip_path,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zipf:

        for root, dirs, files in os.walk(project_path):

            for file in files:

                filepath = os.path.join(root, file)

                arcname = os.path.relpath(
                    filepath,
                    project_path
                )

                zipf.write(
                    filepath,
                    arcname
                )

    return zip_path