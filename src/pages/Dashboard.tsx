import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import voiceNetwork from "../assets/voice_network_rotate.gif";
import {
  Home,
  Terminal,
  Bot,
  ListChecks,
  LayoutGrid,
  BarChart3,
  FileText,
  BookOpen,
  ShieldCheck,
  Share2,
  Mic,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Paperclip,
  Rocket,
  Code2,
  ScanLine,
  Globe,
  Brush,
  ChevronRight,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface Agent {
  icon: React.ReactNode;
  name: string;
  task: string;
  status: "Working" | "Waiting" | "Queued" | "Idle";
  progress: number;
}

interface Task {
  icon: React.ReactNode;
  title: string;
  status: "In Progress" | "Completed";
  progress: number;
  time: string;
}

interface ActivityItem {
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
}

// ----------------------------------------------------------------------------
// Static data (swap with real API data later)
// ----------------------------------------------------------------------------

 const navItems = [
  { icon: <Home size={18} />, label: "Dashboard", path: "/dashboard" },
  { icon: <Terminal size={18} />, label: "Command Center", path: "/command-center" },
  { icon: <Bot size={18} />, label: "AI Agents", path: "/ai-agents" },
  { icon: <ListChecks size={18} />, label: "Active Tasks", path: "/active-tasks" },
  { icon: <LayoutGrid size={18} />, label: "AI Workspace", path: "/ai-workspace" },
  { icon: <BarChart3 size={18} />, label: "Analytics", path: "/analytics" },
  { icon: <FileText size={18} />, label: "Documents", path: "/documents" },
  { icon: <BookOpen size={18} />, label: "Knowledge Base", path: "/knowledge-base" },
  { icon: <ShieldCheck size={18} />, label: "Security Center", path: "/security-center" },
  { icon: <Share2 size={18} />, label: "Integrations", path: "/integrations" },
  { icon: <Mic size={18} />, label: "Voice Assistant", path: "/voice-assistant" },
  { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
];

const quickActions = [
  { icon: <Code2 size={22} />, label: "Code Generator", sub: "Generate code instantly", color: "text-violet-400" },
  { icon: <BarChart3 size={22} />, label: "Data Analyzer", sub: "Analyze data & files", color: "text-emerald-400" },
  { icon: <FileText size={22} />, label: "Document Summarizer", sub: "Summarize any document", color: "text-sky-400" },
  { icon: <ScanLine size={22} />, label: "Security Scanner", sub: "Scan for vulnerabilities", color: "text-green-400" },
  { icon: <Globe size={22} />, label: "Web Research", sub: "Research any topic", color: "text-blue-400" },
  { icon: <Brush size={22} />, label: "AI Designer", sub: "Create images & designs", color: "text-pink-400" },
];

const agents: Agent[] = [
  { icon: <Code2 size={16} />, name: "Frontend Developer Agent", task: "Building UI components", status: "Working", progress: 75 },
  { icon: <LayoutGrid size={16} />, name: "Backend Developer Agent", task: "Building REST APIs", status: "Working", progress: 62 },
  { icon: <BookOpen size={16} />, name: "Database Manager Agent", task: "Optimizing database", status: "Waiting", progress: 30 },
  { icon: <ShieldCheck size={16} />, name: "Security Analyst Agent", task: "Scanning for threats", status: "Working", progress: 85 },
  { icon: <ListChecks size={16} />, name: "Testing & QA Agent", task: "Running test cases", status: "Queued", progress: 0 },
  { icon: <Rocket size={16} />, name: "Deployment Agent", task: "Preparing deployment", status: "Idle", progress: 0 },
];

const tasks: Task[] = [
  { icon: <LayoutGrid size={16} />, title: "E-commerce Website Development", status: "In Progress", progress: 75, time: "10:32 AM" },
  { icon: <BarChart3 size={16} />, title: "Sales Data Analysis", status: "Completed", progress: 100, time: "09:47 AM" },
  { icon: <ShieldCheck size={16} />, title: "Security Vulnerability Scan", status: "Completed", progress: 100, time: "09:15 AM" },
  { icon: <FileText size={16} />, title: "AI Research Paper Summary", status: "In Progress", progress: 45, time: "10:28 AM" },
  { icon: <Bot size={16} />, title: "User Authentication System", status: "In Progress", progress: 60, time: "10:20 AM" },
  { icon: <BookOpen size={16} />, title: "Database Backup & Optimization", status: "Completed", progress: 100, time: "08:55 AM" },
];

const activity: ActivityItem[] = [
  { icon: <Code2 size={16} />, title: "Frontend Agent", detail: "Created component: Navbar.jsx", time: "10:32 AM" },
  { icon: <LayoutGrid size={16} />, title: "Backend Agent", detail: "API /api/auth created successfully", time: "10:31 AM" },
  { icon: <BookOpen size={16} />, title: "Database Agent", detail: "Users table optimized", time: "10:29 AM" },
  { icon: <ShieldCheck size={16} />, title: "Security Agent", detail: "No vulnerabilities found", time: "10:28 AM" },
  { icon: <Globe size={16} />, title: "Research Agent", detail: "AI trends data collected", time: "10:27 AM" },
  { icon: <FileText size={16} />, title: "Document Agent", detail: "Summary generated for report.pdf", time: "10:25 AM" },
  { icon: <Bot size={16} />, title: "Code Review Agent", detail: "Reviewed 45 lines of code", time: "10:24 AM" },
];

const statusColor: Record<Agent["status"], string> = {
  Working: "text-emerald-400",
  Waiting: "text-amber-400",
  Queued: "text-sky-400",
  Idle: "text-slate-500",
};

const statusDot: Record<Agent["status"], string> = {
  Working: "bg-emerald-400",
  Waiting: "bg-amber-400",
  Queued: "bg-sky-400",
  Idle: "bg-slate-500",
};

// ----------------------------------------------------------------------------
// Small building blocks
// ----------------------------------------------------------------------------

 const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div
    className={`
      rounded-2xl
      border border-cyan-400/60
      bg-[#0b1220]/70
      backdrop-blur-2xl
      shadow-[0_0_20px_rgba(34,211,238,0.25)]
      hover:border-cyan-300
      hover:shadow-[0_0_40px_rgba(34,211,238,0.55)]
      transition-all
      duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ title: string; onViewAll?: boolean }> = ({ title, onViewAll }) => (
  <div className="flex items-center justify-between px-5 pt-4 pb-3">
    <h3 className="text-xs font-semibold tracking-wider text-slate-300">{title}</h3>
    {onViewAll && (
      <button className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">View All</button>
    )}
  </div>
);

const ProgressBar: React.FC<{ value: number; colorClass?: string }> = ({ value, colorClass = "bg-sky-400" }) => (
  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
    <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
  </div>
);

// ----------------------------------------------------------------------------
// Main dashboard
// ----------------------------------------------------------------------------

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [command, setCommand] = useState("");
  const [bars, setBars] = useState<number[]>(Array.from({ length: 42 }, () => Math.random() * 100));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100));
    }, 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#05070d] text-slate-200 font-sans flex">
      {/* ============================ SIDEBAR ============================ */}
      <aside className="hidden lg:flex w-50 shrink-0 flex-col border-r border-white/10 bg-[#070a14] px-4 py-5">
        <div className="flex items-center gap-3 px-2 pb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-wide">
              UNIVERSAL<br />SOFTWARE BRAIN
            </p>
            <p className="text-[11px] text-slate-500">Multi-Agent AI System</p>
          </div>
        </div>

         <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
  <button
    key={item.label}
    onClick={() => navigate(item.path)}
    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      location.pathname === item.path
        ? "bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-sky-300 border border-sky-500/30"
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    }`}
  >
    {item.icon}
    {item.label}
  </button>
))}
        </nav>

        <Card className=" p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-300 mb-3">SYSTEM HEALTH</p>
          <div className="mb-3 flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All Systems Operational
          </div>
          <div className="space-y-10">
            {[
              { label: "CPU Usage", value: 32, color: "bg-sky-400" },
              { label: "RAM Usage", value: 58, color: "bg-violet-400" },
              { label: "Storage", value: 71, color: "bg-amber-400" },
              { label: "Network", value: 92, color: "bg-emerald-400" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{s.label}</span>
                  <span className="text-slate-300">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} colorClass={s.color} />
              </div>
            ))}
          </div>
          <button className="mt-4 flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
            Dark Mode <ChevronRight size={14} />
          </button>
        </Card>
      </aside>

      {/* ============================ MAIN ============================ */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-white/10 px-6 py-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 max-w-xl">
            <Search size={16} className="text-slate-500" />
            <input
              className="flex-1 bg-transparent text-sm placeholder:text-slate-500 outline-none"
              placeholder="Search anything or type command..."
            />
            <span className="text-[11px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5">Ctrl /</span>
          </div>
          <div className="ml-auto flex items-center gap-30">
            <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
              <Mic size={16} />
            </button>
            <button className="relative h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] flex items-center justify-center">
                8
              </span>
            </button>
            <div className="flex items-center gap-4 pl-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-violet-600" />
              <div className="leading-tight">
                <p className="text-sm font-medium">Ashik</p>
                <p className="text-[11px] text-slate-500">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </div>
          </div>
        </header>

         <main className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-x-6 gap-y-8 p-6 lg:p-8">
          {/* -------- Center column -------- */}
           <div className="flex flex-col gap-4 min-w-0">
            {/* Welcome hero */}
            <Card className="relative overflow-hidden p-6 ">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.15),transparent_60%)]" />
              <div className="relative flex items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, Ashik! 👋</h1>
                  <p className="text-sm text-slate-400 mt-1">Universal Brain is online and ready to assist you.</p>

                  <div className="flex flex-wrap gap-8 mt-6">
                    <div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">AI Brain Status</p>
                      <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> ONLINE
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">System Uptime</p>
                      <p className="text-sm font-semibold mt-1.5">12d 4h 32m</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Active Agents</p>
                      <p className="text-sm font-semibold mt-1.5">12</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Running Tasks</p>
                      <p className="text-sm font-semibold mt-1.5">5</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Success Rate</p>
                      <p className="text-sm font-semibold mt-1.5">98.6%</p>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block h-40 w-40 shrink-0 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">🧠</div>
                </div>
              </div>
            </Card>

            {/* Ask Universal Brain */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Ask Universal Brain</p>
                  <p className="text-[11px] text-slate-500">Give any command or task to the Universal Brain</p>
                </div>
              </div>

              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                rows={3}
                placeholder="What would you like me to do?"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-sky-500/50"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {["Create a React login page", "Analyze this CSV file", "Scan my code for vulnerabilities", "Summarize this PDF"].map(
                  (ex) => (
                    <button
                      key={ex}
                      onClick={() => setCommand(ex)}
                      className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10"
                    >
                      {ex}
                    </button>
                  )
                )}
              </div>

              <div className="flex  items-center gap-20 mt-4">
                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-medium">
                  <Mic size={15} /> Voice Command
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium">
                  <Paperclip size={15} /> Attach File
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium">
                  <Bot size={15} /> Select Agent
                </button>
                <button className="ml-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950">
                  <Rocket size={15} /> Execute Task
                </button>
              </div>
            </Card>

            {/* Quick actions */}
            <Card className="p-5">
              <p className="text-xs font-semibold tracking-wider text-slate-300 mb-4">QUICK ACTIONS</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center hover:bg-white/[0.06] transition-colors"
                  >
                    <span className={a.color}>{a.icon}</span>
                    <span className="text-sm font-medium">{a.label}</span>
                    <span className="text-[11px] text-slate-500">{a.sub}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Agents + Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader title="ACTIVE AI AGENTS" onViewAll />
                <div className="px-3 pb-3 space-y-1">
                  {agents.map((a) => (
                    <div key={a.name} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/[0.03]">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                        {a.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{a.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{a.task}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium ${statusColor[a.status]} w-16 shrink-0}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[a.status]}`} />
                        {a.status}
                      </div>
                      <div className="w-20 shrink-0">
                        <ProgressBar value={a.progress} />
                      </div>
                      <span className="text-[11px] text-slate-400 w-9 text-right shrink-0">{a.progress}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="LIVE TASKS" onViewAll />
                <div className="px-3 pb-3 space-y-1">
                  {tasks.map((t) => (
                    <div key={t.title} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/[0.03]">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                        {t.icon}
                      </div>
                      <p className="text-sm font-medium flex-1 truncate">{t.title}</p>
                      <span
                        className={`text-[11px] font-medium w-20 shrink-0 ${
                          t.status === "Completed" ? "text-emerald-400" : "text-sky-400"
                        }`}
                      >
                        {t.status}
                      </span>
                      <div className="w-16 shrink-0">
                        <ProgressBar value={t.progress} colorClass={t.status === "Completed" ? "bg-emerald-400" : "bg-sky-400"} />
                      </div>
                      <span className="text-[11px] text-slate-500 w-16 text-right shrink-0">{t.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* -------- Right column -------- */}
           <div className="flex flex-col gap-4">
            {/* System overview */}
            <Card className="p-5">
              <p className="text-xs font-semibold tracking-wider text-slate-300 mb-4">SYSTEM OVERVIEW</p>
              <div className="flex justify-center py-2">
                <div className="relative h-36 w-36 rounded-full flex items-center justify-center"
                  style={{
                    background: "conic-gradient(#38bdf8 0deg 355deg, rgba(255,255,255,0.06) 355deg 360deg)",
                  }}
                >
                  <div className="h-28 w-28 rounded-full bg-[#080b16] flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">98.6%</span>
                    <span className="text-[10px] text-slate-500">Overall Health</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2.5 text-sm">
                {[
                  { label: "AI Brain", value: "Online", color: "text-emerald-400" },
                  { label: "All Agents", value: "12 / 12 Online", color: "text-emerald-400" },
                  { label: "System Load", value: "32%", color: "text-slate-300" },
                  { label: "Response Time", value: "1.45s", color: "text-slate-300" },
                  { label: "Security", value: "Secure", color: "text-emerald-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live activity feed */}
            <Card>
              <CardHeader title="LIVE ACTIVITY FEED" onViewAll />
              <div className="px-4 pb-4 space-y-4 max-h-[360px] overflow-y-auto">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 shrink-0">
                      {a.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{a.title}</p>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Voice assistant */}
             {/* Voice Network Assistant */}
<Card className="p-5 overflow-hidden">
  <div className="flex items-center justify-between mb-3">
    <div>
      <p className="text-xs font-semibold tracking-wider text-slate-300">
        ALTRON
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        Universal Brain Voice Network
      </p>
    </div>

    <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Active
    </span>
  </div>

  {/* Rotating Network */}
  <div className="relative flex items-center justify-center h-[150px]">
    <img
      src={voiceNetwork}
      alt="Voice Network"
      className="w-full h-full object-contain"
    />
  </div>

  {/* Voice Status */}
  <div className="text-center">
    <p className="text-sm font-medium text-white">
      Listening...
    </p>

    <p className="text-[11px] text-slate-500 mt-1">
      Say "Hey Altron" or click the mic to speak
    </p>
  </div>

  {/* Mic Button */}
  <div className="flex justify-center mt-4">
    <button
      className="
        h-14 w-14 rounded-full
        bg-gradient-to-br from-sky-500 to-violet-600
        flex items-center justify-center
        shadow-[0_0_25px_rgba(56,189,248,0.5)]
        hover:scale-110
        transition-all duration-300
      "
    >
      <Mic size={22} />
    </button>
  </div>
</Card>
          </div>

          {/* -------- Bottom stat strip -------- */}
          <Card className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10 gap-20 p-0 overflow-hidden">
            {[
              { label: "TODAY'S ACTIVITY", value: now.toLocaleTimeString(), delta: "+18.6%" },
              { label: "TASKS COMPLETED", value: "24", delta: "+12.5%" },
              { label: "TIME SAVED", value: "5h 42m", delta: "+15.3%" },
              { label: "DATA PROCESSED", value: "12.4 GB", delta: "+22.1%" },
              { label: "AI BRAIN VERSION", value: "v3.1.7", delta: "Latest Version" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-4 ">
                <p className="text-[10px] tracking-wider text-slate-500">{s.label}</p>
                <p className="text-lg font-bold mt-1">{s.value}</p>
                <p className="text-[11px] text-emerald-400 mt-0.5">{s.delta}</p>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
}