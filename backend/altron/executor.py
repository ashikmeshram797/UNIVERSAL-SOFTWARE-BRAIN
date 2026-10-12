import os
import webbrowser
import subprocess
import platform
import shutil
import time
import pyautogui
import screen_brightness_control as sbc
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume


# =========================================================
# ALTRON - PC EXECUTOR
# =========================================================


def success(message):
    return {
        "status": "success",
        "message": message
    }


def error(message):
    return {
        "status": "error",
        "message": message
    }


# =========================================================
# BROWSER
# =========================================================

def open_youtube():
    webbrowser.open("https://www.youtube.com")
    return success("Sure, I'm opening YouTube for you.")


def open_google():
    webbrowser.open("https://www.google.com")
    return success("Sure, I'm opening Google for you.")


def open_url(url):
    try:
        if not url.startswith(("http://", "https://")):
            url = "https://" + url

        webbrowser.open(url)

        return success(f"Sure, I'm opening {url} for you.")

    except Exception as e:
        return error(f"I couldn't open the website. {str(e)}")


def google_search(query):
    try:
        search_url = (
            "https://www.google.com/search?q="
            + query.replace(" ", "+")
        )

        webbrowser.open(search_url)

        return success(f"Searching Google for {query}.")

    except Exception as e:
        return error(f"I couldn't perform the search. {str(e)}")


def youtube_search(query):
    try:
        search_url = (
            "https://www.youtube.com/results?search_query="
            + query.replace(" ", "+")
        )

        webbrowser.open(search_url)

        return success(f"Searching YouTube for {query}.")

    except Exception as e:
        return error(f"I couldn't search YouTube. {str(e)}")


# =========================================================
# APPLICATIONS
# =========================================================

def open_vscode():
    try:
        subprocess.Popen(["code"])

        return success(
            "Sure, I'm opening Visual Studio Code for you."
        )

    except Exception as e:
        return error(
            f"I couldn't open Visual Studio Code. {str(e)}"
        )


def open_file_explorer():
    try:
        os.startfile(".")

        return success(
            "Sure, I'm opening File Explorer for you."
        )

    except Exception as e:
        return error(
            f"I couldn't open File Explorer. {str(e)}"
        )


def open_notepad():
    try:
        subprocess.Popen(["notepad.exe"])

        return success("I'm opening Notepad for you.")

    except Exception as e:
        return error(f"I couldn't open Notepad. {str(e)}")


def open_calculator():
    try:
        subprocess.Popen(["calc.exe"])

        return success("I'm opening Calculator for you.")

    except Exception as e:
        return error(f"I couldn't open Calculator. {str(e)}")


def open_paint():
    try:
        subprocess.Popen(["mspaint.exe"])

        return success("I'm opening Paint for you.")

    except Exception as e:
        return error(f"I couldn't open Paint. {str(e)}")


def open_command_prompt():
    try:
        subprocess.Popen(["cmd.exe"])

        return success("I'm opening Command Prompt for you.")

    except Exception as e:
        return error(f"I couldn't open Command Prompt. {str(e)}")


def open_powershell():
    try:
        subprocess.Popen(["powershell.exe"])

        return success("I'm opening PowerShell for you.")

    except Exception as e:
        return error(f"I couldn't open PowerShell. {str(e)}")


# =========================================================
# WINDOWS UTILITIES
# =========================================================

def open_task_manager():
    try:
        subprocess.Popen(
            ["taskmgr.exe"]
        )

        return success("I'm opening Task Manager for you.")

    except Exception as e:
        return error(f"I couldn't open Task Manager. {str(e)}")


def open_settings():
    try:
        os.system("start ms-settings:")

        return success("I'm opening Windows Settings for you.")

    except Exception as e:
        return error(f"I couldn't open Windows Settings. {str(e)}")


def open_control_panel():
    try:
        subprocess.Popen(
            ["control.exe"]
        )

        return success("I'm opening Control Panel for you.")

    except Exception as e:
        return error(f"I couldn't open Control Panel. {str(e)}")


