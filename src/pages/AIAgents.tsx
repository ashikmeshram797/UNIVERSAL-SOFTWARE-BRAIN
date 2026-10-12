import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  ListTodo,
  BarChart3,
  FileText,
  Database,
  ShieldCheck,
  Plug,
  Mic,
  Settings,
  Search,
  Bell,
  Activity,
  Code2,
  Globe2,
  Shield,
  Rocket,
  Plus,
  CheckCircle2,
  Clock3,
  MoreVertical,
  ChevronDown,
  Play,
  Pause,
  Settings2,
  X,
  Zap,
  BrainCircuit,
  Network,
  GitBranch,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "AI Chat", icon: MessageSquare },
  { name: "AI Agents", icon: Bot, active: true },
  { name: "Tasks & Automation", icon: ListTodo },
  { name: "Analytics", icon: BarChart3 },
  { name: "Documents", icon: FileText },
  { name: "Knowledge Base", icon: Database },
  { name: "Security Center", icon: ShieldCheck },
  { name: "Integrations", icon: Plug },
  { name: "Voice Assistant", icon: Mic },
  { name: "Settings", icon: Settings },
];

const agentsData = [
  {
    id: 1,
    name: "Coding Agent",
    description: "Generates, reviews and debugs software code.",
    icon: Code2,
    status: "Online",
    tasks: 342,
    success: "98.9%",
    response: "2.1s",
    currentTask: "Generating Login System",
    color: "purple",
    capabilities: [
      "Code Generation",
      "Bug Fixing",
      "Code Review",
      "Debugging",
    ],
  },
  {
    id: 2,
    name: "Research Agent",
    description: "Performs web research and summarizes information.",
    icon: Globe2,
    status: "Working",
    tasks: 278,
    success: "97.8%",
    response: "3.4s",
    currentTask: "Researching AI Trends 2026",
    color: "blue",
    capabilities: [
      "Web Research",
      "Data Collection",
      "Summarization",
      "Fact Checking",
    ],
  },
  {
    id: 3,
    name: "Data Analyst Agent",
    description: "Analyzes datasets and extracts useful insights.",
    icon: BarChart3,
    status: "Online",
    tasks: 201,
    success: "99.2%",
    response: "1.8s",
    currentTask: "Analyzing Sales Dataset",
    color: "cyan",
    capabilities: [
      "Data Analysis",
      "Visualization",
      "Statistics",
      "Report Generation",
    ],
  },
  {
    id: 4,
    name: "Security Agent",
    description: "Scans systems and identifies security vulnerabilities.",
    icon: Shield,
    status: "Scanning",
    tasks: 156,
    success: "99.5%",
    response: "2.7s",
    currentTask: "Scanning API Security",
    color: "red",
    capabilities: [
      "Threat Detection",
      "Vulnerability Scan",
      "Security Audit",
      "Risk Analysis",
    ],
  },
  {
    id: 5,
    name: "Document Agent",
    description: "Reads, summarizes and processes documents.",
    icon: FileText,
    status: "Idle",
    tasks: 98,
    success: "96.7%",
    response: "1.5s",
    currentTask: "Waiting for Task",
    color: "indigo",
    capabilities: [
      "PDF Analysis",
      "Document Summary",
      "Text Extraction",
      "OCR",
    ],
  },
  {
    id: 6,
    name: "Creative Agent",
    description: "Creates creative content, images and presentations.",
    icon: Rocket,
    status: "Online",
    tasks: 134,
    success: "98.1%",
    response: "4.2s",
    currentTask: "Generating AI Presentation",
    color: "pink",
    capabilities: [
      "Image Generation",
      "Content Creation",
      "Presentation",
      "Creative Design",
    ],
  },
];

const colorMap: Record<string, string> = {
  purple:
    "text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-purple-500/20",
  blue:
    "text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-blue-500/20",
  cyan:
    "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/20",
  red:
    "text-red-400 bg-red-500/10 border-red-500/30 shadow-red-500/20",
  indigo:
    "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/20",
  pink:
    "text-pink-400 bg-pink-500/10 border-pink-500/30 shadow-pink-500/20",
};

