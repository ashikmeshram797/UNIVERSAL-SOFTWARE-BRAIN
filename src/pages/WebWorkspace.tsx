 import { useState } from 'react';
 import Editor from "@monaco-editor/react";
 import FileExplorer from "../components/FileExplorer";
import {
  Settings,
  Folder,
  Copy,
  Download,
  Save,
  Trash2,
  Moon,
  Check,
  Loader2
} from 'lucide-react';



export default function WebWorkspace() {
  const [prompt, setPrompt] = useState('Create Spring Boot CRUD API using PostgreSQL');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState("");

const [files, setFiles] = useState<any[]>([]);

const [selectedFile, setSelectedFile] = useState("");
const displayCode =
    files.find((file) => file.filename === selectedFile)?.code || "";

const [model, setModel] = useState("qwen-1.5b");
const [projectPath, setProjectPath] = useState("");
const [running, setRunning] = useState(false);
const [runResult, setRunResult] = useState<any>(null);

   const handleCopy = () => {

    const file = files.find(
        (f) => f.filename === selectedFile
    );

    if (!file) return;

    navigator.clipboard.writeText(file.code);

    setCopied(true);

    setTimeout(() => {
        setCopied(false);
    }, 2000);

};

 const generateProject = async () => {
    if (!prompt.trim()) return;

    try {
        setLoading(true);
        setProjectPath("");
        setGenerationError("");
        setRunResult(null);

        const response = await fetch(
            "http://127.0.0.1:5000/api/code/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    model
                })
            }
        );

        const data = await response.json();

        console.log("GENERATE RESPONSE:", data);

        if (!response.ok) {
            setGenerationError(data.error || "Code generation failed.");
            return;
        }

        setFiles(data.files || []);

        // IMPORTANT:
        // Multi-file project मध्ये generator project_path return करतो
        if (data.project_path) {
            setProjectPath(data.project_path);
            console.log("PROJECT PATH:", data.project_path);
        }

        if (data.files && data.files.length > 0) {
            setSelectedFile(data.files[0].filename);
        }

    } catch (err) {
        console.error("Generation error:", err);
        setGenerationError(
            err instanceof Error ? err.message : "Unable to reach the generation service."
        );

    } finally {
        setLoading(false);
    }
};

const runProject = async () => {
    if (!projectPath) {
        setRunResult({
            status: "error",
            message: "Project path is missing. Generate a project before running it."
        });
        return;
    }

    try {
        setRunning(true);
        setRunResult(null);

        const response = await fetch(
            "http://127.0.0.1:5000/api/code/run",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    project_path: projectPath
                })
            }
        );

        const data = await response.json();

        console.log("RUN RESPONSE:", data);
        if (!response.ok || data.status === "error") {
            setRunResult({
                ...data,
                status: "error",
                message: data.message || "Unable to run generated project."
            });
            return;
        }

        setRunResult(data);
    } catch (error) {
        console.error("Run error:", error);
        setRunResult({
            status: "error",
            message: error instanceof Error
                ? error.message
                : "Unable to reach the project runner."
        });
    } finally {
        setRunning(false);
    }
};

