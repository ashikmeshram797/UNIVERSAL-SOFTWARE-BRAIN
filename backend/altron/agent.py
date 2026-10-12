from .commands import execute_command
from .conversation import conversation_response
from .planner import plan_command


def process_command(message):

    if not message or not message.strip():
        return {
            "status": "error",
            "type": "error",
            "message": "Please tell me what you need."
        }

    message = message.strip()

    # =========================
    # STEP 1: PLAN THE COMMAND
    # =========================

    plan = plan_command(message)

    # =========================
    # STEP 2: PC ACTION
    # =========================

    if plan["type"] == "pc_action":

        task_result = execute_command(message)

        if task_result:
            return {
                "status": task_result.get("status", "success"),
                "type": "task",
                "message": task_result.get("message", "")
            }

    # =========================
    # STEP 3: NORMAL CONVERSATION
    # =========================

    response = conversation_response(message)

    return {
        "status": "success",
        "type": "conversation",
        "message": response
    }