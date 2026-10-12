import { BrainCircuit } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-4">

      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(34,211,238,0.5)]">

        <BrainCircuit size={45} color="white"/>

      </div>

      <div>

        <h1 className="text-4xl font-bold text-white">
          Universal
        </h1>

        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Software Brain
        </h2>

      </div>

    </div>
  )
}

export default Logo;