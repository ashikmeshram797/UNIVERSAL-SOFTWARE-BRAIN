import React, { useState } from "react";
import { Mic, X, Volume2 } from "lucide-react";
import altronVideo from "../assets/altron.mp4";

export default function AltronAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [message, setMessage] = useState(
    "Hello! I'm ALTRON. How can I help you?"
  );

  const [userText, setUserText] = useState("");

  // =========================
  // SEND COMMAND TO ALTRON
  // =========================

  const sendToAltron = async (text: string) => {
    try {
      setUserText(text);
      setMessage("ALTRON is thinking...");

      const response = await fetch(
        "http://127.0.0.1:5000/api/altron/command",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data = await response.json();

      console.log("ALTRON RESPONSE:", data);

      if (data.status === "error") {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      const reply = data.message || "Command completed.";

      setMessage(reply);

      // =========================
      // ALTRON TEXT TO SPEECH
      // =========================

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(reply);

        speech.lang = "en-IN";
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error("ALTRON ERROR:", error);

      setMessage("Unable to connect to ALTRON backend.");
    }
  };

  // =========================
  // START VOICE RECOGNITION
  // =========================

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setMessage("Listening...");

    recognition.start();

    // =========================
    // SPEECH RESULT
    // =========================

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      console.log("YOU SAID:", transcript);

      setIsListening(false);

      await sendToAltron(transcript);
    };

    // =========================
    // SPEECH ERROR
    // =========================

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);

      setIsListening(false);

      setMessage("I couldn't hear you. Try again.");
    };

    // =========================
    // SPEECH END
    // =========================

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <>
      {/* ================================================= */}
      {/* FLOATING ALTRON BUTTON */}
      {/* ================================================= */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-[9999]
            w-24
            h-24
            rounded-full
            overflow-hidden
            flex
            items-center
            justify-center
            bg-transparent
            hover:scale-110
            transition-all
            duration-300
            drop-shadow-[0_0_25px_rgba(56,189,248,0.7)]
          "
          title="Open ALTRON"
        >
          <video
            src={altronVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </button>
      )}

      {/* ================================================= */}
      {/* ALTRON PANEL */}
      {/* ================================================= */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-[9999]
            w-[360px]
            max-w-[calc(100vw-32px)]
            rounded-3xl
            border
            border-cyan-400/40
            bg-[#050b16]/95
            backdrop-blur-2xl
            shadow-[0_0_45px_rgba(34,211,238,0.35)]
            overflow-hidden
          "
        >

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-cyan-400/20
            "
          >
            <div>
              <p className="text-sm font-bold tracking-widest text-cyan-300">
                ALTRON
              </p>

              <p className="text-[10px] text-slate-500">
                Universal Software Brain
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="
                h-8
                w-8
                rounded-full
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-white
                hover:bg-white/10
                transition
              "
            >
              <X size={17} />
            </button>
          </div>

          {/* ================================================= */}
          {/* ALTRON VIDEO */}
          {/* ================================================= */}

          <div className="relative flex items-center justify-center h-[230px]">

            <video
              src={altronVideo}
              autoPlay
              loop
              muted
              playsInline
              className={`
                w-full
                h-full
                object-contain
                transition-all
                duration-500
                ${
                  isListening
                    ? "scale-110 drop-shadow-[0_0_35px_rgba(56,189,248,0.9)]"
                    : "drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                }
              `}
            />

            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <div className="absolute bottom-3 left-0 right-0 text-center">

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1
                  rounded-full
                  text-[10px]
                  ${
                    isListening
                      ? "bg-red-500/20 text-red-300"
                      : "bg-emerald-500/10 text-emerald-300"
                  }
                `}
              >

                <span
                  className={`
                    w-1.5
                    h-1.5
                    rounded-full
                    ${
                      isListening
                        ? "bg-red-400 animate-pulse"
                        : "bg-emerald-400 animate-pulse"
                    }
                  `}
                />

                {isListening ? "LISTENING" : "ONLINE"}

              </span>

            </div>
          </div>

          {/* ================================================= */}
          {/* CONVERSATION */}
          {/* ================================================= */}

          <div className="px-5 pb-4">

            {/* USER MESSAGE */}

            {userText && (
              <div className="mb-3">

                <p className="text-[10px] text-slate-500 mb-1">
                  YOU
                </p>

                <p className="text-sm text-slate-200">
                  {userText}
                </p>

              </div>
            )}

            {/* ALTRON MESSAGE */}

            <div>

              <p className="text-[10px] text-cyan-400 mb-1">
                ALTRON
              </p>

              <p className="text-sm text-white leading-relaxed">
                {message}
              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* MICROPHONE */}
          {/* ================================================= */}

          <div
            className="
              px-5
              py-4
              border-t
              border-cyan-400/20
              flex
              items-center
              justify-center
              gap-4
            "
          >

            <button
              onClick={startListening}
              className={`
                h-14
                w-14
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ${
                  isListening
                    ? "bg-red-500 scale-110 shadow-[0_0_35px_rgba(239,68,68,0.7)]"
                    : "bg-gradient-to-br from-sky-500 to-violet-600 shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:scale-110"
                }
              `}
            >
              <Mic size={22} />
            </button>

            <div className="text-left">

              <p className="text-xs text-slate-300">
                {isListening
                  ? "Listening..."
                  : "Talk to ALTRON"}
              </p>

              <p className="text-[10px] text-slate-500">
                Click the mic and speak
              </p>

            </div>

            <Volume2
              size={17}
              className="text-cyan-400"
            />

          </div>

        </div>
      )}
    </>
  );
}