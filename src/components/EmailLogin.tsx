 import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function EmailLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


const handleLogin = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token); // Store the token in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard"); // Navigate to the dashboard or any other page
      alert("Login Successful");
    } else {
      alert(data.message || "Invalid Email or Password");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};
  return (
    <div>
     <div>
  <label className="block text-gray-300 text-sm font-medium gap-2">
    Email Address
  </label>
  <div className="mt-5 flex items-center bg-[#1E293B] rounded-xl px-4 py-2.5 border border-white/5">
    <FiMail className="text-cyan-400 text-lg" />
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="bg-transparent outline-none text-white ml-3 w-full text-sm"
    />
  </div>
</div>

      <div className="mt-3.5">
        <label className="block text-gray-300 mb-10 text-sm font-medium">
          Password
        </label>
        <div className=" mt-5 flex items-center bg-[#1E293B] rounded-xl px-4 py-2.5 border border-white/5">
          <FiLock className="text-cyan-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-white ml-3 w-full text-sm"
          />
          {showPassword ? (
            <FiEyeOff
              className="text-gray-400 cursor-pointer text-sm"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FiEye
              className="text-gray-400 cursor-pointer text-sm"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 text-sm">
        <label className="flex items-center text-gray-400 space-y-5">
          <input type="checkbox" className="mr-2" />
          Remember Me
        </label>
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-cyan-400 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button 
      onClick={handleLogin}
      className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300 hover:shadow-cyan-500/50 shadow-lg active:scale-95 transition-all">
        Login
      </button>
    </div>
  );
}

export default EmailLogin;