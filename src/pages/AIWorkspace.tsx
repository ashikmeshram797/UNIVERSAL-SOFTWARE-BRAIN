 import React, { useState } from 'react';
 import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Code2, 
  HeartPulse, 
  IndianRupee, 
  GraduationCap, 
  PenTool, 
  BarChart3, 
  Smartphone, 
  Cloud, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight, 
  Info 
} from 'lucide-react';

interface AgentCard {
  id: string;
  title: string;
  badge?: {
    text: string;
    color: string;
  };
  description: string;
  features: string[];
  icon: React.ElementType;
  theme: {
    border: string;
    iconBg: string;
    iconColor: string;
    iconGlow: string;
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
  };
}

const agentsData: AgentCard[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    badge: { text: 'Popular', color: 'bg-purple-900/60 text-purple-300 border-purple-700/50' },
    description: 'Generate, build and deploy web applications.',
    features: ['Full Stack Projects', 'APIs & Backend', 'Databases', 'UI/UX Components'],
    icon: Code2,
    theme: {
      border: 'hover:border-purple-500/50 border-purple-900/30',
      iconBg: 'bg-purple-950/80 border-purple-500/40',
      iconColor: 'text-purple-400',
      iconGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
      badgeBg: 'bg-purple-900/60',
      badgeText: 'text-purple-300',
      buttonBg: 'bg-purple-900/60 text-purple-200 border-purple-700/50',
      buttonHover: 'hover:bg-purple-800/80',
    },
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    badge: { text: 'New', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' },
    description: 'AI Healthcare Assistant for analysis and guidance.',
    features: [
      'Symptom Checker',
      'Image Analysis',
      'Report Analysis',
      'Find Hospitals & Doctors',
      'Appointment Booking',
    ],
    icon: HeartPulse,
    theme: {
      border: 'hover:border-emerald-500/50 border-emerald-900/30',
      iconBg: 'bg-emerald-950/80 border-emerald-500/40',
      iconColor: 'text-emerald-400',
      iconGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      badgeBg: 'bg-emerald-900/60',
      badgeText: 'text-emerald-300',
      buttonBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50',
      buttonHover: 'hover:bg-emerald-800/80',
    },
  },
   
  {
    id: 'education',
    title: 'Education',
    badge: { text: 'Beta', color: 'bg-blue-900/60 text-blue-300 border-blue-700/50' },
    description: 'AI Assistant for students, teachers and institutions.',
    features: ['Study Assistant', 'Lesson Planner', 'Quiz Generator', 'School ERP'],
    icon: GraduationCap,
    theme: {
      border: 'hover:border-blue-500/50 border-blue-900/30',
      iconBg: 'bg-blue-950/80 border-blue-500/40',
      iconColor: 'text-blue-400',
      iconGlow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
      badgeBg: 'bg-blue-900/60',
      badgeText: 'text-blue-300',
      buttonBg: 'bg-blue-900/60 text-blue-200 border-blue-700/50',
      buttonHover: 'hover:bg-blue-800/80',
    },
  },
  {
    id: 'finance',
    title: 'Finance',
    badge: { text: 'Beta', color: 'bg-amber-900/60 text-amber-300 border-amber-700/50' },
    description: 'Manage finance, accounting and business tasks.',
    features: [
      'GST & Tax Assistant',
      'Invoice Generator',
      'Payroll Management',
      'Financial Reports',
    ],
    icon: IndianRupee,
    theme: {
      border: 'hover:border-amber-500/50 border-amber-900/30',
      iconBg: 'bg-amber-950/80 border-amber-500/40',
      iconColor: 'text-amber-400',
      iconGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]',
      badgeBg: 'bg-amber-900/60',
      badgeText: 'text-amber-300',
      buttonBg: 'bg-amber-900/60 text-amber-200 border-amber-700/50',
      buttonHover: 'hover:bg-amber-800/80',
    },
  },
  {
    id: 'content-writer',
    title: 'Content Writer',
    badge: { text: 'New', color: 'bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/50' },
    description: 'Create high-quality content in seconds.',
    features: ['Blog Posts', 'Articles', 'Social Media Posts', 'SEO Content'],
    icon: PenTool,
    theme: {
      border: 'hover:border-fuchsia-500/50 border-fuchsia-900/30',
      iconBg: 'bg-fuchsia-950/80 border-fuchsia-500/40',
      iconColor: 'text-fuchsia-400',
      iconGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.4)]',
      badgeBg: 'bg-fuchsia-900/60',
      badgeText: 'text-fuchsia-300',
      buttonBg: 'bg-fuchsia-900/60 text-fuchsia-200 border-fuchsia-700/50',
      buttonHover: 'hover:bg-fuchsia-800/80',
    },
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    badge: { text: 'Beta', color: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50' },
    description: 'Analyze data and generate insights.',
    features: ['Data Analysis', 'Charts & Graphs', 'Excel Assistant', 'Insights & Reports'],
    icon: BarChart3,
    theme: {
      border: 'hover:border-cyan-500/50 border-cyan-900/30',
      iconBg: 'bg-cyan-950/80 border-cyan-500/40',
      iconColor: 'text-cyan-400',
      iconGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
      badgeBg: 'bg-cyan-900/60',
      badgeText: 'text-cyan-300',
      buttonBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-700/50',
      buttonHover: 'hover:bg-cyan-800/80',
    },
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    badge: { text: 'New', color: 'bg-pink-900/60 text-pink-300 border-pink-700/50' },
    description: 'Build mobile apps for Android and iOS.',
    features: [
      'Flutter Development',
      'React Native',
      'App Components',
      'APIs Integration',
    ],
    icon: Smartphone,
    theme: {
      border: 'hover:border-pink-500/50 border-pink-900/30',
      iconBg: 'bg-pink-950/80 border-pink-500/40',
      iconColor: 'text-pink-400',
      iconGlow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]',
      badgeBg: 'bg-pink-900/60',
      badgeText: 'text-pink-300',
      buttonBg: 'bg-pink-900/60 text-pink-200 border-pink-700/50',
      buttonHover: 'hover:bg-pink-800/80',
    },
  },
  {
    id: 'devops',
    title: 'DevOps',
    badge: { text: 'Beta', color: 'bg-teal-900/60 text-teal-300 border-teal-700/50' },
    description: 'Automate deployment and infrastructure.',
    features: [
      'CI/CD Pipelines',
      'Docker & Kubernetes',
      'Cloud Deployment',
      'Monitoring',
    ],
    icon: Cloud,
    theme: {
      border: 'hover:border-teal-500/50 border-teal-900/30',
      iconBg: 'bg-teal-950/80 border-teal-500/40',
      iconColor: 'text-teal-400',
      iconGlow: 'shadow-[0_0_25px_rgba(20,184,166,0.4)]',
      badgeBg: 'bg-teal-900/60',
      badgeText: 'text-teal-300',
      buttonBg: 'bg-teal-900/60 text-teal-200 border-teal-700/50',
      buttonHover: 'hover:bg-teal-800/80',
    },
  },
];

