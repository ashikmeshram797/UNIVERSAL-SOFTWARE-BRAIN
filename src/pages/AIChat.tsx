import React, { useRef, useState } from "react";
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
  ChevronDown,
  Plus,
  Paperclip,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  MoreVertical,
  Menu,
  X,
  Code2,
  Globe2,
  Shield,
  Sparkles,
  BrainCircuit,
  FileUp,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "AI Agents", icon: Bot },
  { name: "AI Chat", icon: MessageSquare, active: true },
  { name: "Tasks & Automation", icon: ListTodo },
  { name: "Analytics", icon: BarChart3 },
  { name: "Documents", icon: FileText },
  { name: "Knowledge Base", icon: Database },
  { name: "Security Center", icon: ShieldCheck },
  { name: "Integrations", icon: Plug },
  { name: "Voice Assistant", icon: Mic },
  { name: "Settings", icon: Settings },
];

const initialChats = [
  {
    id: 1,
    title: "Analyze sales data",
    time: "Today",
  },
  {
    id: 2,
    title: "Create login system",
    time: "Today",
  },
  {
    id: 3,
    title: "Research AI trends",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Security vulnerability scan",
    time: "Yesterday",
  },
  {
    id: 5,
    title: "Summarize project document",
    time: "2 days ago",
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hello Ashik! 👋 I'm your Universal Software Brain. I can help you with coding, research, data analysis, document processing, security and much more.",
    time: "11:32 AM",
  },
  {
    id: 2,
    sender: "ai",
    text: "What would you like me to work on today?",
    time: "11:32 AM",
  },
];

const quickPrompts = [
  {
    title: "Analyze Data",
    description: "Find insights from your data",
    icon: BarChart3,
  },
  {
    title: "Generate Code",
    description: "Build or debug code",
    icon: Code2,
  },
  {
    title: "Research Topic",
    description: "Search and summarize information",
    icon: Globe2,
  },
  {
    title: "Security Scan",
    description: "Check for security issues",
    icon: Shield,
  },
];

const agents = [
  {
    name: "Universal Brain",
    description: "Orchestrates all AI agents",
    icon: BrainCircuit,
    color: "purple",
  },
  {
    name: "Coding Agent",
    description: "Code generation & debugging",
    icon: Code2,
    color: "purple",
  },
  {
    name: "Research Agent",
    description: "Web research & analysis",
    icon: Globe2,
    color: "blue",
  },
  {
    name: "Data Analyst",
    description: "Data insights & reports",
    icon: BarChart3,
    color: "cyan",
  },
  {
    name: "Security Agent",
    description: "Threat & vulnerability scanning",
    icon: Shield,
    color: "red",
  },
];

