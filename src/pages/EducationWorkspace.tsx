import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  Home,
  Lightbulb,
  Menu,
  MessageCircle,
  Play,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
 
const EducationWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
 
  const modules = [
    {
      title: "Study Assistant",
      subtitle: "Ask, learn, understand.",
      description:
        "Get clear explanations, summaries and step-by-step solutions for any topic.",
      features: [
        "Ask questions",
        "Explain concepts",
        "Summarize topics",
        "Step-by-step solutions",
      ],
      icon: BookOpen,
      button: "Start Learning",
      path: "/ai-workspace/education/study-assistant",
      gradient:
        "from-blue-500/20 via-indigo-500/10 to-slate-900/70",
      border: "border-blue-500/50",
      glow: "shadow-[0_0_35px_rgba(59,130,246,0.15)]",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      buttonStyle:
        "border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300",
    },
 
    {
      title: "Quiz Generator",
      subtitle: "Test your knowledge.",
      description:
        "Create personalized quizzes with MCQs, True/False and short-answer questions.",
      features: [
        "MCQ questions",
        "True/False",
        "Short answers",
        "Difficulty selection",
      ],
      icon: Target,
      button: "Create Quiz",
      path: "/ai-workspace/education/quiz-generator",
      gradient:
        "from-purple-500/20 via-fuchsia-500/10 to-slate-900/70",
      border: "border-purple-500/50",
      glow: "shadow-[0_0_35px_rgba(168,85,247,0.15)]",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400",
      buttonStyle:
        "border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300",
    },
 
    {
      title: "Notes / PDF Analyzer",
      subtitle: "Turn documents into knowledge.",
      description:
        "Upload study material, extract important content and ask questions from PDFs.",
      features: [
        "Upload PDF",
        "Extract content",
        "Ask questions",
        "Generate summary",
      ],
      icon: FileText,
      button: "Analyze PDF",
      path: "/ai-workspace/education/notes-pdf-analyzer",
      gradient:
        "from-emerald-500/20 via-teal-500/10 to-slate-900/70",
      border: "border-emerald-500/50",
      glow: "shadow-[0_0_35px_rgba(16,185,129,0.15)]",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      buttonStyle:
        "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300",
    },
 
    {
      title: "Lesson Planner",
      subtitle: "Plan better. Teach smarter.",
      description:
        "Generate structured lesson plans based on subject, topic and available time.",
      features: [
        "Subject selection",
        "Topic planning",
        "Duration setup",
        "Generate lesson plan",
      ],
      icon: CalendarDays,
      button: "Create Plan",
      path: "/ai-workspace/education/lesson-planner",
      gradient:
        "from-orange-500/20 via-amber-500/10 to-slate-900/70",
      border: "border-orange-500/50",
      glow: "shadow-[0_0_35px_rgba(249,115,22,0.15)]",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
      buttonStyle:
        "border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300",
    },
 
    {
      title: "Exam Preparation",
      subtitle: "Prepare. Practice. Perform.",
      description:
        "Build study plans, identify important topics and prepare with practice questions.",
      features: [
        "Study plan",
        "Important topics",
        "Practice questions",
        "Revision plan",
      ],
      icon: Trophy,
      button: "Start Preparation",
      path: "/ai-workspace/education/exam-preparation",
      gradient:
        "from-pink-500/20 via-rose-500/10 to-slate-900/70",
      border: "border-pink-500/50",
      glow: "shadow-[0_0_35px_rgba(236,72,153,0.15)]",
      iconBg: "bg-pink-500/15",
      iconColor: "text-pink-400",
      buttonStyle:
        "border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300",
    },
 
    {
      title: "Student Progress",
      subtitle: "Track your growth.",
      description:
        "Monitor quiz scores, completed topics and your overall learning progress.",
      features: [
        "Quiz scores",
        "Topics completed",
        "Study activity",
        "Progress tracking",
      ],
      icon: BarChart3,
      button: "View Progress",
      path: "/ai-workspace/education/student-progress",
      gradient:
        "from-cyan-500/20 via-sky-500/10 to-slate-900/70",
      border: "border-cyan-500/50",
      glow: "shadow-[0_0_35px_rgba(6,182,212,0.15)]",
      iconBg: "bg-cyan-500/15",
      iconColor: "text-cyan-400",
      buttonStyle:
        "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300",
    },
  ];
 
  const activities = [
    {
      icon: CheckCircle2,
      title: "Quiz completed",
      subtitle: "Mathematics • Algebra",
      time: "2h ago",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: FileText,
      title: "Notes generated",
      subtitle: "Physics • Motion",
      time: "4h ago",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: MessageCircle,
      title: "Question asked",
      subtitle: "Chemistry • Organic",
      time: "6h ago",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: BarChart3,
      title: "Progress updated",
      subtitle: "Biology • Chapter 5",
      time: "8h ago",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ];
 
  return (
    <div className="min-h-screen w-full bg-[#020617] text-white overflow-x-hidden">
 
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-250px] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>
 
      {/* ================= TOP HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 h-[72px] z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/70">
 
        <div className="h-full flex items-center px-5 gap-5">
 
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-[245px]">
 
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.45)]">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
 
            <div>
              <h1 className="text-sm font-bold">
                Universal Software Brain
              </h1>
 
              <p className="text-[10px] text-slate-500">
                Build • Learn • Create • Grow
              </p>
            </div>
 
          </div>
 
          {/* Search */}
          <div className="flex-1 max-w-[620px]">
 
            <div className="h-11 rounded-xl bg-slate-900/70 border border-slate-700/70 flex items-center px-4 gap-3">
 
              <Search className="w-4 h-4 text-slate-500" />
 
              <input
                type="text"
                placeholder="Search anything in Education..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
              />
 
              <span className="hidden md:block text-[10px] px-2 py-1 rounded-md bg-slate-800 text-slate-500">
                Ctrl K
              </span>
 
            </div>
 
          </div>
 
          {/* Header Right */}
          <div className="ml-auto flex items-center gap-4">
 
            <button className="relative w-9 h-9 rounded-xl hover:bg-slate-800 flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
 
            <div className="hidden sm:flex items-center gap-5">
 
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold">
                A
              </div>
 
              <span className="text-sm font-medium">
                Ashik
              </span>
 
              <ChevronDown className="w-4 h-4 text-slate-500" />
 
            </div>
 
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
 
          </div>
 
        </div>
      </header>
 
 
      {/* ================= BODY (SIDEBAR + MAIN, real flex layout so they always stay in sync) ================= */}
      <div className="flex w-full items-start pt-[72px]">
 
      {/* ================= SIDEBAR ================= */}
       <aside
  style={{ width: sidebarCollapsed ? 78 : 250 }}
  className={`hidden md:flex flex-col shrink-0 sticky top-[72px]
  h-[calc(100vh-72px)]
  bg-[#030b1c]/95 backdrop-blur-xl
  border-r border-slate-800/70 z-30 overflow-hidden
  transition-[width] duration-300 ease-in-out`}
>
 
        <div className={`shrink-0 p-4 ${sidebarCollapsed ? "" : "p-5"}`}>
 
          {/* Sidebar Top Bar */}
          <div className={`flex items-center mb-5 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
 
            {!sidebarCollapsed && (
              <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition"
              onClick={() => navigate("/ai-workspace")}>
                
               ← Back to Agents
              </button>
            )}
 
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
 
          </div>
 
          {/* Workspace Header */}
          <div className={`rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/30 ${sidebarCollapsed ? "p-2" : "p-4"}`}>
 
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
 
              <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/20 border border-indigo-400/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
              </div>
 
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold truncate">
                    Education Agent
                  </h2>
 
                  <p className="text-[10px] text-slate-500 truncate">
                    AI Learning Workspace
                  </p>
                </div>
              )}
 
            </div>
 
          </div>
 
        </div>
 
 
        {/* Sidebar Navigation */}
        <nav
  className="
    flex
    flex-col
    flex-1
    min-h-0
    overflow-y-auto
    px-3
    pb-4
    gap-7
  "
>
 
          {[
            {
              label: "Dashboard",
              icon: Home,
              active: true,
            },
            {
              label: "My Learning",
              icon: BookOpen,
            },
            {
              label: "Schedule",
              icon: CalendarDays,
            },
            {
              label: "Resources",
              icon: FileText,
            },
            {
              label: "Progress",
              icon: BarChart3,
            },
          ].map((item) => {
 
            const Icon = item.icon;
 
            return (
              <button
                key={item.label}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-sm transition-all duration-200 ${
                  sidebarCollapsed
                    ? "justify-center px-2 py-3.5"
                    : "px-4 py-3.5"
                } ${
                  item.active
                    ? "bg-indigo-600/20 border border-indigo-500/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
 
          <div className="my-4 border-t border-slate-800/80" />
 
          <button
            title={sidebarCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 ${
              sidebarCollapsed
                ? "justify-center px-2 py-3.5"
                : "px-4 py-3.5"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
 
        </nav>
 
      </aside>
 
      {/* ================= MAIN CONTENT ================= */}
        <main className="min-h-[calc(100vh-72px)] min-w-0 w-full flex-1 relative z-10">
 
        <div className="w-full min-w-0 p-4 sm:p-5 lg:p-7">
 
 
          {/* ================= HERO ================= */}
          <section className="relative min-w-0 overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-blue-950/50 p-7 lg:p-9 mb-7">
 
            {/* Decorative Glow */}
            <div className="absolute -right-20 -top-32 w-[420px] h-[420px] rounded-full bg-purple-500/20 blur-[100px]" />
 
            <div className="absolute right-[20%] bottom-[-150px] w-[350px] h-[350px] rounded-full bg-blue-500/15 blur-[100px]" />
 
            {/* Desk-scene illustration (right side) */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 hidden lg:block w-[46%] max-w-[430px] overflow-hidden">
              <svg viewBox="0 0 430 320" className="absolute right-4 top-1/2 -translate-y-1/2 w-full h-auto opacity-90" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="lampGlow" cx="50%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3730a3" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
 
                <rect x="270" y="10" width="150" height="200" rx="10" fill="#1e1b4b" fillOpacity="0.4" stroke="#6366f1" strokeOpacity="0.25" />
                <line x1="345" y1="10" x2="345" y2="210" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                <line x1="270" y1="110" x2="420" y2="110" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" />
                <circle cx="380" cy="55" r="18" fill="#fbbf24" fillOpacity="0.5" />
 
                <circle cx="120" cy="95" r="110" fill="url(#lampGlow)" />
 
                <rect x="10" y="235" width="410" height="16" rx="4" fill="url(#deskTop)" />
                <rect x="30" y="251" width="14" height="55" fill="#1e1b4b" fillOpacity="0.7" />
                <rect x="370" y="251" width="14" height="55" fill="#1e1b4b" fillOpacity="0.7" />
 
                <g>
                  <rect x="55" y="150" width="150" height="95" rx="8" fill="#0f172a" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="2" />
                  <rect x="65" y="160" width="130" height="75" rx="4" fill="url(#screenGlow)" fillOpacity="0.85" />
                  <rect x="45" y="245" width="170" height="9" rx="3" fill="#1e293b" />
                </g>
 
                <g>
                  <line x1="120" y1="230" x2="120" y2="150" stroke="#94a3b8" strokeWidth="4" />
                  <line x1="120" y1="150" x2="165" y2="110" stroke="#94a3b8" strokeWidth="4" />
                  <path d="M150 95 L188 100 L172 130 Z" fill="#fbbf24" fillOpacity="0.9" />
                  <circle cx="120" cy="234" r="10" fill="#334155" />
                </g>
 
                <rect x="225" y="205" width="70" height="12" rx="2" fill="#f97316" fillOpacity="0.85" />
                <rect x="230" y="193" width="60" height="12" rx="2" fill="#22d3ee" fillOpacity="0.85" />
                <rect x="222" y="181" width="68" height="12" rx="2" fill="#a855f7" fillOpacity="0.85" />
 
                <g>
                  <rect x="330" y="200" width="34" height="35" rx="4" fill="#334155" />
                  <path d="M347 200 C335 170 325 150 315 130" stroke="#34d399" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M347 200 C350 165 355 145 365 120" stroke="#34d399" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M347 200 C347 160 347 135 347 110" stroke="#10b981" strokeWidth="5" fill="none" strokeLinecap="round" />
                </g>
 
                <rect x="205" y="215" width="24" height="24" rx="4" fill="#f472b6" fillOpacity="0.85" />
                <path d="M229 220 q10 0 10 8 q0 8 -10 8" stroke="#f472b6" strokeWidth="3" fill="none" />
 
                <circle cx="290" cy="45" r="2" fill="#e0e7ff" />
                <circle cx="310" cy="75" r="1.5" fill="#e0e7ff" />
                <circle cx="330" cy="35" r="1.5" fill="#e0e7ff" />
              </svg>
            </div>
 
            <div className="relative max-w-[750px] lg:max-w-[54%]">
 
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs mb-5">
 
                <Sparkles className="w-3.5 h-3.5" />
 
                Education Agent
 
              </div>
 
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Learn Smarter
                <br />
                <span className="italic bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Learn Smarter{" "}
                </span>
                with{" "}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
 
              <p className="mt-4 text-slate-400 max-w-xl leading-relaxed">
                Your all-in-one AI education assistant for better learning,
                exam preparation, personalized study and academic growth.
              </p>
 
 
              <div className="flex flex-wrap gap-3 mt-6">
 
                {[
                  {
                    icon: Sparkles,
                    text: "Personalized Learning",
                  },
                  {
                    icon: Zap,
                    text: "Smart Study Tools",
                  },
                  {
                    icon: BarChart3,
                    text: "Progress Tracking",
                  },
                  {
                    icon: Trophy,
                    text: "Better Results",
                  },
                ].map((item) => {
 
                  const Icon = item.icon;
 
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                      {item.text}
                    </div>
                  );
                })}
 
              </div>
 
            </div>
 
          </section>
 
 
          {/* ================= DASHBOARD GRID ================= */}
          <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_300px] gap-5 lg:gap-6">
 
 
            {/* ================= MODULES ================= */}
            <section className="min-w-0">
 
              <div className="mb-5">
 
                <div className="flex items-center gap-2">
 
                  <Sparkles className="w-5 h-5 text-purple-400" />
 
                  <h2 className="text-xl font-semibold">
                    Choose a Module
                  </h2>
 
                </div>
 
                <p className="text-sm text-slate-500 mt-1">
                  Select a feature to start learning, practice or plan your studies.
                </p>
 
              </div>
 
 
              <div className="grid min-w-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
 
                {modules.map((module) => {
 
                  const Icon = module.icon;
 
                  return (
                    <div
                      key={module.title}
                      className={`group relative min-w-0 overflow-hidden rounded-2xl border ${module.border} bg-gradient-to-br ${module.gradient} ${module.glow} backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]`}
                    >
 
                      {/* Decorative Circle */}
                      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/[0.02] blur-2xl" />
 
                      {/* Watermark icon */}
                      <Icon className={`pointer-events-none absolute -right-4 -bottom-4 w-28 h-28 ${module.iconColor} opacity-[0.08] rotate-[-8deg]`} strokeWidth={1.5} />
 
                      <div className="relative">
 
                        {/* Icon */}
                        <div className="flex items-start justify-between">
 
                          <div
                            className={`w-12 h-12 rounded-2xl ${module.iconBg} border border-white/10 flex items-center justify-center`}
                          >
                            <Icon className={`w-6 h-6 ${module.iconColor}`} />
                          </div>
 
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition">
 
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
 
                          </div>
 
                        </div>
 
 
                        {/* Text */}
                        <div className="mt-5">
                          <h3 className="text-lg font-semibold">
                            {module.title}
                          </h3>
 
                          <p className={`text-xs mt-1 ${module.iconColor}`}>
                            {module.subtitle}
                          </p>
 
                          <p className="text-xs text-slate-500 leading-relaxed mt-3 min-h-[48px]">
                            {module.description}
                          </p>
 
                        </div>
 
 
                        {/* Features */}
                        <ul className="mt-4 space-y-2">
 
                          {module.features.map((feature) => (
 
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-xs text-slate-400"
                            >
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${module.iconColor}`}
                              />
 
                              {feature}
 
                            </li>
 
                          ))}
 
                        </ul>
 
 
                        {/* Button */}
                        <button
  onClick={() => navigate(module.path)}
  className={`w-full mt-5 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${module.buttonStyle}`}
