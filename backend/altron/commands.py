from .executor import (
    open_youtube,
    open_google,
    open_url,
    google_search,
    youtube_search,

    open_vscode,
    open_file_explorer,
    open_notepad,
    open_calculator,
    open_paint,
    open_command_prompt,
    open_powershell,

    open_task_manager,
    open_settings,
    open_control_panel,

    open_path,
    create_folder,
    create_file,
    rename_file_or_folder,
    copy_file,
    move_file,

    get_system_info,
    lock_pc,
    take_screenshot,

    set_volume,
    increase_volume,
    decrease_volume,
    mute_volume,
    unmute_volume,

    set_brightness,
    increase_brightness,
    decrease_brightness,

    media_play_pause,
    media_next,
    media_previous,
    media_stop,
)


def execute_command(command):

    original_command = command
    command = command.lower().strip()

    # =====================================================
    # YOUTUBE
    # =====================================================

    if (
        "open youtube" in command
        or "launch youtube" in command
        or "start youtube" in command
    ):
        return open_youtube()

    if "youtube" in command and (
        "search" in command
        or "find" in command
        or "look for" in command
    ):
        query = extract_search_query(
            original_command,
            ["youtube", "search", "find", "look for","i want to search for on youtube", "search on youtube","on youtube","in youtube"]
        )

        if query:
            return youtube_search(query)

        return {
            "status": "error",
            "message": "What should I search for on YouTube?"
        }

    # =====================================================
    # GOOGLE
    # =====================================================

    if (
        "open google" in command
        or "launch google" in command
        or "start google" in command
    ):
        return open_google()

    if (
        "search google" in command
        or "google search" in command
        or "search for" in command
        or "search" in command
    ):
        query = extract_search_query(
            original_command,
            ["google", "search", "for", "find", "look for","i want to search for", "search on google","in google","in"]
        )

        if query:
            return google_search(query)

        return {
            "status": "error",
            "message": "What should I search for?"
        }

    # =====================================================
    # WEBSITE
    # =====================================================

    if "open website" in command:
        parts = original_command.split("open website", 1)

        if len(parts) == 2:
            url = parts[1].strip()

            if url:
                return open_url(url)

        return {
            "status": "error",
            "message": "Please tell me which website to open."
        }

    # =====================================================
    # APPLICATIONS
    # =====================================================

    if (
        "open vscode" in command
        or "open vs code" in command
        or "launch vscode" in command
        or "launch vs code" in command
    ):
        return open_vscode()

    if (
        "open file explorer" in command
        or "open explorer" in command
    ):
        return open_file_explorer()

    if (
        "open notepad" in command
        or "launch notepad" in command
    ):
        return open_notepad()

    if (
        "open calculator" in command
        or "open calc" in command
        or "launch calculator" in command
    ):
        return open_calculator()

    if (
        "open paint" in command
        or "launch paint" in command
    ):
        return open_paint()

    if (
        "open command prompt" in command
        or "open cmd" in command
    ):
        return open_command_prompt()

    if (
        "open powershell" in command
        or "launch powershell" in command
    ):
        return open_powershell()

    # =====================================================
    # WINDOWS UTILITIES
    # =====================================================

    if (
        "open task manager" in command
        or "launch task manager" in command
    ):
        return open_task_manager()

    if (
        "open settings" in command
        or "launch settings" in command
        or "windows settings" in command
    ):
        return open_settings()

    if (
        "open control panel" in command
        or "launch control panel" in command
    ):
        return open_control_panel()

    # =====================================================
    # SCREENSHOT
    # =====================================================

    if (
        "take screenshot" in command
        or "take a screenshot" in command
        or "capture screen" in command
        or "capture the screen" in command
        or "screenshot" in command
    ):
        return take_screenshot()

    # =====================================================
    # SYSTEM INFORMATION
    # =====================================================

    if (
        "system information" in command
        or "system info" in command
        or "pc information" in command
        or "computer information" in command
    ):
        return get_system_info()

    # =====================================================
    # LOCK PC
    # =====================================================

    if (
        "lock pc" in command
        or "lock my pc" in command
        or "lock computer" in command
    ):
        return lock_pc()
        # ==============================
    # VOLUME
    # ==============================

    if "increase volume" in command or "volume up" in command:
        return increase_volume()

    if "decrease volume" in command or "volume down" in command:
        return decrease_volume()

    if "mute volume" in command or "mute sound" in command or command == "mute":
        return mute_volume()

    if "unmute volume" in command or "unmute sound" in command or command == "unmute":
        return unmute_volume()

    if "set volume" in command:
        value = extract_number(command)

        if value is not None:
            return set_volume(value)

        return {
            "status": "error",
            "message": "Please tell me the volume percentage."
        }
        # ==============================
    # BRIGHTNESS
    # ==============================

    if "increase brightness" in command or "brightness up" in command:
        return increase_brightness()

    if "decrease brightness" in command or "brightness down" in command:
        return decrease_brightness()

    if "set brightness" in command:
        value = extract_number(command)

        if value is not None:
            return set_brightness(value)

        return {
            "status": "error",
            "message": "Please tell me the brightness percentage."
        }
        # ==============================
    # MEDIA
    # ==============================

    if (
        "play music" in command
        or "pause music" in command
        or "play pause" in command
        or "pause" == command
        or "resume music" in command
    ):
        return media_play_pause()

    if (
        "next song" in command
        or "next track" in command
        or "next video" in command
        or "skip song" in command
    ):
        return media_next()

    if (
        "previous song" in command
        or "previous track" in command
        or "previous video" in command
        or "go back song" in command
    ):
        return media_previous()

    if (
        "stop music" in command
        or "stop media" in command
        or "stop video" in command
    ):
        return media_stop()

    # =====================================================
    # FILE / FOLDER
    # =====================================================

    if "create folder" in command:
        folder_name = extract_after_phrase(
            original_command,
            "create folder"
        )

        if folder_name:
            return create_folder(folder_name)

        return {
            "status": "error",
            "message": "Please tell me the folder name."
        }

    if "create file" in command:
        file_name = extract_after_phrase(
            original_command,
            "create file"
        )

        if file_name:
            return create_file(file_name)

        return {
            "status": "error",
            "message": "Please tell me the file name."
        }

    # =====================================================
    # OPEN PATH
    # =====================================================

    if "open folder" in command:
        folder_path = extract_after_phrase(
            original_command,
            "open folder"
        )

        if folder_path:
            return open_path(folder_path)

        return {
            "status": "error",
            "message": "Please tell me which folder to open."
        }

    # =====================================================
    # UNKNOWN COMMAND
    # =====================================================

    return None


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def extract_search_query(command, words_to_remove):

    query = command

    for word in words_to_remove:
        query = query.replace(word, "")

    query = query.strip()

    return query


def extract_after_phrase(command, phrase):

    command_lower = command.lower()
    phrase_lower = phrase.lower()

    index = command_lower.find(phrase_lower)

    if index == -1:
        return ""

    result = command[index + len(phrase):].strip()

    return result
def extract_number(command):
    import re

    match = re.search(r"\b(\d{1,3})\b", command)

    if match:
        return int(match.group(1))

    return None