const colorMap: Record<string, string> = {
  purple:
    "text-purple-400 bg-purple-500/10 border-purple-500/30",
  blue:
    "text-blue-400 bg-blue-500/10 border-blue-500/30",
  cyan:
    "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  red:
    "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function AIChat() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [chats, setChats] = useState(initialChats);
  const [searchChat, setSearchChat] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchChat.toLowerCase())
  );

  const handleNavigation = (name: string) => {
    if (name === "Dashboard") {
      navigate("/dashboard");
    }

    if (name === "AI Agents") {
      navigate("/ai-agents");
    }

    if (name === "AI Chat") {
      navigate("/ai-chat");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setAttachedFile(null);
  };

  const handleSend = () => {
    if (!message.trim() && !attachedFile) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message || `Attached file: ${attachedFile?.name}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setAttachedFile(null);
    setIsProcessing(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `I've received your request: "${currentMessage || "Please analyse the uploaded file"}". The Universal Brain is analysing your task and selecting the best AI agent to handle it.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1800);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachedFile(file);
    }
  };

  return (
    <div className="h-screen bg-[#050510] text-white flex overflow-hidden">

      {/* ================= MOBILE OVERLAY ================= */}

      {showMobileSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
        fixed lg:relative z-50
        w-[270px] h-screen
        bg-[#080817]
        border-r border-[#172554]
        flex flex-col
        transition-transform duration-300
        ${
          showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        `}
      >

        {/* Logo */}

        <div className="h-[105px] flex items-center px-6 gap-3 border-b border-[#172554]">

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

          <button
            className="ml-auto lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          >
            <X size={20} />
          </button>

        </div>

        {/* New Chat */}

        <div className="p-4">

          <button
            onClick={handleNewChat}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-purple-900/20"
          >
            <Plus size={18} />
            New Chat
          </button>

        </div>

        {/* Search Chats */}

        <div className="px-4 pb-3">

          <div className="h-10 rounded-lg bg-[#0b1228] border border-[#172554] flex items-center px-3 gap-2">

            <Search size={16} className="text-slate-500" />

            <input
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              placeholder="Search conversations..."
              className="bg-transparent outline-none text-xs w-full placeholder:text-slate-500"
            />

          </div>

        </div>

        {/* Chat History */}

        <div className="px-4 flex-1 overflow-y-auto">

          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">
            Recent Conversations
          </p>

          <div className="space-y-1">

            {filteredChats.map((chat) => (

              <button
                key={chat.id}
                className="w-full text-left p-3 rounded-lg hover:bg-indigo-500/10 transition-all group"
              >

                <div className="flex items-center gap-3">

                  <MessageSquare
                    size={16}
                    className="text-slate-500 group-hover:text-purple-400"
                  />

                  <div className="flex-1 min-w-0">

                    <p className="text-xs truncate">
                      {chat.title}
                    </p>

                    <p className="text-[9px] text-slate-600 mt-1">
                      {chat.time}
                    </p>

                  </div>

                  <MoreVertical
                    size={14}
                    className="text-slate-600"
                  />

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* Sidebar Navigation */}

        <div className="border-t border-[#172554] p-3">

          <p className="text-[9px] text-slate-600 uppercase px-3 mb-2">
            Navigation
          </p>

          <div className="space-y-1">

            {menuItems.slice(0, 3).map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all
                  ${
                    item.active
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                      : "text-slate-400 hover:bg-indigo-500/10 hover:text-white"
                  }`}
                >

                  <Icon size={17} />

                  {item.name}

                </button>
              );

            })}

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 min-w-0 h-screen flex flex-col">

        {/* HEADER */}

        <header className="h-[77px] flex-shrink-0 border-b border-[#172554] flex items-center px-5 lg:px-8 gap-4">

          <button
            className="lg:hidden w-10 h-10 rounded-lg bg-[#0b1228] border border-[#172554] flex items-center justify-center"
            onClick={() => setShowMobileSidebar(true)}
          >
            <Menu size={20} />
          </button>

          {/* AI Header */}

          <div className="flex items-center gap-3 flex-1">

            <div className="relative">

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">

                <BrainCircuit
                  size={23}
                  className="text-purple-400"
                />

              </div>

              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050510]" />

            </div>

            <div>

              <h2 className="text-sm font-semibold">
                Universal Brain AI
              </h2>

              <p className="text-[10px] text-emerald-400">
                ● Online · Ready to assist
              </p>

            </div>

          </div>

          {/* Agent Selector */}

          <div className="relative">

            <button
              onClick={() =>
                setShowAgentSelector(!showAgentSelector)
              }
              className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1228] border border-[#172554]"
            >

              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">

                <selectedAgent.icon
                  size={15}
                  className="text-purple-400"
                />

              </div>

              <div className="text-left">

                <p className="text-[10px] text-slate-500">
                  Working with
                </p>

                <p className="text-xs">
                  {selectedAgent.name}
                </p>

              </div>

              <ChevronDown size={14} />

            </button>

            {showAgentSelector && (

              <div className="absolute right-0 top-14 w-64 z-30 rounded-xl border border-[#172554] bg-[#0a1024] shadow-2xl shadow-black/40 p-2">

                {agents.map((agent) => {

                  const Icon = agent.icon;

                  return (

                    <button
                      key={agent.name}
                      onClick={() => {
                        setSelectedAgent(agent);
                        setShowAgentSelector(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500/10 text-left"
                    >

                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[agent.color]}`}
                      >

                        <Icon size={17} />

                      </div>

                      <div>

                        <p className="text-xs font-medium">
                          {agent.name}
                        </p>

                        <p className="text-[9px] text-slate-500 mt-1">
                          {agent.description}
                        </p>

                      </div>

                    </button>

                  );

                })}

              </div>

            )}

          </div>

          <button className="w-10 h-10 rounded-xl bg-[#0b1228] border border-[#172554] flex items-center justify-center">

            <Bell size={18} />

          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-xs font-bold">
            A
          </div>

        </header>

        {/* ================= CHAT AREA ================= */}

        <div className="flex-1 overflow-y-auto">

          <div className="max-w-4xl mx-auto px-5 lg:px-8 py-8">

            {/* Empty State */}

            {messages.length === 0 && (

              <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5">

                  <Sparkles
                    size={38}
                    className="text-purple-400"
                  />

                </div>

                <h2 className="text-2xl font-bold">
                  How can I help you today?
                </h2>

                <p className="text-sm text-slate-500 mt-2 max-w-md">
                  Ask the Universal Brain anything. I can analyse data,
                  generate code, research topics, process documents and
                  coordinate multiple AI agents.
                </p>

              </div>

            )}

            {/* Messages */}

            <div className="space-y-6">

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {msg.sender === "ai" && (

                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">

                      <BrainCircuit
                        size={18}
                        className="text-purple-400"
                      />

                    </div>

                  )}

                  <div
                    className={`max-w-[75%] ${
                      msg.sender === "user"
                        ? "order-first"
                        : ""
                    }`}
                  >

                    <div
                      className={`p-4 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-purple-700 to-indigo-600 rounded-br-md"
                          : "bg-[#0b1228] border border-[#172554] rounded-bl-md"
                      }`}
                    >

                      <p className="text-sm leading-6 whitespace-pre-wrap">
                        {msg.text}
                      </p>

                    </div>

                    <div
                      className={`flex items-center gap-3 mt-2 ${
                        msg.sender === "user"
                          ? "justify-end"
                          : ""
                      }`}
                    >

                      <span className="text-[9px] text-slate-600">
                        {msg.time}
                      </span>

                      {msg.sender === "ai" && (

                        <div className="flex items-center gap-1">

                          <button className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-slate-300">
                            <Copy size={13} />
                          </button>

                          <button className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-emerald-400">
                            <ThumbsUp size={13} />
                          </button>

                          <button className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-red-400">
                            <ThumbsDown size={13} />
                          </button>

                          <button className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-purple-400">
                            <Volume2 size={13} />
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* PROCESSING */}

            {isProcessing && (

              <div className="flex gap-4 mt-6">

                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">

                  <BrainCircuit
                    size={18}
                    className="text-purple-400"
                  />

                </div>

                <div className="p-4 rounded-2xl rounded-bl-md bg-[#0b1228] border border-[#172554]">

                  <div className="flex items-center gap-3">

                    <Loader2
                      size={16}
                      className="text-purple-400 animate-spin"
                    />

                    <span className="text-xs text-slate-400">
                      Universal Brain is analysing your request...
                    </span>

                  </div>

                  <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">

                    <span className="text-purple-400">
                      ●
                    </span>

                    Selecting best AI agent

                    <span>→</span>

                    <span className="text-cyan-400">
                      {selectedAgent.name}
                    </span>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* ================= BOTTOM INPUT ================= */}

        <div className="flex-shrink-0 border-t border-[#172554] bg-[#070714]">

          <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4">

            {/* Quick Prompts */}

            {messages.length <= 2 && (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">

                {quickPrompts.map((prompt) => {

                  const Icon = prompt.icon;

                  return (

                    <button
                      key={prompt.title}
                      onClick={() =>
                        handleQuickPrompt(prompt.title)
                      }
                      className="text-left p-3 rounded-xl bg-[#0b1228] border border-[#172554] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                    >

                      <Icon
                        size={17}
                        className="text-purple-400 mb-2"
                      />

                      <p className="text-xs font-medium">
                        {prompt.title}
                      </p>

                      <p className="text-[9px] text-slate-600 mt-1">
                        {prompt.description}
                      </p>

                    </button>

                  );

                })}

              </div>

            )}

            {/* Attached File */}

            {attachedFile && (

              <div className="mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">

                <FileUp
                  size={17}
                  className="text-purple-400"
                />

                <span className="text-xs flex-1 truncate">
                  {attachedFile.name}
                </span>

                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

            )}

            {/* Input */}

            <div className="rounded-2xl border border-[#1e3a8a] bg-[#0b1228] focus-within:border-purple-500/50 transition-all">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Universal Brain anything..."
                rows={2}
                className="w-full bg-transparent resize-none outline-none p-4 text-sm placeholder:text-slate-600"
              />

              <div className="px-3 pb-3 flex items-center justify-between">

                <div className="flex items-center gap-1">

                  {/* File Upload */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-9 h-9 rounded-lg hover:bg-white/5 text-slate-500 hover:text-purple-400 flex items-center justify-center"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <button
                    className="w-9 h-9 rounded-lg hover:bg-white/5 text-slate-500 hover:text-purple-400 flex items-center justify-center"
                    title="Upload image"
                  >
                    <ImageIcon size={18} />
                  </button>

                  <button
                    className="w-9 h-9 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 flex items-center justify-center"
                    title="Voice input"
                  >
                    <Mic size={18} />
                  </button>

                </div>

                <div className="flex items-center gap-3">

                  <span className="hidden sm:block text-[9px] text-slate-600">
                    Enter to send · Shift + Enter for new line
                  </span>

                  <button
                    onClick={handleSend}
                    disabled={
                      !message.trim() &&
                      !attachedFile
                    }
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                  >
                    <Send size={18} />
                  </button>

                </div>

              </div>

            </div>

            <p className="text-center text-[9px] text-slate-600 mt-3">
              Universal Brain may make mistakes. Verify important information.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}