>
  {module.button}

  <ArrowRight className="w-3.5 h-3.5" />
</button>
 
                      </div>
 
                    </div>
                  );
                })}
 
              </div>
 
            </section>
 
 
            {/* ================= RIGHT PANEL ================= */}
            <aside className="min-w-0 space-y-5">
 
 
              {/* Quick Stats */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-5">
 
                <div className="flex items-center gap-2 mb-5">
 
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
 
                  <h3 className="font-semibold text-sm">
                    Quick Stats
                  </h3>
 
                </div>
 
 
                <div className="grid grid-cols-2 gap-3">
 
                  {[
                    {
                      label: "Topics",
                      value: "48",
                      icon: BookOpen,
                      color: "text-blue-400",
                    },
                    {
                      label: "Quizzes",
                      value: "12",
                      icon: Target,
                      color: "text-purple-400",
                    },
                    {
                      label: "Notes",
                      value: "6",
                      icon: FileText,
                      color: "text-emerald-400",
                    },
                    {
                      label: "Study Streak",
                      value: "3 days",
                      icon: Zap,
                      color: "text-orange-400",
                    },
                  ].map((stat) => {
 
                    const Icon = stat.icon;
 
                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-slate-950/60 border border-slate-800 p-3"
                      >
 
                        <Icon className={`w-5 h-5 ${stat.color}`} />
 
                        <p className="text-[10px] text-slate-500 mt-3">
                          {stat.label}
                        </p>
 
                        <p className="text-lg font-semibold mt-1">
                          {stat.value}
                        </p>
 
                      </div>
                    );
                  })}
 
                </div>
 
              </div>
 
 
              {/* Recent Activity */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-5">
 
                <div className="flex items-center justify-between mb-5">
 
                  <h3 className="text-sm font-semibold">
                    Recent Activity
                  </h3>
 
                  <button className="text-[10px] text-indigo-400 hover:text-indigo-300">
                    View All →
                  </button>
 
                </div>
 
 
                <div className="space-y-4">
 
                  {activities.map((activity) => {
 
                    const Icon = activity.icon;
 
                    return (
                      <div
                        key={activity.title}
                        className="flex items-center gap-3"
                      >
 
                        <div
                          className={`w-9 h-9 rounded-xl ${activity.bg} flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
 
                        <div className="flex-1 min-w-0">
 
                          <p className="text-xs font-medium">
                            {activity.title}
                          </p>
 
                          <p className="text-[10px] text-slate-500 truncate">
                            {activity.subtitle}
                          </p>
 
                        </div>
 
                        <span className="text-[9px] text-slate-600">
                          {activity.time}
                        </span>
 
                      </div>
                    );
                  })}
 
                </div>
 
              </div>
 
 
              {/* Learning Card */}
              <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-blue-900/20 p-5">
 
                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />
 
                <div className="relative">
 
                  <Sparkles className="w-7 h-7 text-yellow-400 mb-4" />
 
                  <h3 className="font-semibold">
                    Keep Learning
                  </h3>
 
                  <p className="text-sm text-purple-300 mt-1">
                    Keep Growing
                  </p>
 
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    Every concept you learn today makes the next one easier.
                  </p>
 
                  <button className="mt-5 text-xs text-indigo-300 flex items-center gap-2 hover:text-white">
                    Continue Learning
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
 
                </div>
 
              </div>
 
            </aside>
 
          </div>
 
 
          {/* ================= PRO TIP ================= */}
          <div className="mt-7 rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 via-slate-900/70 to-indigo-500/5 p-6 flex items-center gap-5">
 
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
 
              <Lightbulb className="w-5 h-5 text-yellow-400" />
 
            </div>
 
            <div>
 
              <h3 className="text-sm font-semibold text-yellow-300">
                Pro Tip
              </h3>
 
              <p className="text-xs text-slate-500 mt-1">
                Use Study Assistant to understand a topic, then create a quiz
                to test your knowledge.
              </p>
 
            </div>
 
            <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-600">
              <Play className="w-3.5 h-3.5" />
              Learn • Practice • Improve
            </div>
 
          </div>
 
        </div>
 
      </main>
 
      </div>
 
 
      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#020617] pt-[72px]">
 
          <nav className="p-5 space-y-2">
 
            {[
              "Dashboard",
              "My Learning",
              "Schedule",
              "Resources",
              "Progress",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setMobileMenu(false)}
                className="w-full text-left px-4 py-4 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-300"
              >
                {item}
              </button>
            ))}
 
          </nav>
 
        </div>
      )}
 
 
 
    </div>
  );
};
 
export default EducationWorkspace;
 