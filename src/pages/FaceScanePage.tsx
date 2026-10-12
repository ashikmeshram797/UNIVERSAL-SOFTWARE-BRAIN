import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function FaceScanPage() {

  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Open Camera Automatically
  useEffect(() => {

    let stream: MediaStream | null = null;

    const startCamera = async () => {

      try {

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (error) {

        console.error(error);

        setMessage(
          "Camera permission denied. Please allow camera access."
        );

      }

    };

    startCamera();

    // Stop Camera when leaving page
    return () => {

      if (stream) {

        stream.getTracks().forEach((track) => {
          track.stop();
        });

      }

    };

  }, []);


  // Face Login
  const handleFaceLogin = async () => {

    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas not supported");
      }

      // Capture Image
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert Image to Base64
      const imageData = canvas.toDataURL("image/jpeg");


      // Send to Backend
      const response = await fetch(
        "http://127.0.0.1:5000/face-login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image: imageData,
          }),
        }
      );


      const data = await response.json();

      console.log(
        "Face Login Response:",
        data
      );


      if (data.success) {

        // Save Token
        localStorage.setItem(
          "token",
          data.token
        );

        // Save User
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Go Dashboard
        navigate("/dashboard");

      } else {

        setMessage(
          data.message ||
          "Face not recognized"
        );

      }

    } catch (error) {

      console.error(
        "Face Login Error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#090B1A] via-[#111827] to-[#1E1B4B]">

      <div className="w-[500px] rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.18)]">

        <h1 className="text-2xl font-bold text-white text-center">
          Face Recognition Login
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Position your face inside the frame
        </p>


        {/* Camera */}

        <div className="relative w-full h-80 overflow-hidden rounded-2xl border-2 border-green-400">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Face Frame */}

          <div className="absolute inset-10 border-2 border-green-400 rounded-3xl animate-pulse pointer-events-none"></div>

        </div>


        {/* Scan Button */}

        <button
          onClick={handleFaceLogin}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:scale-105 duration-300 disabled:opacity-50"
        >

          {loading
            ? "Verifying Face..."
            : "Scan & Login"}

        </button>


        {/* Back */}

        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="w-full mt-3 py-2 text-gray-400 hover:text-white"
        >
          Back to Login
        </button>


        {/* Message */}

        {message && (

          <p className="text-center text-yellow-400 text-sm mt-4">
            {message}
          </p>

        )}


        {/* Hidden Canvas */}

        <canvas
          ref={canvasRef}
          className="hidden"
        />

      </div>

    </div>

  );

}

export default FaceScanPage;