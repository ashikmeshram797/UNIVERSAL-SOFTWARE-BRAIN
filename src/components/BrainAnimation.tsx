 import brain from "../assets/brain.png";
 import OrbitIcons from "../components/OrbitIcons";
 import { Shield, Zap, Rocket } from "lucide-react";

function BrainAnimation() {
  return (
    <div className="relative flex items-center justify-center h-[550px] w-full">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-400/20 blur-[90px] animate-pulse"></div>

      {/* Brain */}
      <img
        src={brain}
        alt="Brain"
        className="relative z-20  w-90 -translate-y-30 drop-shadow-[0_0_66px_#22d3ee]"
      />
      <OrbitIcons />

      {/* Laser */}
      <div className="absolute top-[120px] z-10">
        <div className="w-[8px] h-[120px] rounded-full bg-cyan-300 shadow-[0_0_40px_#22d3ee] animate-pulse"></div>
      </div>

      {/* 3D Platform */}
      <div className="absolute top-[125px] flex items-center justify-center">

        {/* Base Glow */}
        <div className="absolute w-40 h-10 rounded-full bg-cyan-400/30 blur-xl"></div>
        

         

        {/* Center Core */}
        <div className="absolute w-10 h-10 rounded-full bg-cyan-300 blur-md animate-pulse"></div>
<div className="absolute bottom-[-290px] left-1/2 -translate-x-1/2 flex gap-4">

  {/* Secure */}
  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full
      bg-white/5 backdrop-blur-xl
      border border-cyan-400/30
      shadow-[0_0_25px_rgba(34,211,238,0.35)]">

    <div className="w-8 h-8 rounded-full bg-cyan-400/15 flex items-center justify-center">
      <Shield className="w-4 h-4 text-cyan-300" />
    </div>

    <span className="text-cyan-100 font-medium text-sm">
      Secure
    </span>
  </div>

  {/* Smart */}
  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full
      bg-white/5 backdrop-blur-xl
      border border-yellow-400/30
      shadow-[0_0_25px_rgba(250,204,21,0.35)]">

    <div className="w-8 h-8 rounded-full bg-yellow-400/15 flex items-center justify-center">
      <Zap className="w-4 h-4 text-yellow-300" />
    </div>

    <span className="text-yellow-100 font-medium text-sm">
      Smart
    </span>
  </div>

  {/* Productive */}
  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full
      bg-white/5 backdrop-blur-xl
      border border-blue-400/30
      shadow-[0_0_25px_rgba(96,165,250,0.35)]">

    <div className="w-8 h-8 rounded-full bg-blue-400/15 flex items-center justify-center">
      <Rocket className="w-4 h-4 text-blue-300" />
    </div>

    <span className="text-blue-100 font-medium text-sm">
      Productive
    </span>
  </div>

</div>
      </div>

    </div>
  );
}

export default BrainAnimation;