# =========================================================
# FILE OPERATIONS
# =========================================================

def open_path(path):
    try:
        if os.path.exists(path):
            os.startfile(path)

            return success(
                f"I'm opening {path} for you."
            )

        return error(
            f"I couldn't find {path}."
        )

    except Exception as e:
        return error(
            f"I couldn't open the requested location. {str(e)}"
        )


def create_folder(path):
    try:
        os.makedirs(path, exist_ok=True)

        return success(
            f"I created the folder {path}."
        )

    except Exception as e:
        return error(
            f"I couldn't create the folder. {str(e)}"
        )


def create_file(path):
    try:
        with open(path, "w", encoding="utf-8") as file:
            file.write("")

        return success(
            f"I created the file {path}."
        )

    except Exception as e:
        return error(
            f"I couldn't create the file. {str(e)}"
        )


def rename_file_or_folder(old_path, new_path):
    try:
        if not os.path.exists(old_path):
            return error(
                f"I couldn't find {old_path}."
            )

        os.rename(old_path, new_path)

        return success(
            f"I renamed it to {new_path}."
        )

    except Exception as e:
        return error(
            f"I couldn't rename it. {str(e)}"
        )


def copy_file(source, destination):
    try:
        shutil.copy2(source, destination)

        return success(
            f"I copied the file to {destination}."
        )

    except Exception as e:
        return error(
            f"I couldn't copy the file. {str(e)}"
        )


def move_file(source, destination):
    try:
        shutil.move(source, destination)

        return success(
            f"I moved the file to {destination}."
        )

    except Exception as e:
        return error(
            f"I couldn't move the file. {str(e)}"
        )


# =========================================================
# SYSTEM INFORMATION
# =========================================================

def get_system_info():
    try:
        system = platform.system()
        release = platform.release()
        version = platform.version()
        machine = platform.machine()

        message = (
            f"Your system is {system} {release}. "
            f"Version: {version}. "
            f"Architecture: {machine}."
        )

        return success(message)

    except Exception as e:
        return error(
            f"I couldn't get system information. {str(e)}"
        )


# =========================================================
# SYSTEM ACTIONS
# =========================================================

def lock_pc():
    try:
        subprocess.run(
            ["rundll32.exe", "user32.dll,LockWorkStation"],
            check=False
        )

        return success("I'm locking your PC.")

    except Exception as e:
        return error(
            f"I couldn't lock your PC. {str(e)}"
        )


def shutdown_pc():
    return error(
        "Shutdown is protected. Confirmation is required before this action."
    )


def restart_pc():
    return error(
        "Restart is protected. Confirmation is required before this action."
    )


# =========================================================
# SCREENSHOT
# =========================================================

def take_screenshot():
    try:
        from PIL import ImageGrab

        screenshot = ImageGrab.grab()

        screenshot_path = os.path.join(
            os.path.expanduser("~"),
            "Pictures",
            "altron_screenshot.png"
        )

        os.makedirs(
            os.path.dirname(screenshot_path),
            exist_ok=True
        )

        screenshot.save(screenshot_path)

        return success(
            f"Screenshot saved at {screenshot_path}."
        )

    except ImportError:
        return error(
            "Screenshot requires Pillow. Install it using: pip install pillow"
        )

    except Exception as e:
        return error(
            f"I couldn't take the screenshot. {str(e)}"
        )


# =========================================================
# WAIT / DELAY
# =========================================================

def wait_seconds(seconds):
    try:
        seconds = float(seconds)

        if seconds < 0:
            return error("The waiting time cannot be negative.")

        time.sleep(seconds)

        return success(
            f"I waited for {seconds} seconds."
        )

    except Exception as e:
        return error(
            f"I couldn't wait for the requested time. {str(e)}"
        )
# ==============================
# VOLUME CONTROL
# ==============================