export default function AIAgents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);

  const filteredAgents = agentsData.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#050510] text-white flex overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-[245px] h-screen bg-[#080817] border-r border-indigo-500/20 flex flex-col">

        {/* Logo */}

        <div className="h-[105px] flex items-center px-6 gap-3 border-b border-indigo-500/10">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
            <Bot size={34} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="font-bold text-lg leading-5">
              UNIVERSAL
              <br />
              SOFTWARE BRAIN
            </h1>

            <p className="text-[10px] text-slate-400 tracking-wide mt-1">
              MULTI-AGENT AI SYSTEM
            </p>
          </div>

        </div>

        {/* Navigation */}

        <nav className="px-4 py-5 space-y-1 flex-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={()=> {
                    if (item.name === "Dashboard") {
                        navigate("/dashboard");
                    }
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all
                ${
                  item.active
                    ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                    : "text-slate-300 hover:bg-indigo-500/10 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </button>
            );

          })}

        </nav>

        {/* System Status */}

        <div className="mx-4 mb-4 p-4 rounded-xl border border-indigo-500/20 bg-[#0a0a1d]">

          <h3 className="text-xs font-semibold mb-4">
            SYSTEM STATUS
          </h3>

          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-5">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60" />

            All Systems Operational

          </div>

          <div className="space-y-3">

            <StatusBar label="CPU Usage" value="32%" width="32%" />

            <StatusBar label="RAM Usage" value="58%" width="58%" />

            <StatusBar label="Storage" value="71%" width="71%" />

          </div>

        </div>

        <button className="mx-4 mb-4 px-4 py-3 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-indigo-500/10 flex items-center gap-3">

          <FileText size={16} />

          System Logs

          <span className="ml-auto">›</span>

        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">

        {/* HEADER */}

        <header className="h-[77px] border-b border-indigo-500/10 flex items-center px-8 gap-6">

          <div className="flex-1 max-w-[720px]">

            <div className="h-11 rounded-xl border border-indigo-500/30 bg-[#0b0b20] flex items-center px-4 gap-3">

              <Search size={19} className="text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search AI agents..."
                className="bg-transparent outline-none w-full text-sm text-white placeholder:text-slate-500"
              />

            </div>

          </div>

          <button className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <Activity size={22} className="text-cyan-400" />

          </button>

          <button className="relative w-11 h-11 rounded-full bg-[#0b0b20] border border-indigo-500/20 flex items-center justify-center">

            <Bell size={21} />

            <span className="absolute -top-1 -right-1 bg-purple-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
              8
            </span>

          </button>

          <div className="h-8 w-px bg-indigo-500/20" />

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center font-bold">
              A
            </div>

            <div>
              <p className="text-sm font-medium">
                Ashik
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <ChevronDown size={17} className="text-slate-400" />

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-6 lg:p-7 space-y-6">

          {/* PAGE HEADER */}

          <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">

                  <BrainCircuit
                    size={26}
                    className="text-purple-400"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    AI Agents
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Manage and monitor your intelligent AI workforce.
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={() => setShowCreateAgent(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 shadow-lg shadow-purple-900/30 flex items-center gap-2 text-sm font-medium"
            >

              <Plus size={18} />

              Create New Agent

            </button>

          </section>

          {/* STATS */}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <AgentStat
              icon={<Bot />}
              title="Total Agents"
              value="6"
              subtitle="All configured"
              color="purple"
            />

            <AgentStat
              icon={<Activity />}
              title="Active Agents"
              value="5"
              subtitle="Currently available"
              color="green"
            />

            <AgentStat
              icon={<ListTodo />}
              title="Running Tasks"
              value="3"
              subtitle="Tasks in progress"
              color="blue"
            />

            <AgentStat
              icon={<CheckCircle2 />}
              title="Avg. Success Rate"
              value="98.6%"
              subtitle="Across all agents"
              color="cyan"
            />

          </section>

          {/* AGENT ORCHESTRATION */}

          <section className="rounded-2xl border border-indigo-500/20 bg-[#09091b] p-5">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="font-semibold">
                  AGENT ORCHESTRATION
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Universal Brain automatically coordinates multiple agents.
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400">

                <span className="w-2 h-2 rounded-full bg-emerald-400" />

                Orchestration Active

              </div>

            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">

              <FlowBox
                icon={<MessageSquare />}
                title="User Command"
                subtitle="Analyze sales PDF"
              />

              <ArrowRight className="text-purple-400 hidden md:block" />

              <FlowBox
                icon={<BrainCircuit />}
                title="Universal Brain"
                subtitle="Task Planning"
              />

              <ArrowRight className="text-purple-400 hidden md:block" />

              <div className="grid grid-cols-2 gap-2">

                <SmallAgent name="Document" icon={<FileText />} />

                <SmallAgent name="Data Analyst" icon={<BarChart3 />} />

                <SmallAgent name="Creative" icon={<Rocket />} />

                <SmallAgent name="Research" icon={<Globe2 />} />

              </div>

              <ArrowRight className="text-purple-400 hidden md:block" />

              <FlowBox
                icon={<CheckCircle2 />}
                title="Final Result"
                subtitle="Ready for User"
              />

            </div>

          </section>

          {/* AGENT LIST HEADER */}

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold">
                Your AI Agents
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Monitor performance and manage your agents.
              </p>

            </div>

            <button className="px-4 py-2 rounded-lg border border-indigo-500/20 bg-[#0b0b20] text-xs flex items-center gap-2">

              All Agents

              <ChevronDown size={14} />

            </button>

          </div>

          {/* AGENT CARDS */}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {filteredAgents.map((agent) => (

              <AgentCard
                key={agent.id}
                agent={agent}
                onOpen={() => setSelectedAgent(agent)}
              />

            ))}

          </section>

        </div>

        {/* FOOTER */}

        <footer className="h-14 border-t border-indigo-500/10 px-7 flex items-center justify-between text-xs text-slate-500">

          <span>
            ◉ UNIVERSAL SOFTWARE BRAIN v1.0.0
          </span>

          <span className="text-slate-400">
            ✦ Powering the future with Multi-Agent AI ✦
          </span>

          <span>
            ©  Universal Brain
          </span>

        </footer>

      </main>

      {/* AGENT DETAIL MODAL */}

      {selectedAgent && (

        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />

      )}

      {/* CREATE AGENT MODAL */}

      {showCreateAgent && (

        <CreateAgentModal
          onClose={() => setShowCreateAgent(false)}
        />

      )}

    </div>
  );
}