export const AIWorkspace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredAgents = agentsData.filter(
    (agent) =>
      agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Choose an AI Agent to start working</p>
          </div>

          {/* Top Info Banner */}
          <div className="flex items-center gap-3 bg-[#0d1322] border border-slate-800 px-4 py-2.5 rounded-lg text-xs text-slate-300 max-w-sm">
            <div className="p-1.5 rounded-full bg-slate-800/80 text-slate-400">
              <Info className="w-4 h-4" />
            </div>
            <span>Each agent is specialized in a domain. Select the right agent for your task.</span>
          </div>
        </div>

        {/* Search Bar - mb-10 ने Cards Grid आणि Search bar मध्ये अंतर येईल */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1322] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 transition"
          />
        </div>

        {/* Agents Grid - mb-16 ने Cards Grid आणि Footer मध्ये अंतर येईल */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {filteredAgents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <div
                key={agent.id}
                className={`bg-[#0d1322] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${agent.theme.border}`}
              >
                <div>
                  {/* Glowing Icon Header */}
                  <div className="flex justify-center my-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border ${agent.theme.iconBg} ${agent.theme.iconColor} ${agent.theme.iconGlow}`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <h2 className="text-lg font-semibold text-white">{agent.title}</h2>
                    {agent.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${agent.badge.color}`}
                      >
                        {agent.badge.text}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 text-center mt-2 min-h-[32px] leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-2 text-xs text-slate-300">
                    {agent.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Open Workspace Button */}
                <div className="mt-6">
                   <button
  onClick={() => {

    switch (agent.id) {

      case "web-dev":
        navigate("/ai-workspace/web");
        break;

      case "healthcare":
        navigate("/ai-workspace/healthcare");
        break;

      case "finance":
        navigate("/ai-workspace/finance");
        break;

      case "education":
        navigate("/ai-workspace/education");
        break;

      case "mobile-app":
        navigate("/ai-workspace/mobile");
        break;
      case "content-writer":
        navigate("/ai-workspace/content-writer");
        break;

      default:
        alert("Coming Soon");
    }

  }}
  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition duration-200 ${agent.theme.buttonBg} ${agent.theme.buttonHover}`}
>
  <span>Open Workspace</span>
  <ArrowRight className="w-3.5 h-3.5" />
</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Request Banner */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Can't find the right agent?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Request a new agent or suggest a feature for the next update.
              </p>
            </div>
          </div>

          <button className="whitespace-nowrap bg-[#12192d] hover:bg-[#1a233d] border border-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition">
            <span>Request New Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIWorkspace;