def plan_command(message):
    """
    Decide what ALTRON should do with the user's command.
    """

    message = message.lower().strip()

    # ==========================================
    # YOUTUBE
    # ==========================================

    if "youtube" in message and (
        "open" in message
        or "launch" in message
        or "start" in message
        or "search" in message
        or "find" in message
        or "look for" in message
        or "play" in message
    ):
        return {
            "type": "pc_action",
            "action": "execute"
        }

    # ==========================================
    # GOOGLE / WEB SEARCH
    # ==========================================

    if (
        "search" in message
        or "google search" in message
        or "search google" in message
    ):
        return {
            "type": "pc_action",
            "action": "execute"
        }

    # ==========================================
    # WEBSITES
    # ==========================================

    if (
        "open website" in message
        or "open google" in message
        or "launch google" in message
        or "start google" in message
    ):
        return {
            "type": "pc_action",
            "action": "execute"
        }

    # ==========================================
    # APPLICATIONS
    # ==========================================

    applications = [
        "open vscode",
        "open vs code",
        "launch vscode",
        "launch vs code",

        "open file explorer",
        "open explorer",

        "open notepad",
        "launch notepad",

        "open calculator",
        "open calc",
        "launch calculator",

        "open paint",
        "launch paint",

        "open command prompt",
        "open cmd",

        "open powershell",
        "launch powershell",

        "open task manager",
        "launch task manager",

        "open settings",
        "launch settings",

        "open control panel",
        "launch control panel",

        "open telegram",
        "launch telegram",

        "open whatsapp",
        "launch whatsapp",

        "open postman",
        "launch postman",
    ]

    for application in applications:
        if application in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # SCREEN / SYSTEM
    # ==========================================

    system_commands = [
        "take screenshot",
        "take a screenshot",
        "capture screen",
        "capture the screen",
        "screenshot",

        "system information",
        "system info",
        "pc information",
        "computer information",

        "lock pc",
        "lock my pc",
        "lock computer",
    ]

    for command in system_commands:
        if command in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # VOLUME
    # ==========================================

    volume_commands = [
        "increase volume",
        "volume up",
        "decrease volume",
        "volume down",
        "set volume",
        "mute",
        "unmute",
    ]

    for command in volume_commands:
        if command in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # BRIGHTNESS
    # ==========================================

    brightness_commands = [
        "increase brightness",
        "brightness up",
        "decrease brightness",
        "brightness down",
        "set brightness",
    ]

    for command in brightness_commands:
        if command in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # MEDIA
    # ==========================================

    media_commands = [
        "play music",
        "pause music",
        "play pause",
        "resume music",
        "next song",
        "next track",
        "next video",
        "skip song",
        "previous song",
        "previous track",
        "previous video",
        "stop music",
        "stop media",
        "stop video",
    ]

    for command in media_commands:
        if command in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # FILE / FOLDER
    # ==========================================

    file_commands = [
        "create folder",
        "create file",
        "open folder",
    ]

    for command in file_commands:
        if command in message:
            return {
                "type": "pc_action",
                "action": "execute"
            }

    # ==========================================
    # NORMAL CONVERSATION
    # ==========================================

    return {
        "type": "conversation",
        "action": "chat"
    }