const getEditorLanguage = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();

    switch (ext) {
        case "js":
        case "jsx":
            return "javascript";

        case "ts":
        case "tsx":
            return "typescript";

        case "py":
            return "python";

        case "java":
            return "java";

        case "html":
            return "html";

        case "css":
            return "css";

        case "json":
            return "json";

        case "xml":
            return "xml";

        case "sql":
            return "sql";

        case "c":
            return "c";

        case "cpp":
        case "cc":
        case "cxx":
            return "cpp";

        case "cs":
            return "csharp";

        case "go":
            return "go";

        case "rs":
            return "rust";

        case "php":
            return "php";

        case "kt":
            return "kotlin";

        case "swift":
            return "swift";

        case "dart":
            return "dart";

        default:
            return "plaintext";
    }
};

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float-glow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(50px, -40px) scale(1.2); }
        }
        @keyframes wave-move-1 {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-40px) translateY(20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes wave-move-2 {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(50px) translateY(-30px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        .animate-orb-1 { animation: float-glow 10s ease-in-out infinite; }
        .animate-orb-2 { animation: float-glow 14s ease-in-out infinite reverse; }
        .animate-wave-1 { animation: wave-move-1 12s ease-in-out infinite; }
        .animate-wave-2 { animation: wave-move-2 16s ease-in-out infinite; }
        .star-s1 { animation: star-twinkle 2s ease-in-out infinite; }
        .star-s2 { animation: star-twinkle 3.5s ease-in-out infinite 1s; }
        .star-s3 { animation: star-twinkle 2.8s ease-in-out infinite 0.5s; }
      `}</style>

      {/* ================= HIGH-BRIGHTNESS FULLSCREEN ANIMATED BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Glowing Color Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/40 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] bg-blue-600/45 rounded-full blur-[130px] animate-orb-2" />
        <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-indigo-500/35 rounded-full blur-[110px] animate-orb-1" />

        {/* SVG Bright Blue Glowing Lines & Mesh (Directly Visible Behind Everything) */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brightCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="electricBlue" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00d2ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Multiple Thick Waves passing through Center */}
          <g className="animate-wave-1">
            <path d="M -100,250 C 300,50 600,450 1100,200 C 1400,50 1700,350 2000,150" fill="none" stroke="url(#brightCyan)" strokeWidth="4" />
            <path d="M -100,280 C 320,80 620,480 1120,230 C 1420,80 1720,380 2020,180" fill="none" stroke="url(#brightCyan)" strokeWidth="2" strokeDasharray="10 8" opacity="0.8" />
            <path d="M -100,310 C 340,110 640,510 1140,260 C 1440,110 1740,410 2040,210" fill="none" stroke="url(#electricBlue)" strokeWidth="3" opacity="0.7" />
          </g>

          <g className="animate-wave-2">
            <path d="M -100,650 C 400,850 750,400 1200,750 C 1500,950 1800,550 2100,700" fill="none" stroke="url(#electricBlue)" strokeWidth="4" />
            <path d="M -100,680 C 420,880 770,430 1220,780 C 1520,980 1820,580 2120,730" fill="none" stroke="url(#brightCyan)" strokeWidth="2" strokeDasharray="12 6" opacity="0.85" />
            <path d="M -100,710 C 440,910 790,460 1240,810 C 1540,1010 1840,610 2140,760" fill="none" stroke="url(#brightCyan)" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* Grid Network Lines */}
          <path d="M 150,0 L 1350,1000 M 300,0 L 1500,1000 M 0,300 L 1200,1000" fill="none" stroke="url(#brightCyan)" strokeWidth="1" strokeDasharray="8 8" opacity="0.35" />

          {/* Glowing Bright Stars */}
          <circle cx="20%" cy="25%" r="3" fill="#ffffff" className="star-s1" style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }} />
          <circle cx="45%" cy="35%" r="3.5" fill="#00f0ff" className="star-s2" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
          <circle cx="60%" cy="55%" r="3" fill="#ffffff" className="star-s3" style={{ filter: 'drop-shadow(0 0 6px #3b82f6)' }} />
          <circle cx="78%" cy="30%" r="4" fill="#38bdf8" className="star-s1" style={{ filter: 'drop-shadow(0 0 10px #38bdf8)' }} />
          <circle cx="30%" cy="75%" r="3" fill="#ffffff" className="star-s2" style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }} />
          <circle cx="85%" cy="80%" r="3.5" fill="#00f0ff" className="star-s3" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
          <circle cx="10%" cy="70%" r="2.5" fill="#a855f7" className="star-s1" />
          <circle cx="92%" cy="20%" r="3" fill="#ffffff" className="star-s2" />
        </svg>
      </div>

      {/* ================= MAIN DASHBOARD CONTAINER (ULTRA-CLEAR GLASS) ================= */}

      <div
        className="w-full max-w-6xl bg-white/[0.03] border border-cyan-400/30 rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,240,255,0.2)] relative z-10 flex flex-col gap-8"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        
        {/* Bottom-Right Sparkle Star */}
        <div className="absolute -bottom-4 -right-4 pointer-events-none z-20">
          <svg className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(0,240,255,1)] star-s1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-20" />
          <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-white text-center drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
            Universal Software Brain
          </h1>
           <div className="flex items-center gap-2">
  <Settings className="w-4 h-4 text-white" />

  <select
    value={model}
    onChange={(e) => setModel(e.target.value)}
    className="bg-[#111827] border border-cyan-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
  >
    <option value="qwen-1.5b">
      Qwen 2.5 Coder 1.5B (Local)
    </option>

    <option value="qwen-7b">
      Qwen 2.5 Coder 7B (Cloud)
    </option>
  </select>
</div>
        </div>

        {/* Prompt Input Section */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-slate-200">
            Prompt
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="flex-1 bg-black/20 border border-white/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none resize-none transition shadow-inner placeholder-slate-400"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              placeholder="Describe what you want to build..."
            />
            
             <button
    type="button"
    onClick={generateProject}
    disabled={loading}
    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-cyan-400/50 bg-cyan-500/20 text-cyan-200 font-semibold text-sm hover:bg-cyan-500/30 transition shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px]"
>
    {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
        "Generate"
    )}
</button>

<button
    type="button"
    onClick={runProject}
    disabled={!projectPath || running}
    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-emerald-400/50 bg-emerald-500/20 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/30 transition shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px]"
>
    {running ? (
        <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
        <>
            <span className="text-base">▶</span>
            Run
        </>
    )}
</button>
          </div>
          {generationError && (
            <p role="alert" className="text-sm text-rose-300">
              {generationError}
            </p>
          )}
          {runResult?.status === "error" && (
            <p role="alert" className="text-sm text-rose-300">
              {runResult.message}
            </p>
          )}
        </div>

        {/* Main Workspace Panels (Glass Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 gap-y-8">
          
          {/* Left Panel: Project Files */}
          <div
            className="md:col-span-3 bg-white/[0.03] border border-white/15 rounded-xl p-5 flex flex-col gap-4 min-h-[380px] shadow-lg"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm pb-3 border-b border-white/15">
              <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">Project Files</span>
            </div>

             <div className="flex-1 text-xs space-y-2 overflow-y-auto font-mono text-slate-200">

   <FileExplorer
  files={files}
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
/>

</div>
          </div>

          {/* Right Panel: Code Editor */}
          <div
            className="md:col-span-9 bg-white/[0.03] border border-white/15 rounded-xl p-5 flex flex-col gap-4 min-h-[380px] shadow-lg"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <span className="text-slate-100 font-semibold text-sm">Code Editor</span>
              <button
              type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content Box (Fully Transparent Glass Box) */}
             <div className="flex-1 rounded-lg overflow-hidden border border-white/10">

 <Editor
    height="100%"
    theme="vs-dark"

    language={getEditorLanguage(selectedFile)}

    value={displayCode}

    options={{
        readOnly: false,

        minimap: {
            enabled: true
        },

        fontSize: 15,

        wordWrap: "on",

        automaticLayout: true,

        scrollBeyondLastLine: false
    }}
/>
</div>
          {runResult?.url && (
            <section className="mt-4 overflow-hidden rounded-lg border border-emerald-400/30">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm font-semibold text-emerald-200">
                  {runResult.status === "starting" ? "Starting preview..." : "Project Preview"}
                </span>
                <a
                  href={runResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-200 underline"
                >
                  Open in new tab
                </a>
              </div>
              <iframe
                title="Generated project preview"
                src={runResult.url}
                sandbox="allow-scripts allow-forms"
                className="h-[520px] w-full bg-white"
              />
            </section>
          )}
          {runResult?.stdout && (
            <pre className="mt-4 max-h-64 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-slate-200">
              {runResult.stdout}
            </pre>
          )}
          {runResult?.stderr && (
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-rose-400/20 bg-black/40 p-4 text-xs text-rose-200">
              {runResult.stderr}
            </pre>
          )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
          <button
            type="button"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-slate-100 text-sm font-medium transition active:scale-95">
            <Download className="w-5 h-5" />
            <span>Download ZIP</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2.5 px-9 py-4 rounded-xl border border-cyan-400/50 bg-cyan-500/20 text-cyan-200 font-semibold text-base hover:bg-cyan-500/30 transition shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-95">
            <Save className="w-5 h-5" />
            <span>Save Project</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={()=>{
                setFiles([]);
                setSelectedFile("");
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-200 text-sm font-medium hover:bg-rose-500/25 transition active:scale-95">
              <Trash2 className="w-5 h-5" />
              Clear
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-slate-100 text-sm font-medium transition active:scale-95">
              <span>Theme</span>
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}