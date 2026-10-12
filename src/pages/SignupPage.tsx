import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
const [timer, setTimer] = useState(30);
const [canResend, setCanResend] = useState(false);
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [mobile, setMobile] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [otp, setOtp] = useState(["", "", "", "", "", ""]);

 const handleSignup = async () => {

  // Check empty fields
  if (
    !fullName.trim() ||
    !email.trim() ||
    !mobile.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  // Check password match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }


  try {
    const response = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("OTP Sent Successfully");
      setStep(2);
    } else {
      alert(data.message || data.error);
    }

  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

const handleVerifyOTP = async () => {
  const enteredOtp = otp.join("");

  try {
    const response = await fetch("http://127.0.0.1:5000/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: enteredOtp,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("OTP Verified Successfully");
      localStorage.setItem("signup_email", email);
      setStep(3);
    } else {
      alert(data.message || "Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#090B1A] via-[#111827] to-[#1E1B4B]">

      <div className="w-[540px] min-h-[620px] rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl px-12 py-12 shadow-[0_0_60px_rgba(34,211,238,0.18)]">

        <h1 className="text-3xl font-bold text-white text-center">
          Create Your Account
        </h1>

        <p className="text-center text-gray-400 mt-4 mb-10">
          Join Universal Software Brain and unlock AI-powered productivity.
        </p>

        {step === 1 && (
          <div className="flex flex-col gap-6">

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-[#1E293B] rounded-xl p-4 text-white outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1E293B] rounded-xl p-4 text-white outline-none"
            />
            

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="bg-[#1E293B] rounded-xl p-4 text-white outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  onClick={handleSignup}
  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold"
>
  Create Account
</button>

          </div>
        )}
        {step === 2 && (
  <div className="flex flex-col gap-8 mt-6">

    <h2 className="text-3xl font-bold text-white text-center">
      Email Verification
    </h2>

    <p className="text-center text-gray-400">
      Enter the 6-digit OTP sent to your email
    </p>

    <div className="flex justify-center gap-4">

      {[1,2,3,4,5,6].map((i)=>(
        <input
          key={i}
          ref={(el)=>{
            inputRefs.current[i-1]=el;
          }}
          type="text"
          maxLength={1}
          className="w-14 h-14 rounded-xl bg-[#1E293B] border border-gray-700 text-white text-center text-xl outline-none focus:border-cyan-400"

          onChange={(e)=>{
            const value=e.target.value;

            if(!/^\d?$/.test(value)){
              e.target.value="";
              return;
            }
            const newOtp=[...otp];
            newOtp[i-1]=value;
            setOtp(newOtp);

            if(value && i<6){
              inputRefs.current[i]?.focus();
            }
          }}

          onKeyDown={(e)=>{
            if(
              e.key==="Backspace" &&
              (e.target as HTMLInputElement).value==="" &&
              i>1
            ){
              inputRefs.current[i-2]?.focus();
            }
          }}
        />
      ))}

    </div>

    <div className="text-center">

      {canResend ? (

        <button
          onClick={()=>{
            setTimer(30);
            setCanResend(false);
          }}
          className="text-cyan-400 hover:underline"
        >
          Resend OTP
        </button>

      ) : (

        <p className="text-gray-400">
          Resend OTP in
          <span className="text-cyan-400 ml-2">
            00:{timer.toString().padStart(2,"0")}
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
{step === 3 && (
  <div className="flex flex-col gap-8 mt-6">

    <h2 className="text-3xl font-bold text-white text-center">
      Almost Done 🎉
    </h2>

    <p className="text-center text-gray-400">
      Your account details have been verified successfully.
    </p>

    <div className="bg-[#1E293B]/70 rounded-2xl p-6 space-y-5 border border-gray-700">

      <div className="flex items-center gap-3">
        <span className="text-green-400 text-xl">✅</span>
        <p className="text-white">Email Verified</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-green-400 text-xl">✅</span>
        <p className="text-white">Mobile Number Verified</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-green-400 text-xl">✅</span>
        <p className="text-white">Account Details Verified</p>
      </div>

    </div>

    <button
      onClick={() => setStep(4)}
      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300"
    >
      Continue
    </button>

  </div>
)}
{step === 4 && (
  <div className="flex flex-col items-center gap-6 mt-8">

    <div className="text-7xl">🎉</div>

    <h2 className="text-3xl font-bold text-white text-center">
      Account Created Successfully
    </h2>

    <p className="text-center text-gray-400">
      Your account has been created successfully.
      <br />
      Next step is Face Registration to enable Secure AI Login.
    </p>

     <button
  onClick={() => navigate("/face-registration")}
  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300"
>
  Continue to Face Registration
</button>

    <button
      onClick={() => navigate("/")}
      className="text-cyan-400 hover:underline"
    >
      Back to Login
    </button>

  </div>
)}

         

      </div>

    </div>
  );
}

export default SignupPage;