def get_volume_controller():
    import pythoncom

    pythoncom.CoInitialize()

    speakers = AudioUtilities.GetSpeakers()

    # New pycaw versions
    if hasattr(speakers, "EndpointVolume"):
        return speakers.EndpointVolume

    # Older pycaw versions
    if hasattr(speakers, "Activate"):
        interface = speakers.Activate(
            IAudioEndpointVolume._iid_,
            CLSCTX_ALL,
            None
        )

        return cast(
            interface,
            POINTER(IAudioEndpointVolume)
        )

    raise RuntimeError(
        "Your installed pycaw version is not compatible with the volume controller."
    )


def set_volume(level):
    try:
        level = int(level)

        if level < 0:
            level = 0

        if level > 100:
            level = 100

        volume = get_volume_controller()
        volume.SetMasterVolumeLevelScalar(level / 100, None)

        return success(f"Volume set to {level} percent.")

    except Exception as e:
        return error(f"I couldn't change the volume. {str(e)}")


def increase_volume(amount=10):
    try:
        volume = get_volume_controller()

        current = volume.GetMasterVolumeLevelScalar() * 100
        new_level = min(100, current + amount)

        volume.SetMasterVolumeLevelScalar(new_level / 100, None)

        return success(f"Volume increased to {int(new_level)} percent.")

    except Exception as e:
        return error(f"I couldn't increase the volume. {str(e)}")


def decrease_volume(amount=10):
    try:
        volume = get_volume_controller()

        current = volume.GetMasterVolumeLevelScalar() * 100
        new_level = max(0, current - amount)

        volume.SetMasterVolumeLevelScalar(new_level / 100, None)

        return success(f"Volume decreased to {int(new_level)} percent.")

    except Exception as e:
        return error(f"I couldn't decrease the volume. {str(e)}")


def mute_volume():
    try:
        volume = get_volume_controller()
        volume.SetMute(1, None)

        return success("Volume muted.")

    except Exception as e:
        return error(f"I couldn't mute the volume. {str(e)}")


def unmute_volume():
    try:
        volume = get_volume_controller()
        volume.SetMute(0, None)

        return success("Volume unmuted.")

    except Exception as e:
        return error(f"I couldn't unmute the volume. {str(e)}")


# ==============================
# BRIGHTNESS CONTROL
# ==============================

def set_brightness(level):
    try:
        level = int(level)

        if level < 0:
            level = 0

        if level > 100:
            level = 100

        sbc.set_brightness(level)

        return success(f"Brightness set to {level} percent.")

    except Exception as e:
        return error(f"I couldn't change the brightness. {str(e)}")


def increase_brightness(amount=10):
    try:
        current = sbc.get_brightness()

        if isinstance(current, list):
            current = current[0]

        new_level = min(100, int(current) + amount)

        sbc.set_brightness(new_level)

        return success(f"Brightness increased to {new_level} percent.")

    except Exception as e:
        return error(f"I couldn't increase the brightness. {str(e)}")


def decrease_brightness(amount=10):
    try:
        current = sbc.get_brightness()

        if isinstance(current, list):
            current = current[0]

        new_level = max(0, int(current) - amount)

        sbc.set_brightness(new_level)

        return success(f"Brightness decreased to {new_level} percent.")

    except Exception as e:
        return error(f"I couldn't decrease the brightness. {str(e)}")


# ==============================
# MEDIA CONTROLS
# ==============================

def media_play_pause():
    try:
        pyautogui.press("playpause")

        return success("Play/Pause toggled.")

    except Exception as e:
        return error(f"I couldn't control media playback. {str(e)}")


def media_next():
    try:
        pyautogui.press("nexttrack")

        return success("Playing the next track.")

    except Exception as e:
        return error(f"I couldn't play the next track. {str(e)}")


def media_previous():
    try:
        pyautogui.press("prevtrack")

        return success("Playing the previous track.")

    except Exception as e:
        return error(f"I couldn't play the previous track. {str(e)}")


def media_stop():
    try:
        pyautogui.press("stop")

        return success("Media playback stopped.")

    except Exception as e:
        return error(f"I couldn't stop media playback. {str(e)}")        