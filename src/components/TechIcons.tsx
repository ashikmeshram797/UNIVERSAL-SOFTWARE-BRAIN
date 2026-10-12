 import { FaRobot, FaDatabase, FaPython, FaFlask, FaReact, FaComments, FaBrain } from "react-icons/fa";
import { SiTensorflow } from "react-icons/si";

interface IconBadgeProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  color: string;
  className: string;
  delay?: string;
}

 function IconBadge({
  id,
  icon,
  label,
  sublabel,
  color,
  className,
  delay,
}: IconBadgeProps) {
  return (
    <div id={id} className={`absolute flex flex-col items-center gap-1 ${className}`}>
      <div
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-[#0a0e1f]/80 backdrop-blur-sm"
        style={{
          borderColor: color,
          boxShadow: `0 0 20px ${color}55`,
        }}
      >
        <div
          className="text-3xl icon-glow"
          style={{
            color,
            animationDelay: delay,
          }}
        >
          {icon}
        </div>
      </div>

      <div className="text-center leading-tight">
        <p className="text-white text-sm font-bold">{label}</p>

        {sublabel && (
          <p className="text-gray-400 text-[10px] max-w-[90px]">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

function TechIcons() {
  return (
    <>
      <IconBadge
        id="icon-ai"
        icon={<FaRobot />}
        label="AI"
        sublabel="Artificial Intelligence"
        color="#38bdf8"
        className="left-[7%] top-[28%]"
        delay="0s"
      />
      <IconBadge
        id="icon-ml"
        icon={<FaBrain />}
        label="ML"
        sublabel="Machine Learning"
        color="#38bdf8"
        className="right-[62%] top-[28%]"
        delay="1s"
      />
      <IconBadge
        id="icon-nlp"
        icon={<FaComments />}
        label="NLP"
        sublabel="Natural Language Processing"
        color="#a78bfa"
        className="left-[10%] top-[42%]"
        delay="1.5s"
      />
      <IconBadge
        id="icon-dl"
        icon={<SiTensorflow />}
        label="DL"
        sublabel="Deep Learning"
        color="#c084fc"
        className="right-[55%] top-[42%]"
        delay="2s"
      />
      <IconBadge
        id="icon-sql"
        icon={<FaDatabase />}
        label="SQL"
        sublabel="Database"
        color="#38bdf8"
        className="left-[5%] top-[55%]"
        delay="2.5s"
      />
      <IconBadge
        id="icon-python"
        icon={<FaPython />}
        label="Python"
        color="#facc15"
        className="right-[60%] top-[60%]"
        delay="3s"
      />
      <IconBadge
        id="icon-flask"
        icon={<FaFlask />}
        label="Flask"
        color="#e2e8f0"
        className="left-[18%] top-[63%]"
        delay="3.5s"
      />
      <IconBadge
        id="icon-react"
        icon={<FaReact />}
        label="React"
        color="#38bdf8"
        className="right-[68%] top-[45%]"
        delay="4s"
      />
    </>
  );
}

export default TechIcons;