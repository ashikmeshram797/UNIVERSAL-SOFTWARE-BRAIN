 import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { BiScan } from "react-icons/bi";

function FaceLogin() {

  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/90 p-5 backdrop-blur-xl">

      <div className="flex items-center gap-4">

        <div className="w-11 h-11 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <BiScan className="text-2xl text-green-400" />
        </div>

        <div>
          <h2 className="text-white text-base font-semibold">
            Login with Face Recognition
          </h2>

          <p className="text-gray-400 text-xs">
            Use your face to securely access your account
          </p>
        </div>

      </div>

      <div className="border-t border-gray-700 my-4"></div>

      <div className="flex flex-col items-center gap-3">

        <div className="relative w-20 h-20">

          <div className="absolute inset-0 border-4 border-green-400 rounded-2xl animate-pulse"></div>

          <div className="absolute inset-4 border-2 border-green-400 rounded-xl"></div>

          <BiScan className="absolute inset-0 m-auto text-4xl text-green-400" />

        </div>

        <button
          onClick={() => navigate("/face-scan")}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold text-sm hover:scale-105 duration-300"
        >
          Click to Start Face Scan
        </button>

        <div className="flex items-center gap-2 text-green-400 text-xs">
          <FaShieldAlt />
          <span>Secure AI Verification</span>
        </div>

      </div>

    </div>
  );
}

export default FaceLogin;