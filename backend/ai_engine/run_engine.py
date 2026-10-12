import os
import re
import socket
import subprocess
import threading
import time


# ============================================================
# RUNNING PROCESSES
# ============================================================

running_processes = {}


# ============================================================
# FIND FREE PORT
# ============================================================

def find_free_port(start_port=3000, max_attempts=50):

    for port in range(start_port, start_port + max_attempts):

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:

            try:
                sock.bind(("127.0.0.1", port))
                return port

            except OSError:
                continue

    raise RuntimeError("No free port available")


# ============================================================
# DETECT PROJECT TYPE
# ============================================================

def detect_project_type(project_path):

    """
    Detect generated project type.
    """

    # --------------------------------------------------------
    # Spring Boot
    # --------------------------------------------------------

    if os.path.exists(
        os.path.join(project_path, "pom.xml")
    ):
        return "spring"

    # --------------------------------------------------------
    # Node / React / Vite
    # --------------------------------------------------------

    if os.path.exists(
        os.path.join(project_path, "package.json")
    ):
        return "node"

    # --------------------------------------------------------
    # Django
    # --------------------------------------------------------

    if os.path.exists(
        os.path.join(project_path, "manage.py")
    ):
        return "django"

    # --------------------------------------------------------
    # Flask
    # --------------------------------------------------------

    if os.path.exists(
        os.path.join(project_path, "app.py")
    ):
        return "flask"

    # --------------------------------------------------------
    # FastAPI
    # --------------------------------------------------------

    for filename in [
        "main.py",
        "app.py",
        "server.py"
    ]:

        file_path = os.path.join(
            project_path,
            filename
        )

        if os.path.exists(file_path):

            try:

                with open(
                    file_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "fastapi" in content:
                    return "fastapi"

            except Exception:
                pass

    # --------------------------------------------------------
    # Static HTML
    # --------------------------------------------------------

    if os.path.exists(
        os.path.join(project_path, "index.html")
    ):
        return "html"

    return "unknown"


# ============================================================
# READ PROCESS OUTPUT
# ============================================================

def monitor_process(process, process_id):

    """
    Read process output in background.
    """

    try:

        for line in iter(
            process.stdout.readline,
            ""
        ):

            if not line:
                break

            line = line.rstrip()

            if line:
                print(
                    f"[PROCESS {process_id}] {line}"
                )

    except Exception as e:

        print(
            f"[PROCESS {process_id}] OUTPUT ERROR:",
            e
        )


# ============================================================
# START PROCESS
# ============================================================

def start_process(
    command,
    project_path,
    process_type,
    port
):

    print("\n================================")
    print("STARTING PROJECT")
    print("TYPE:", process_type)
    print("PORT:", port)
    print("COMMAND:", command)
    print("PATH:", project_path)
    print("================================")

    try:

        process = subprocess.Popen(
            command,
            cwd=project_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL,
            text=True,
            bufsize=1,
            shell=False
        )

        process_id = process.pid

        running_processes[process_id] = {
            "process": process,
            "type": process_type,
            "port": port,
            "path": project_path
        }

        # Start background output monitor
        thread = threading.Thread(
            target=monitor_process,
            args=(process, process_id),
            daemon=True
        )

        thread.start()

        return process

    except Exception as e:

        print(
            "PROCESS START ERROR:",
            repr(e)
        )

        raise


# ============================================================
# WAIT FOR SERVER
# ============================================================

def wait_for_port(
    port,
    timeout=15
):

    start_time = time.time()

    while time.time() - start_time < timeout:

        try:

            with socket.create_connection(
                ("127.0.0.1", port),
                timeout=1
            ):

                return True

        except OSError:
            time.sleep(0.5)

    return False


# ============================================================
# RUN PROJECT
# ============================================================

def run_project(project_path):

    if not os.path.isdir(project_path):

        return {
            "status": "error",
            "message": "Project directory not found"
        }

    project_type = detect_project_type(
        project_path
    )

    print("================================")
    print("PROJECT TYPE:", project_type)
    print("PROJECT PATH:", project_path)
    print("================================")

    # ========================================================
    # NODE / REACT / VITE
    # ========================================================

    if project_type == "node":

        try:

            port = find_free_port(5173)

            # ------------------------------------------------
            # Install dependencies
            # ------------------------------------------------

            package_file = os.path.join(
                project_path,
                "package.json"
            )

            print("\nInstalling Node dependencies...")

            npm_install = subprocess.run(
                ["npm.cmd", "install"],
                cwd=project_path,
                capture_output=True,
                text=True,
                timeout=300
            )

            if npm_install.returncode != 0:

                print(
                    "NPM INSTALL ERROR:"
                )

                print(
                    npm_install.stdout
                )

                print(
                    npm_install.stderr
                )

                return {
                    "status": "error",
                    "type": "node",
                    "message": (
                        "npm install failed"
                    ),
                    "stdout": npm_install.stdout,
                    "stderr": npm_install.stderr
                }

            # ------------------------------------------------
            # Start Vite / Node
            # ------------------------------------------------

            process = start_process(
                [
                    "npm.cmd",
                    "run",
                    "dev",
                    "--",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    str(port)
                ],
                project_path,
                "node",
                port
            )

            # ------------------------------------------------
            # Wait
            # ------------------------------------------------

            server_started = wait_for_port(
                port,
                timeout=15
            )

            if not server_started:

                if process.poll() is not None:

                    return {
                        "status": "error",
                        "type": "node",
                        "message": (
                            "Node process stopped before server started"
                        ),
                        "process_id": process.pid
                    }

                return {
                    "status": "starting",
                    "type": "node",
                    "process_id": process.pid,
                    "port": port,
                    "url": (
                        f"http://127.0.0.1:{port}"
                    )
                }

            return {
                "status": "running",
                "type": "node",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}"
                ),
                "message": "Node/React project is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "node",
                "message": str(e)
            }

    # ========================================================
    # SPRING BOOT
    # ========================================================

    if project_type == "spring":

        try:

            port = find_free_port(8080)

            process = start_process(
                [
                    "mvn.cmd",
                    "spring-boot:run",
                    f"-Dspring-boot.run.arguments=--server.port={port}"
                ],
                project_path,
                "spring",
                port
            )

            server_started = wait_for_port(
                port,
                timeout=30
            )

            if not server_started:

                if process.poll() is not None:

                    return {
                        "status": "error",
                        "type": "spring",
                        "message": (
                            "Spring Boot process stopped before server started"
                        ),
                        "process_id": process.pid
                    }

                return {
                    "status": "starting",
                    "type": "spring",
                    "process_id": process.pid,
                    "port": port,
                    "url": (
                        f"http://127.0.0.1:{port}"
                    )
                }

            return {
                "status": "running",
                "type": "spring",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}"
                ),
                "message": "Spring Boot project is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "spring",
                "message": str(e)
            }

    # ========================================================
    # FLASK
    # ========================================================

    if project_type == "flask":

        try:

            port = find_free_port(5000)

            process = start_process(
                [
                    "python",
                    "-m",
                    "flask",
                    "--app",
                    "app.py",
                    "run",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    str(port)
                ],
                project_path,
                "flask",
                port
            )

            server_started = wait_for_port(
                port,
                timeout=15
            )

            if not server_started:

                if process.poll() is not None:

                    return {
                        "status": "error",
                        "type": "flask",
                        "message": (
                            "Flask process stopped before server started"
                        ),
                        "process_id": process.pid
                    }

                return {
                    "status": "starting",
                    "type": "flask",
                    "process_id": process.pid,
                    "port": port,
                    "url": (
                        f"http://127.0.0.1:{port}"
                    )
                }

            return {
                "status": "running",
                "type": "flask",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}"
                ),
                "message": "Flask project is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "flask",
                "message": str(e)
            }

    # ========================================================
    # DJANGO
    # ========================================================

    if project_type == "django":

        try:

            port = find_free_port(8000)

            process = start_process(
                [
                    "python",
                    "manage.py",
                    "runserver",
                    f"127.0.0.1:{port}"
                ],
                project_path,
                "django",
                port
            )

            server_started = wait_for_port(
                port,
                timeout=15
            )

            if not server_started:

                return {
                    "status": "starting",
                    "type": "django",
                    "process_id": process.pid,
                    "port": port,
                    "url": (
                        f"http://127.0.0.1:{port}"
                    )
                }

            return {
                "status": "running",
                "type": "django",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}"
                ),
                "message": "Django project is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "django",
                "message": str(e)
            }

    # ========================================================
    # FASTAPI
    # ========================================================

    if project_type == "fastapi":

        try:

            port = find_free_port(8000)

            process = start_process(
                [
                    "python",
                    "-m",
                    "uvicorn",
                    "main:app",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    str(port)
                ],
                project_path,
                "fastapi",
                port
            )

            server_started = wait_for_port(
                port,
                timeout=15
            )

            return {
                "status": (
                    "running"
                    if server_started
                    else "starting"
                ),
                "type": "fastapi",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}"
                ),
                "message": "FastAPI project is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "fastapi",
                "message": str(e)
            }

    # ========================================================
    # STATIC HTML
    # ========================================================

    if project_type == "html":

        try:

            port = find_free_port(5500)

            process = start_process(
                [
                    "python",
                    "-m",
                    "http.server",
                    str(port),
                    "--bind",
                    "127.0.0.1"
                ],
                project_path,
                "html",
                port
            )

            server_started = wait_for_port(
                port,
                timeout=5
            )

            return {
                "status": (
                    "preview"
                    if server_started
                    else "starting"
                ),
                "type": "html",
                "process_id": process.pid,
                "port": port,
                "url": (
                    f"http://127.0.0.1:{port}/index.html"
                ),
                "message": "HTML project preview is running"
            }

        except Exception as e:

            return {
                "status": "error",
                "type": "html",
                "message": str(e)
            }

    # ========================================================
    # UNKNOWN
    # ========================================================

    return {
        "status": "error",
        "type": "unknown",
        "message": (
            "Unable to detect project type"
        )
    }


# ============================================================
# STOP PROJECT
# ============================================================

def stop_project(process_id):

    try:

        process_info = running_processes.get(
            int(process_id)
        )

        if not process_info:

            return {
                "status": "error",
                "message": "Process not found"
            }

        process = process_info["process"]

        if process.poll() is None:

            process.terminate()

            try:

                process.wait(timeout=5)

            except subprocess.TimeoutExpired:

                process.kill()

        del running_processes[
            int(process_id)
        ]

        return {
            "status": "stopped",
            "process_id": int(process_id)
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }