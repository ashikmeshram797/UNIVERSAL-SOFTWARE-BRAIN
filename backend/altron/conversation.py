def conversation_response(message):

    message = message.lower().strip()

    if any(word in message for word in [
        "hello",
        "hi",
        "hey"
    ]):
        return "Hello! I'm ALTRON. How can I help you today?"

    if "how are you" in message:
        return "I'm doing great! Thanks for asking. How can I help you?"

    if "who are you" in message:
        return (
            "I'm ALTRON, your personal AI assistant. "
            "I can have conversations with you and help control your computer."
        )

    if "what can you do" in message:
        return (
            "I can have normal conversations with you and perform tasks "
            "on your computer, such as opening applications and websites."
        )

    if "thank you" in message or "thanks" in message:
        return "You're welcome! I'm always happy to help."

    if "good morning" in message:
        return "Good morning! I hope you're having a great day."

    if "good night" in message:
        return "Good night! Take care and have a great rest."

    return (
        "I understand what you're saying, but I don't have an answer "
        "for that yet."
    )