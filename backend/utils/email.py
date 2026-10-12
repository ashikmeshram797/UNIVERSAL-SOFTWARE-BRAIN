from flask_mail import Message

def send_otp(mail, receiver_email, otp):
    msg = Message(
        subject="Universal Software Brain - Email Verification OTP",
        sender="meshramashik2233@gmail.com",
        recipients=[receiver_email]
    )

    msg.body = f"""
Hello,

Welcome to Universal Software Brain.

Your OTP for Email Verification is:

{otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

Regards,
Universal Software Brain
"""

    mail.send(msg)