/* ================= AGENT CARD ================= */

function AgentCard({
  agent,
  onOpen,
}: {
  agent: any;
  onOpen: () => void;
}) {

  const Icon = agent.icon;

  return (

    <div className="group rounded-2xl border border-indigo-500/20 bg-[#09091b] p-5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 transition-all">

      <div className="flex items-start justify-between">

        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${colorMap[agent.color]}`}
        >

          <Icon size={28} />

        </div>

        <button className="text-slate-500 hover:text-white">

          <MoreVertical size={18} />

        </button>

      </div>

      <div className="mt-4">

        <h3 className="font-semibold">
          {agent.name}
        </h3>

        <p className="text-xs text-slate-500 mt-2 min-h-[35px]">
          {agent.description}
        </p>

      </div>

      {/* STATUS */}

      <div className="flex items-center justify-between mt-5">

        <div className="flex items-center gap-2">

          <span
            className={`w-2 h-2 rounded-full ${
              agent.status === "Scanning"
                ? "bg-red-400"
                : agent.status === "Working"
                ? "bg-yellow-400"
                : agent.status === "Idle"
                ? "bg-slate-500"
                : "bg-emerald-400"
            }`}
          />

          <span
            className={`text-xs ${
              agent.status === "Scanning"
                ? "text-red-400"
                : agent.status === "Working"
                ? "text-yellow-400"
                : agent.status === "Idle"
                ? "text-slate-500"
                : "text-emerald-400"
            }`}
          >
            {agent.status}
          </span>

        </div>

        <span className="text-[10px] text-slate-500">
          {agent.tasks} tasks
        </span>

      </div>

      {/* CURRENT TASK */}

      <div className="mt-4 p-3 rounded-xl bg-[#0c0c22] border border-indigo-500/10">

        <p className="text-[10px] text-slate-500">
          CURRENT TASK
        </p>

        <p className="text-xs mt-1 truncate">
          {agent.currentTask}
        </p>

      </div>

      {/* PERFORMANCE */}

      <div className="grid grid-cols-2 gap-2 mt-3">

        <div className="p-2 rounded-lg bg-[#0c0c22]">

          <p className="text-[9px] text-slate-500">
            Success Rate
          </p>

          <p className="text-sm font-semibold text-emerald-400 mt-1">
            {agent.success}
          </p>

        </div>

        <div className="p-2 rounded-lg bg-[#0c0c22]">

          <p className="text-[9px] text-slate-500">
            Avg. Response
          </p>

          <p className="text-sm font-semibold text-cyan-400 mt-1">
            {agent.response}
          </p>

        </div>

      </div>

      {/* BUTTONS */}

      <div className="flex gap-2 mt-4">

        <button
          onClick={onOpen}
          className="flex-1 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/20 text-xs text-purple-300 hover:bg-purple-600/30"
        >
          Open Agent
        </button>

        <button className="w-10 rounded-lg bg-[#111126] border border-indigo-500/20 flex items-center justify-center">

          <Settings2 size={16} />

        </button>

      </div>

    </div>

  );
}


/* ================= AGENT DETAIL MODAL ================= */

function AgentDetailModal({
  agent,
  onClose,
}: {
  agent: any;
  onClose: () => void;
}) {

  const Icon = agent.icon;

  return (

    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-500/30 bg-[#080817] shadow-2xl shadow-purple-900/20">

        {/* Header */}

        <div className="p-6 border-b border-indigo-500/20 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className={`w-14 h-14 rounded-xl border flex items-center justify-center ${colorMap[agent.color]}`}
            >

              <Icon size={28} />

            </div>

            <div>

              <h2 className="text-xl font-bold">
                {agent.name}
              </h2>

              <div className="flex items-center gap-2 mt-1">

                <span className="w-2 h-2 bg-emerald-400 rounded-full" />

                <span className="text-xs text-emerald-400">
                  {agent.status}
                </span>

              </div>

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
          >

            <X size={18} />

          </button>

        </div>

        <div className="p-6 space-y-6">

          {/* Current Task */}

          <div className="p-4 rounded-xl border border-indigo-500/20 bg-[#0c0c22]">

            <p className="text-xs text-slate-500">
              CURRENT TASK
            </p>

            <div className="flex items-center gap-3 mt-3">

              <Activity className="text-purple-400" />

              <span className="text-sm">
                {agent.currentTask}
              </span>

            </div>

          </div>

          {/* Performance */}

          <div className="grid grid-cols-3 gap-3">

            <Metric
              title="Tasks Completed"
              value={agent.tasks}
            />

            <Metric
              title="Success Rate"
              value={agent.success}
            />

            <Metric
              title="Avg. Response"
              value={agent.response}
            />

          </div>

          {/* Capabilities */}

          <div>

            <h3 className="text-sm font-semibold mb-3">
              Agent Capabilities
            </h3>

            <div className="grid grid-cols-2 gap-3">

              {agent.capabilities.map((capability: string) => (

                <div
                  key={capability}
                  className="p-3 rounded-lg bg-[#0c0c22] border border-indigo-500/10 flex items-center gap-2"
                >

                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />

                  <span className="text-xs">
                    {capability}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Recent Activity */}

          <div>

            <h3 className="text-sm font-semibold mb-3">
              Recent Activity
            </h3>

            <div className="space-y-2">

              {[
                "Task completed successfully",
                "Agent processed user request",
                "Knowledge base updated",
                "Performance metrics updated",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#0c0c22]"
                >

                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />

                  <span className="text-xs text-slate-300">
                    {item}
                  </span>

                  <span className="ml-auto text-[10px] text-slate-500">
                    {index + 1}h ago
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Actions */}

          <div className="flex gap-3">

            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 flex items-center justify-center gap-2 text-sm">

              <Play size={16} />

              Start New Task

            </button>

            <button className="px-5 rounded-xl border border-indigo-500/20 bg-[#101027]">

              <Settings2 size={18} />

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}


/* ================= CREATE AGENT MODAL ================= */

function CreateAgentModal({
  onClose,
}: {
  onClose: () => void;
}) {

  return (

    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-[#080817]">

        <div className="p-6 border-b border-indigo-500/20 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold">
              Create New AI Agent
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Configure a new intelligent agent.
            </p>

          </div>

          <button onClick={onClose}>

            <X size={20} />

          </button>

        </div>

        <div className="p-6 space-y-4">

          <InputField
            label="Agent Name"
            placeholder="e.g. Marketing Agent"
          />

          <InputField
            label="Agent Description"
            placeholder="What should this agent do?"
          />

          <div>

            <label className="text-xs text-slate-400">
              Agent Type
            </label>

            <select className="w-full mt-2 p-3 rounded-lg bg-[#0c0c22] border border-indigo-500/20 text-sm outline-none">

              <option>General AI Agent</option>
              <option>Research Agent</option>
              <option>Data Analyst Agent</option>
              <option>Coding Agent</option>
              <option>Security Agent</option>

            </select>

          </div>

          <div>

            <label className="text-xs text-slate-400">
              Capabilities
            </label>

            <textarea
              placeholder="Enter agent capabilities..."
              className="w-full mt-2 h-24 p-3 rounded-lg bg-[#0c0c22] border border-indigo-500/20 text-sm outline-none resize-none"
            />

          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-sm font-medium">

            Create Agent

          </button>

        </div>

      </div>

    </div>

  );
}


/* ================= SMALL COMPONENTS ================= */

function AgentStat({
  icon,
  title,
  value,
  subtitle,
  color,
}: any) {

  return (

    <div className="p-5 rounded-xl border border-indigo-500/20 bg-[#09091b]">

      <div className="flex items-center gap-3">

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>

          {icon}

        </div>

        <span className="text-xs text-slate-400">
          {title}
        </span>

      </div>

      <p className="text-2xl font-bold mt-4">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {subtitle}
      </p>

    </div>

  );
}


function StatusBar({
  label,
  value,
  width,
}: any) {

  return (

    <div>

      <div className="flex justify-between text-[10px] text-slate-400">

        <span>
          {label}
        </span>

        <span>
          {value}
        </span>

      </div>

      <div className="h-1 bg-indigo-500/10 rounded-full mt-1">

        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
          style={{ width }}
        />

      </div>

    </div>

  );
}


function FlowBox({
  icon,
  title,
  subtitle,
}: any) {

  return (

    <div className="w-full md:w-40 p-4 rounded-xl border border-purple-500/20 bg-[#0c0c22] text-center">

      <div className="w-10 h-10 mx-auto rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">

        {icon}

      </div>

      <p className="text-xs font-semibold mt-3">
        {title}
      </p>

      <p className="text-[9px] text-slate-500 mt-1">
        {subtitle}
      </p>

    </div>

  );
}


function SmallAgent({
  name,
  icon,
}: any) {

  return (

    <div className="px-3 py-2 rounded-lg border border-indigo-500/20 bg-[#0c0c22] flex items-center gap-2">

      <span className="text-purple-400">
        {icon}
      </span>

      <span className="text-[10px]">
        {name}
      </span>

    </div>

  );
}


function Metric({
  title,
  value,
}: any) {

  return (

    <div className="p-4 rounded-xl bg-[#0c0c22] border border-indigo-500/10">

      <p className="text-[10px] text-slate-500">
        {title}
      </p>

      <p className="text-lg font-bold mt-2">
        {value}
      </p>

    </div>

  );
}


function InputField({
  label,
  placeholder,
}: any) {

  return (

    <div>

      <label className="text-xs text-slate-400">
        {label}
      </label>

      <input
        placeholder={placeholder}
        className="w-full mt-2 p-3 rounded-lg bg-[#0c0c22] border border-indigo-500/20 text-sm outline-none focus:border-purple-500/50"
      />

    </div>

  );
}