 import EmailLogin from "../components/EmailLogin";
import FaceLogin from "../components/FaceLogin";
import BrainAnimation from "../components/BrainAnimation";
import NetworkBackground from "../components/NetworkBackground";
import TechIcons from "../components/TechIcons";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#090B1A] via-[#111827] to-[#1E1B4B] flex items-center justify-center p-8">
      {/* Network background - left side */}
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <NetworkBackground color="34,211,238" density={50} />
      </div>

      {/* Network background - right side */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <NetworkBackground color="168,85,247" density={50} />
      </div>
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]"></div>

      <div className="w-full max-w-[1400px] grid grid-cols-[1fr_1fr] gap-12 items-center">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl">🧠</div>
          <h1 className="mt-4 text-3xl font-extrabold text-white tracking-wide text-center">
            UNIVERSAL
          </h1>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-center">
            SOFTWARE BRAIN
          </h2>
          <p className="mt-5 text-center text-gray-400 text-lg leading-8 max-w-md">
            Your AI Powered Workspace for
            Productivity, Automation & Intelligence
          </p>
          <div className="mt-10">
            <BrainAnimation />
            <TechIcons />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-start relative">
          <div className="absolute w-[500px] h-[700px] rounded-full bg-cyan-500/10 blur-[120px]"></div>

          <div className="w-full max-w-[550px] min-h-[650px] mt-6 rounded-[24px] border-2 border-cyan-400/50 bg-[#101826]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.25)] px-8 py-8 relative z-10">
            <h1 className="text-white text-3xl font-bold text-center mb-8">
              Welcome Back 👋
            </h1>

            <div className="mt-8 flex justify-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs">
                AI Powered
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                Secure Login
              </span>
            </div>

            <p className="text-gray-400 mt-3 mb-6 text-center text-base">
              Login to continue your workspace
            </p>

            <EmailLogin />

            <div className="flex items-center my-5">
              <div className="flex-1 h-[1px] bg-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-[1px] bg-gray-700"></div>
            </div>

            <FaceLogin />

            <div className="text-center mt-5 space-y-10">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-cyan-400 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-10 space-y-5 flex items-center justify-center gap-2">
                🔒 Your data is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;