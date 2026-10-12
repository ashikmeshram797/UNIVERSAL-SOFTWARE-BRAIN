 import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FaceRegistration() {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const [cameraOn, setCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
const [scanComplete, setScanComplete] = useState(false);
const [email,setEmail] = useState("");
const [registering,setRegistering] = useState(false);


const registerFace = async () => {
  if (!webcamRef.current) {
    alert("Camera is not available");
    return;
  }

  if (!email) {
    alert("User email not found");
    return;
  }

  const imageSrc = webcamRef.current.getScreenshot();

  if (!imageSrc) {
    alert("Could not capture image");
    return;
  }

  setRegistering(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/register-face",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          image: imageSrc,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setFaceDetected(true);
      setScanComplete(true);

      alert("Face Registered Successfully");

      // Optional: Remove signup email after successful registration
      localStorage.removeItem("signup_email");

      navigate("/");
    } else {
      alert(data.message || "Face Registration Failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  } finally {
    setRegistering(false);
  }
};

useEffect(() => {
  const savedEmail = localStorage.getItem("signup_email");

  if (savedEmail) {
    setEmail(savedEmail);
  }
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#090B1A] via-[#111827] to-[#1E1B4B] p-8">

      <div className="w-[700px] rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl px-12 py-10 shadow-[0_0_60px_rgba(34,211,238,0.18)]">

        <h1 className="text-4xl font-bold text-white text-center">
          Face Registration
        </h1>

        <p className="text-center text-gray-400 mt-4 mb-10">
          Register your face to enable Secure AI Login.
        </p>

        {/* Camera Box */}
        
        <div className="flex justify-center mt-8">
         <div className=" relative w-[500px] h-[260px] mx-auto rounded-3xl border-2 border-dashed border-cyan-400/40 overflow-hidden flex items-center justify-center bg-[#111827]">

          {cameraOn ? (

            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              screenshotFormat="image/jpeg"
              className="w-[300px] h-[260px] rounded-2xl object-cover"
            />

          ) : (

            <div className="text-center">

              <div className="text-7xl mb-4">📷</div>

              <p className="text-gray-400 mb-4">
                Camera is Off
              </p>
             
            </div>

          )}
          {cameraOn && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
     <div className="w-[120px] h-[160px] border-4 border-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>
  </div>
)}

        </div>
        </div>
        <div className="mt-6 text-center">
  {!faceDetected && (
    <p className="text-yellow-400">
      Align your face inside the frame
    </p>
  )}

  {faceDetected && !scanComplete && (
    <p className="text-cyan-400">
      Scanning Face...
    </p>
  )}

  {scanComplete && (
    <p className="text-green-400 font-bold">
      ✅ Face Registered Successfully
    </p>
  )}
</div>

        {/* Instructions */}

        <div className="mt-8 space-y-3">

          <p className="text-green-400">
            ✓ Look straight at the camera
          </p>

          <p className="text-green-400">
            ✓ Keep your face inside the frame
          </p>

          <p className="text-green-400">
            ✓ Ensure good lighting
          </p>

          <p className="text-green-400">
            ✓ Remove sunglasses or mask
          </p>

        </div>

        {/* Buttons */}

         {!cameraOn && (
  <button
     onClick={() => {
  setCameraOn(true);

}}
    className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300"
  >
    Start Camera
  </button>
)}
{cameraOn && !scanComplete && (
  <button
    onClick={registerFace}
    disabled={registering}
    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:scale-105 duration-300 disabled:opacity-50"
  >
    {registering
      ? "Registering Face..."
      : "Capture & Register Face"}
  </button>
)}

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-cyan-400 hover:underline"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default FaceRegistration;