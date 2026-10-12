 import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    if (step !== 2) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer, step]);

  // =========================
  // SEND OTP
  // =========================

  const handleSendOTP = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("OTP sent successfully");

        setTimer(30);
        setCanResend(false);
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter complete 6-digit OTP");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("OTP Verified Successfully");
        setStep(3);
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOTP = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("New OTP sent successfully");

        setOtp(["", "", "", "", "", ""]);
        setTimer(30);
        setCanResend(false);
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Password Reset Successfully");
        setStep(4);
      } else {
        alert(data.message || "Password reset failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#090B1A] via-[#111827] to-[#1E1B4B]">

      <div className="w-[540px] min-h-[620px] rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl px-12 py-12 shadow-[0_0_60px_rgba(34,211,238,0.18)] flex flex-col">

        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Forgot Password
        </h1>

        <p className="text-center text-gray-400 mt-6 text-lg mb-16">
          Enter your registered email to receive an OTP.
        </p>

        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <div className="flex flex-col gap-8 mt-10">

            <div>
              <label className="text-gray-300 text-sm">
                Email Address
              </label>

              <div className="mt-3 bg-[#1E293B] rounded-xl px-4 py-4">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none text-white w-full"
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg hover:scale-105 duration-300"
            >
              Send OTP
            </button>

          </div>
        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && (
          <div className="flex flex-col gap-8 mt-6">

            <h2 className="text-3xl font-bold text-white text-center">
              OTP Verification
            </h2>

            <p className="text-center text-gray-400">
              Enter the 6-digit OTP sent to your email
            </p>

            <div className="flex justify-center gap-4">

              {[1, 2, 3, 4, 5, 6].map((i) => (

                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i - 1] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={otp[i - 1]}
                  className="w-14 h-14 rounded-xl bg-[#1E293B] text-white text-center text-xl outline-none border border-gray-700 focus:border-cyan-400"

                  onChange={(e) => {

                    const value = e.target.value;

                    if (!/^\d?$/.test(value)) {
                      return;
                    }

                    const newOtp = [...otp];

                    newOtp[i - 1] = value;

                    setOtp(newOtp);

                    if (value && i < 6) {
                      inputRefs.current[i]?.focus();
                    }
                  }}

                  onKeyDown={(e) => {

                    if (
                      e.key === "Backspace" &&
                      otp[i - 1] === "" &&
                      i > 1
                    ) {
                      inputRefs.current[i - 2]?.focus();
                    }

                  }}
                />

              ))}

            </div>

            <div className="text-center">

              {canResend ? (

                <button
                  onClick={handleResendOTP}
                  className="text-cyan-400 hover:underline"
                >
                  Resend OTP
                </button>

              ) : (

                <p className="text-gray-400">
                  Resend OTP

                  <span className="text-cyan-400 ml-2">
                    00:{timer.toString().padStart(2, "0")}
                  </span>
                </p>

              )}

            </div>

            <button
              onClick={handleVerifyOTP}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:scale-105 duration-300"
            >
              Verify OTP
            </button>

          </div>
        )}

        {/* ================= STEP 3 ================= */}

        {step === 3 && (

          <div className="flex flex-col gap-6 mt-6">

            <h2 className="text-3xl font-bold text-white text-center">
              Reset Password
            </h2>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-[#1E293B] rounded-xl p-4 text-white outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#1E293B] rounded-xl p-4 text-white outline-none"
            />

            <button
              onClick={handleResetPassword}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300"
            >
              Reset Password
            </button>

          </div>

        )}

        {/* ================= STEP 4 ================= */}

        {step === 4 && (

          <div className="flex flex-col items-center gap-6 mt-10">

            <div className="text-7xl">
              ✅
            </div>

            <h2 className="text-3xl font-bold text-white text-center">
              Password Reset Successfully
            </h2>

            <p className="text-gray-400 text-center">
              Your password has been updated successfully.
            </p>

             

          </div>

        )}

        <p className="text-center mt-auto pt-10 text-gray-400">
          Remember your password?{" "}

          <span
            onClick={() => navigate("/")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Back to Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;