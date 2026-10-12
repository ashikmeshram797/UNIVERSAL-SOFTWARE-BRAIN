import React, { useRef,useEffect, useState, type JSX } from "react";
import ReactMarkdown from "react-markdown";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type TabId = "upload" | "notes" | "chat";

interface RecentFile {
  id: number;
  name: string;
  size: string;
  when: string;
}

interface QuickAction {
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}

interface Insight {
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}



/* ------------------------------------------------------------------ */
/* Icons (inline SVG, stroke based)                                    */
/* ------------------------------------------------------------------ */
interface SvgProps {
  size?: number;
  children: React.ReactNode;
  stroke?: string;
  width?: number;
}

const Svg: React.FC<SvgProps> = ({ size = 20, children, stroke = "currentColor", width = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IconSearch = ({ size = 22 }: { size?: number }) => (
  <Svg size={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);
const IconBell = () => (
  <Svg size={24}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </Svg>
);
const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <Svg size={size} width={2}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
const IconChevronRight = ({ size = 20 }: { size?: number }) => (
  <Svg size={size} width={2}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);
const IconArrowRight = () => (
  <Svg size={12} width={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
const IconUploadCloud = ({ size = 22 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0117.9 8.5 4 4 0 0117 18" />
    <path d="M12 21v-8M9 15.5l3-3 3 3" />
  </Svg>
);
const IconNotes = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </Svg>
);
const IconChat = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1.1-4.6A8 8 0 1121 12z" />
    <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
  </Svg>
);
const IconClock = ({ size = 22 }: { size?: number }) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const IconBulb = () => (
  <Svg size={22}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z" />
  </Svg>
);
const IconBolt = () => (
  <Svg size={22}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Svg>
);
const IconFolder = () => (
  <Svg size={18}>
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Svg>
);
const IconShare = () => (
  <Svg size={14}>
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
  </Svg>
);
const IconDiamond = () => (
  <Svg size={14}>
    <path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
  </Svg>
);
const IconGear = () => (
  <Svg size={14}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
  </Svg>
);
const IconCloudQ = () => (
  <Svg size={14}>
    <path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0117.9 8.5 4 4 0 0117 18z" />
    <path d="M12 11v.01M12 14v-.5c.8-.4 1.2-.9 1.2-1.5" />
  </Svg>
);
const IconKey = ({ size = 24 }: { size?: number }) => (
  <Svg size={size} width={2}>
    <circle cx="9" cy="8" r="4.5" />
    <path d="M12 12l7 8M16 17l3-2" />
  </Svg>
);
const IconCheckCircle = () => (
  <Svg size={26} width={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l3 3 5-6" />
  </Svg>
);
const IconStar = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f5b324" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);
const IconQuestion = () => (
  <Svg size={24}>
    <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1.1-4.6A8 8 0 1121 12z" />
    <path d="M10 10a2 2 0 114 0c0 1.2-2 1.5-2 3M12 15.5v.01" />
  </Svg>
);

const PdfBadge: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div className="pdf-badge" style={{ width: size, height: size }}>
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path d="M11 6h13l7 7v21H11z" fill="#fff" opacity="0.95" />
      <path d="M24 6v7h7z" fill="#ffb3bd" />
      <rect x="12.5" y="21" width="17" height="8" rx="1.5" fill="#ef3b52" />
      <text x="21" y="27.4" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">
        PDF
      </text>
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* Static data that needs icons                                        */
/* ------------------------------------------------------------------ */
const QUICK_ACTIONS: QuickAction[] = [
  { title: "Summarize PDF", desc: "Get a short & clear summary", color: "#7c5cff", icon: <IconNotes size={24} /> },
  { title: "Extract Key Points", desc: "Find important information", color: "#22d39a", icon: <IconKey /> },
  { title: "Generate Notes", desc: "Create structured notes", color: "#3b8cff", icon: <IconNotes size={24} /> },
];

const INSIGHTS: Insight[] = [
  { value: "5", label: "PDFs Processed", color: "#5b5ff0", icon: <IconNotes size={24} /> },
  { value: "12.5h", label: "Total Study Time", color: "#3b8cff", icon: <IconClock size={26} /> },
  { value: "92%", label: "Avg. Accuracy", color: "#22d39a", icon: <IconCheckCircle /> },
  { value: "8", label: "Notes Created", color: "#f5b324", icon: <IconStar /> },
];

/* ------------------------------------------------------------------ */
/* Hero illustration                                                   */
/* ------------------------------------------------------------------ */
const Sparkle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path
    d={`M${x} ${y - s}C${x + s * 0.15} ${y - s * 0.2} ${x + s * 0.2} ${y - s * 0.15} ${x + s} ${y}C${x + s * 0.2} ${y + s * 0.15} ${x + s * 0.15} ${y + s * 0.2} ${x} ${y + s}C${x - s * 0.15} ${y + s * 0.2} ${x - s * 0.2} ${y + s * 0.15} ${x - s} ${y}C${x - s * 0.2} ${y - s * 0.15} ${x - s * 0.15} ${y - s * 0.2} ${x} ${y - s}Z`}
    fill="#7f8dff"
  />
);

const HeroArt: React.FC = () => (
  <svg viewBox="0 0 280 190" width="280" height="190" aria-hidden="true">
    <defs>
      <linearGradient id="docA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a56e8" />
        <stop offset="1" stopColor="#2c2fb0" />
      </linearGradient>
      <linearGradient id="docB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5b6cff" />
        <stop offset="1" stopColor="#3a39d6" />
      </linearGradient>
      <linearGradient id="docC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7a74ff" />
        <stop offset="1" stopColor="#4b3fe0" />
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#4f5cff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#4f5cff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="140" cy="100" rx="130" ry="85" fill="url(#glow)" />
    <g transform="rotate(-10 60 110)">
      <rect x="22" y="48" width="92" height="116" rx="8" fill="url(#docA)" opacity="0.75" />
    </g>
    <g transform="rotate(6 160 80)">
      <rect x="122" y="22" width="76" height="100" rx="8" fill="url(#docA)" opacity="0.85" />
    </g>
    <g transform="rotate(-6 100 90)">
      <rect x="40" y="14" width="124" height="148" rx="10" fill="url(#docB)" />
      <g stroke="#b8c3ff" strokeWidth="5" strokeLinecap="round" opacity="0.9">
        <path d="M62 44h56" />
        <path d="M62 60h70" />
        <path d="M62 76h70" />
        <path d="M62 92h40" />
      </g>
      <rect x="62" y="108" width="22" height="22" rx="4" fill="#8b97ff" opacity="0.7" />
    </g>
    <g transform="rotate(14 190 130)">
      <rect x="116" y="88" width="144" height="86" rx="10" fill="url(#docC)" />
      <rect x="116" y="88" width="144" height="86" rx="10" fill="none" stroke="#a7b0ff" strokeOpacity="0.6" />
      <g stroke="#e0e5ff" strokeWidth="5" strokeLinecap="round">
        <path d="M140 112h82" />
        <path d="M140 128h82" />
        <path d="M140 144h54" />
      </g>
    </g>
    <Sparkle x={22} y={92} s={9} />
    <Sparkle x={262} y={34} s={6} />
    <Sparkle x={18} y={150} s={4} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function NotesAnalyzer(): JSX.Element {
  const [tab, setTab] = useState<TabId>("upload");
  const [activeTab, setActiveTab] = useState("upload");
  const [dragging, setDragging] = useState<boolean>(false);
  const [picked, setPicked] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
const [uploadSuccess, setUploadSuccess] = useState<string>("");
const [documentId, setDocumentId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
const [selectedDocumentId, setSelectedDocumentId] =
  useState<number | null>(null);
  const [summary, setSummary] = useState<string>("");
const [summarizing, setSummarizing] = useState<boolean>(false);
const [keyPoints, setKeyPoints] = useState<string>("");
const [extractingKeyPoints, setExtractingKeyPoints] = useState<boolean>(false);
const [generatedNotes, setGeneratedNotes] = useState<string>("");
const [generatingNotes, setGeneratingNotes] = useState<boolean>(false);
const [savedNotes, setSavedNotes] = useState<any[]>([]);
const chatBottomRef = useRef<HTMLDivElement | null>(null);
const [loadingSavedNotes, setLoadingSavedNotes] =
  useState<boolean>(false);
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const [chatQuestion, setChatQuestion] = useState<string>("");
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [chatLoading, setChatLoading] = useState<boolean>(false);

const [selectedDocumentName, setSelectedDocumentName] =
  useState<string>("");

   const handleFile = async (file?: File | null): Promise<void> => {
  if (!file) return;

  setError("");
  setUploadSuccess("");
  setDocumentId(null);

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    setError("Only PDF files are supported.");
    setPicked("");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setError("File is larger than 10MB.");
    setPicked("");
    return;
  }

  setPicked(file.name);
  setUploading(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      setUploading(false);
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/notes/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to upload PDF."
      );
    }

    setDocumentId(data.document?.id ?? null);

    setUploadSuccess(
      data.message || "PDF uploaded successfully."
    );
    await fetchRecentFiles();

  } catch (err) {
    console.error("NOTES PDF UPLOAD ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while uploading PDF."
    );

  } finally {
    setUploading(false);
  }
};

const fetchRecentFiles = async (): Promise<void> => {
  setLoadingFiles(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/notes/files",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to load files."
      );
    }

    const files: RecentFile[] = (data.files || []).map(
      (file: {
        id: number;
        file_name: string;
        file_size: number;
        created_at: string;
      }) => ({
        id: file.id,
        name: file.file_name,
        size: `${(file.file_size / (1024 * 1024)).toFixed(1)} MB`,
        when: new Date(file.created_at).toLocaleString(),
      })
    );

    setRecentFiles(files);

  } catch (err) {
    console.error("FETCH NOTES FILES ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to load recent files."
    );

  } finally {
    setLoadingFiles(false);
  }
};
 const handleChatSend = async (): Promise<void> => {

  if (!selectedDocumentId) {
    setError("Please select a PDF first.");
    return;
  }

  const question = chatQuestion.trim();

  if (!question) {
    return;
  }

  try {

    setChatLoading(true);
    setError("");

    // Immediately show user's question
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setChatQuestion("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/notes/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          document_id: selectedDocumentId,
          question: question,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to get AI answer."
      );
    }

    console.log("NOTES CHAT RESPONSE:", data);

    // Add AI answer to conversation
    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.answer || "No answer received.",
      },
    ]);

  } catch (err) {

    console.error("NOTES CHAT ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to get AI answer."
    );

  } finally {

    setChatLoading(false);

  }
};
const fetchDocumentDetails = async (
  documentId: number
): Promise<void> => {
  try {
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/notes/${documentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to load document."
      );
    }

    console.log("DOCUMENT DETAILS:", data);

  } catch (err) {
    console.error(
      "FETCH DOCUMENT DETAILS ERROR:",
      err
    );

    setError(
      err instanceof Error
        ? err.message
        : "Failed to load document details."
    );
  }
};
const handleSummarize = async (): Promise<void> => {
  if (!selectedDocumentId) {
    setError("Please select a PDF from Recent Files first.");
    return;
  }

  try {
    setError("");
    setSummarizing(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/notes/${selectedDocumentId}/summarize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to generate summary."
      );
    }

    console.log("SUMMARY RESULT:", data);
    setSummary(data.analysis?.summary || "");

  } catch (err) {
    console.error("SUMMARIZE PDF ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to generate summary."
    );
  } finally {
    setSummarizing(false);
  }
};
const handleKeyPoints = async (): Promise<void> => {
  if (!selectedDocumentId) {
    setError("Please select a PDF from Recent Files first.");
    return;
  }

  try {
    setError("");
    setExtractingKeyPoints(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/notes/${selectedDocumentId}/key-points`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to extract key points."
      );
    }

    console.log("KEY POINTS RESULT:", data);

    setKeyPoints(data.analysis?.key_points || "");

  } catch (err) {
    console.error("KEY POINTS ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to extract key points."
    );

  } finally {
    setExtractingKeyPoints(false);
  }
};
const handleGenerateNotes = async (): Promise<void> => {
  if (!selectedDocumentId) {
    setError("Please select a PDF from Recent Files first.");
    return;
  }

  try {
    setError("");
    setGeneratingNotes(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/notes/${selectedDocumentId}/generate-notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to generate notes."
      );
    }

    console.log("GENERATED NOTES RESULT:", data);

    setGeneratedNotes(
      data.analysis?.generated_notes || ""
    );

  } catch (err) {
    console.error("GENERATE NOTES ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to generate notes."
    );

  } finally {
    setGeneratingNotes(false);
  }
};
const fetchSavedNotes = async (): Promise<void> => {
  console.log("FETCH SAVED NOTES CALLED");
  try {
    setLoadingSavedNotes(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/notes/saved",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to load saved notes."
      );
    }

    console.log("SAVED NOTES:", data);

    setSavedNotes(data.notes || []);

  } catch (err) {
    console.error("SAVED NOTES ERROR:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to load saved notes."
    );

  } finally {
    setLoadingSavedNotes(false);
  }
};
useEffect(() => {
  if (tab === "notes") {
    fetchSavedNotes();
  }
}, [tab]);
useEffect(() => {
  setChatMessages([]);
  setChatQuestion("");
}, [selectedDocumentId]);
useEffect(() => {
  chatBottomRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [chatMessages, chatLoading]);
useEffect(() => {
  fetchRecentFiles();
}, []);
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "upload", label: "Upload PDF", icon: <IconUploadCloud size={22} /> },
    { id: "notes", label: "My Notes", icon: <IconNotes size={20} /> },
    { id: "chat", label: "AI Chat", icon: <IconChat size={20} /> },
  ];

  return (
    <div className="usb">
      <style>{CSS}</style>

      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#dfe6ff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
            <path d="M24 5L5 14l19 9 19-9z" />
            <path d="M5 14v9M11 20v12c0 3 6 6 13 6s13-3 13-6V20" />
            <path d="M24 23v15" />
          </svg>
          <div>
            <div className="brand-title">Universal Software Brain</div>
            <div className="brand-sub">Build &bull; Learn &bull; Create &bull; Grow</div>
          </div>
        </div>

        <label className="search">
          <IconSearch />
          <input type="text" placeholder="Search anything..." aria-label="Search" />
          <kbd>Ctrl K</kbd>
        </label>

        <div className="top-right">
          <div className="online">
            <span className="dot" /> Online
          </div>
          <button className="bell" aria-label="Notifications">
            <IconBell />
            <span className="bell-dot" />
          </button>
          <div className="user">
            <div className="avatar">A</div>
            <span>Ashik</span>
            <IconChevronDown />
          </div>
        </div>
      </header>

      <main className="page">
        {/* Hero banner */}
        <section className="hero">
          <div className="hero-icon">
            <svg viewBox="0 0 80 80" width="76" height="76">
              <path d="M20 8h28l16 16v48H20z" fill="none" stroke="#e8ecff" strokeWidth="5" strokeLinejoin="round" />
              <path d="M48 8v16h16" fill="none" stroke="#e8ecff" strokeWidth="5" strokeLinejoin="round" />
              <path d="M30 34h14M30 44h22" stroke="#e8ecff" strokeWidth="5" strokeLinecap="round" />
              <text x="42" y="64" textAnchor="middle" fontSize="15" fontWeight="800" fill="#e8ecff" fontFamily="Inter, sans-serif">
                PDF
              </text>
            </svg>
          </div>

          <div className="hero-copy">
            <div className="hero-eyebrow">NOTES ASSISTANT</div>
            <h1>Upload &amp; Analyze Your PDF</h1>
            <p>Get instant summaries, key points, notes and more with the power of AI.</p>
            <div className="chips">
              <button className="chip"><IconShare /> Summarize</button>
              <button className="chip"><IconDiamond /> Extract Key Points</button>
              <button className="chip"><IconGear /> Generate Notes</button>
              <button className="chip"><IconCloudQ /> Ask Questions</button>
            </div>
          </div>

          <div className="hero-art"><HeroArt /></div>

          <div className="hero-script">
            <span>Turn Your PDFs</span>
            <span>Into Smart Notes</span>
            <svg viewBox="0 0 190 30" width="190" height="30" aria-hidden="true">
              <path d="M4 26C60 14 120 8 186 6" stroke="#8d9bff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        <div className="grid">
          {/* Left panel */}
          <section className="panel main-panel">
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={"tab" + (tab === t.id ? " active" : "")}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "upload" ? (
              <div
                className={"dropzone" + (dragging ? " drag" : "")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <div className="cloud">
                  <IconUploadCloud size={46} />
                </div>
                <div className="drop-title">Drag &amp; drop your PDF here</div>
                <div className="drop-sub">or click to browse files</div>
                <div className="drop-note">Supports PDF files (max 10MB)</div>
                 <button
  className="choose"
  disabled={uploading}
  onClick={(e) => {
    e.stopPropagation();

    if (!uploading) {
      inputRef.current?.click();
    }
  }}
>
  <IconFolder /> {uploading ? "Uploading..." : "Choose File"}
</button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {picked && (
  <div className="picked">
    {uploading
      ? `Uploading: ${picked}...`
      : `Selected: ${picked}`}
  </div>
)}

{uploadSuccess && (
  <div className="picked">
    ✓ {uploadSuccess}
  </div>
)}

{documentId && (
  <div className="picked">
    Document ID: {documentId}
  </div>
)}

{error && (
  <div className="err">
    {error}
  </div>
)}
              </div>
             ) : tab === "notes" ? (
  <section className="my-notes-panel">

    <div className="qa-head">
      <IconNotes size={22} /> My Notes
    </div>

    {loadingSavedNotes && (
      <div className="dropzone empty">
        <div className="drop-title">
          Loading your saved notes...
        </div>
      </div>
    )}

    {!loadingSavedNotes && savedNotes.length === 0 && (
      <div className="dropzone empty">

        <div className="drop-title">
          No notes yet
        </div>

        <div className="drop-sub">
          Upload a PDF to generate your first notes.
        </div>

        <button
          className="choose"
          onClick={() => setTab("upload")}
        >
          <IconUploadCloud size={18} /> Upload PDF
        </button>

      </div>
    )}

    {!loadingSavedNotes && savedNotes.length > 0 && (
      <div className="saved-notes-list">

        {savedNotes.map((note) => (
          <div
            className="saved-note-card"
            key={note.document_id}
          >

            <div className="saved-note-title">
              <PdfBadge />
              {note.file_name}
            </div>

            {note.subject && (
              <div className="saved-note-subject">
                {note.subject}
              </div>
            )}

            {note.analysis && (
              <div className="saved-note-content">

                {note.analysis.summary && (
                  <div className="saved-note-section">
                    <h4>AI Summary</h4>

                    <ReactMarkdown>
                      {note.analysis.summary}
                    </ReactMarkdown>
                  </div>
                )}

                {note.analysis.key_points && (
                  <div className="saved-note-section">
                    <h4>Key Points</h4>

                    <ReactMarkdown>
                      {note.analysis.key_points}
                    </ReactMarkdown>
                  </div>
                )}

                {note.analysis.generated_notes && (
                  <div className="saved-note-section">
                    <h4>Generated Notes</h4>

                    <ReactMarkdown>
                      {note.analysis.generated_notes}
                    </ReactMarkdown>
                  </div>
                )}

              </div>
            )}

            {!note.analysis && (
              <div className="saved-note-empty">
                No analysis generated yet.
              </div>
            )}

          </div>
        ))}

      </div>
    )}

  </section>
 ) : (
  <section className="ai-chat-panel">

    <div className="ai-chat-header">
      <div className="ai-chat-title">
        <IconChat size={22} />
        <div>
          <h3>AI Chat</h3>
          <p>Ask questions about your uploaded PDF</p>
        </div>
      </div>

       <div className="ai-chat-actions">

  {chatMessages.length > 0 && (
    <button
      className="chat-clear-btn"
      onClick={() => {
        setChatMessages([]);
        setChatQuestion("");
      }}
    >
      New Chat
    </button>
  )}

  <div className="ai-chat-status">
    <span className="ai-status-dot"></span>
    AI Ready
  </div>

</div>
    </div>

    <div className="chat-document-bar">
      <div className="chat-document-info">
        <PdfBadge />

        <div>
          <div className="chat-document-name">
            {selectedDocumentName || "No PDF selected"}
          </div>

          <div className="chat-document-sub">
            {selectedDocumentId
              ? "Selected document"
              : "Select a PDF from Recent Files"}
          </div>
        </div>
      </div>

      <button
        className="chat-select-btn"
        onClick={() => setTab("upload")}
      >
        <IconUploadCloud size={17} />
        Select PDF
      </button>
    </div>

    <div className="chat-messages">

      {!selectedDocumentId && (
        <div className="chat-empty">

          <div className="chat-empty-icon">
            <IconChat size={34} />
          </div>

          <h3>Select a PDF to start chatting</h3>

          <p>
            Choose a PDF from Recent Files and ask questions
            about its content.
          </p>

          <button
            className="choose"
            onClick={() => setTab("upload")}
          >
            <IconUploadCloud size={18} />
            Select PDF
          </button>

        </div>
      )}

      {selectedDocumentId && (
        <div className="chat-welcome">

          <div className="chat-ai-avatar">
            AI
          </div>

          <div className="chat-bubble ai">
            <strong>AI Assistant</strong>

            <p>
              I'm ready to answer questions about{" "}
              <b>{selectedDocumentName}</b>.
            </p>

            <p>
              Ask me anything based on this PDF.
            </p>
          </div>

        </div>
      )}
       {chatMessages.map((message, index) => (
  <div
    key={index}
    className={
      message.role === "user"
        ? "chat-message user"
        : "chat-message assistant"
    }
  >

    {message.role === "assistant" && (
      <div className="chat-ai-avatar">
        AI
      </div>
    )}

    <div className="chat-bubble">
      {message.role === "assistant" && (
        <strong>AI Assistant</strong>
      )}

      <ReactMarkdown>
        {message.content}
      </ReactMarkdown>
    </div>

  </div>
))}
{chatLoading && (
  <div className="chat-message assistant">

    <div className="chat-ai-avatar">
      AI
    </div>

    <div className="chat-bubble thinking-bubble">
      <strong>AI Assistant</strong>

      <div className="thinking-content">
        <span></span>
        <span></span>
        <span></span>
        <em>Thinking...</em>
      </div>
    </div>

  </div>
)}
 {/* Auto scroll target */}
  <div ref={chatBottomRef} />
    </div>

    <div className="chat-input-area">

      <div className="chat-input-wrapper">

         <input
  type="text"
  placeholder={
    selectedDocumentId
      ? "Ask something about your PDF..."
      : "Select a PDF first..."
  }
  value={chatQuestion}
  onChange={(e) => setChatQuestion(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  }}
  disabled={!selectedDocumentId || chatLoading}
/>

         <button
  className="chat-send-btn"
  onClick={handleChatSend}
  disabled={
    !selectedDocumentId ||
    !chatQuestion.trim() ||
    chatLoading
  }
>
  {chatLoading ? "Thinking..." : "Send"}
</button>

      </div>

      <div className="chat-input-hint">
        AI answers are generated using the selected PDF content.
      </div>

    </div>

  </section>
)}

            {tab === "upload" && (
             <>
            <div className="qa-head">
              <IconBolt /> Quick Actions
            </div>
            <div className="qa-grid">
              {QUICK_ACTIONS.map((a) => (
                <button
  key={a.title}
  className="qa-card"
  style={{ ["--c" as string]: a.color }}
   onClick={() => {
  if (a.title === "Summarize PDF") {
    handleSummarize();
  }

  if (a.title === "Extract Key Points") {
    handleKeyPoints();
  }
  if (a.title === "Generate Notes") {
  handleGenerateNotes();
}
}}
>
                  <span className="qa-ico">{a.icon}</span>
                  <span className="qa-title">{a.title}</span>
                  <span className="qa-desc">{a.desc}</span>
                </button>
              ))}
            </div>
            </>
            )}
          </section>

          {tab === "upload" && (
          <>
          {summary && (
  <section className="panel analysis-result">
    <div className="qa-head">
      <IconNotes size={22} /> AI Summary
    </div>

     <div className="summary-content">
  <ReactMarkdown>
    {summary}
  </ReactMarkdown>
</div>
  </section>
)}
{keyPoints && (
  <section className="panel analysis-result">
    <div className="qa-head">
      <IconKey size={22} /> Key Points
    </div>

    <div className="summary-content">
      <ReactMarkdown>
        {keyPoints}
      </ReactMarkdown>
    </div>
  </section>
)}
{generatedNotes && (
  <section className="panel analysis-result">
    <div className="qa-head">
      <IconNotes size={22} /> Generated Notes
    </div>

    <div className="summary-content">
      <ReactMarkdown>
        {generatedNotes}
      </ReactMarkdown>
    </div>
  </section>
)}
</>
)}

          {/* Right column */}
          <aside className="side">
            <section className="panel recent">
              <div className="side-head">
                <div className="side-title"><IconClock size={22} /> Recent Files</div>
                <a className="link" href="#">View All <IconArrowRight /></a>
              </div>
              <ul>
                {loadingFiles && (
  <li>
    <div style={{ padding: "20px", color: "#9eabd6" }}>
      Loading files...
    </div>
  </li>
)}

{recentFiles.length === 0 && !loadingFiles && (
  <li>
    <div style={{ padding: "20px", color: "#9eabd6" }}>
      No files uploaded yet.
    </div>
  </li>
)}
                {recentFiles.map((f) => (
                  <li
  key={f.id}
  onClick={() => {
    setSelectedDocumentId(f.id);
    setSelectedDocumentName(f.name);
    fetchDocumentDetails(f.id);
  }}
  style={{
    cursor: "pointer",
    border:
      selectedDocumentId === f.id
        ? "1px solid #6c7cff"
        : "1px solid transparent",
  }}
>
                    <button className="file-row">
                      <PdfBadge />
                      <span className="file-meta">
                        <span className="file-name">{f.name}</span>
                        <span className="file-sub">{f.size} &bull; {f.when}</span>
                      </span>
                      <IconChevronRight />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel insights">
              <div className="side-head">
                <div className="side-title"><IconBulb /> Study Insights</div>
                <a className="link" href="#">View Details <IconArrowRight /></a>
              </div>
              <div className="ins-grid">
                {INSIGHTS.map((i) => (
                  <div key={i.label} className="ins" style={{ ["--c" as string]: i.color }}>
                    <span className="ins-ico">{i.icon}</span>
                    <span>
                      <span className="ins-val">{i.value}</span>
                      <span className="ins-label">{i.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Dancing+Script:wght@500;600&display=swap');
.usb{--bg:#050a1c;--panel:#08102a;--panel2:#0b1534;--line:#16214a;--text:#f2f5ff;--muted:#8d9ac4;
  min-height:100vh;background:radial-gradient(1200px 500px at 50% -10%,#0d1a4a 0%,transparent 60%),var(--bg);
  color:var(--text);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.usb *{box-sizing:border-box}
.usb button{font-family:inherit;color:inherit;cursor:pointer}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 32px;
  background:#060d24;border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:16px;min-width:300px}
.brand-title{font-size:20px;font-weight:700;letter-spacing:-.2px}
.brand-sub{font-size:13px;color:var(--muted);margin-top:2px}
.search{flex:0 1 482px;display:flex;align-items:center;gap:12px;height:42px;padding:0 14px;border-radius:12px;
  background:#0a1536;border:1px solid #243170;color:#b9c4ee}
.search input{flex:1;background:none;border:0;outline:0;color:var(--text);font-size:16px;font-family:inherit}
.search input::placeholder{color:#9aa7d3}
.search kbd{font-family:inherit;font-size:13px;padding:3px 8px;border-radius:6px;background:#111d45;border:1px solid #2a3878;color:#c9d2f5}
.top-right{display:flex;align-items:center;gap:26px}
.online{display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#0b2a2e;color:#3cf0a1;font-weight:600;font-size:16px}
.dot{width:12px;height:12px;border-radius:50%;background:#22e58f;box-shadow:0 0 10px #22e58f}
.bell{position:relative;background:none;border:0;color:#dfe6ff;display:grid;place-items:center;padding:4px}
.bell-dot{position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:#ff3b5c}
.user{display:flex;align-items:center;gap:12px;font-weight:600;font-size:16px}
.avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#3b82ff,#2f5be8);display:grid;place-items:center;font-size:19px;font-weight:600}
.page{padding:20px 32px 40px;max-width:1536px;margin:0 auto}

.hero{position:relative;display:flex;align-items:center;gap:36px;min-height:198px;padding:0 36px;border-radius:18px;overflow:hidden;
  background:radial-gradient(600px 220px at 62% 60%,#2a35b5 0%,transparent 70%),linear-gradient(100deg,#0e1a63 0%,#16208a 45%,#0f1a70 100%);
  border:1px solid #2b3aa8;box-shadow:inset 0 0 60px rgba(70,90,255,.15)}
.hero-icon{width:126px;height:126px;flex:none;border-radius:30px;display:grid;place-items:center;
  background:linear-gradient(145deg,#5a4bff,#3b34d8);box-shadow:0 0 40px rgba(100,90,255,.55),inset 0 0 0 1px rgba(255,255,255,.18)}
.hero-eyebrow{font-size:13px;font-weight:600;letter-spacing:.6px;color:#d7defa}
.hero h1{margin:6px 0 8px;font-size:32px;font-weight:700;letter-spacing:-.5px}
.hero p{margin:0 0 16px;font-size:17px;color:#c6cff3}
.chips{display:flex;gap:12px;flex-wrap:wrap}
.chip{display:flex;align-items:center;gap:9px;height:34px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;
  background:rgba(14,22,90,.75);border:1px solid rgba(120,135,255,.35)}
.hero-art{position:absolute;left:calc(50% + 64px);top:12px;pointer-events:none}
.hero-script{position:absolute;right:112px;top:50px;display:flex;flex-direction:column;align-items:flex-start;
  font-family:'Dancing Script',cursive;font-style:italic;font-size:25px;line-height:1.15;color:#aeb8ff;transform:rotate(-12deg)}
.hero-script span:nth-child(2){margin-left:-10px}
.hero-script svg{margin-top:4px;margin-left:-14px}

.grid{display:grid;grid-template-columns:minmax(0,1fr) 402px;gap:24px;margin-top:20px}
.panel{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px}
.main-panel{padding:18px 26px 26px}
.tabs{display:flex;border-bottom:1px solid var(--line);margin-bottom:26px}
.tab{display:flex;align-items:center;gap:12px;height:48px;padding:0 28px;background:none;border:0;border-bottom:3px solid transparent;
  font-size:15px;font-weight:500;color:#a9b4de;margin-bottom:-1px}
.tab.active{color:#fff;font-weight:600;border-bottom-color:#7b5cff;background:linear-gradient(180deg,transparent,rgba(110,80,255,.2));border-radius:8px 8px 0 0}
.dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;height:332px;border:2px dashed #2b45d6;border-radius:12px;
  background:radial-gradient(500px 220px at 50% 40%,rgba(35,60,200,.18),transparent 70%);cursor:pointer;text-align:center;transition:background .15s,border-color .15s}
.dropzone.drag{border-color:#7b8cff;background:rgba(60,80,230,.22)}
.dropzone.empty{cursor:default}
.cloud{width:94px;height:94px;border-radius:50%;display:grid;place-items:center;color:#9fb0ff;background:#17267e;margin-bottom:14px;box-shadow:0 0 30px rgba(60,80,230,.35)}
.drop-title{font-size:21px;font-weight:700}
.drop-sub{margin-top:6px;font-size:16px;color:#c3cdf2}
.drop-note{margin-top:16px;font-size:14px;color:#aab6de}
.choose{display:flex;align-items:center;gap:10px;margin-top:16px;height:47px;padding:0 50px;border:0;border-radius:8px;font-size:15px;font-weight:600;
  background:linear-gradient(90deg,#6a3cff,#4b6bff);box-shadow:0 8px 24px rgba(90,80,255,.4)}
.picked{margin-top:12px;font-size:14px;color:#3cf0a1}
.err{margin-top:12px;font-size:14px;color:#ff7a90}
.qa-head{display:flex;align-items:center;gap:12px;margin:32px 0 16px 4px;font-size:16px;font-weight:600}
.qa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.qa-card{display:flex;flex-direction:column;align-items:flex-start;text-align:left;padding:16px 22px 18px;height:146px;border-radius:12px;
  background:#0a1334;border:1px solid #1b2a63}
.qa-ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;margin-bottom:14px;color:var(--c);
  background:color-mix(in srgb,var(--c) 22%,#0a1334);box-shadow:0 0 18px color-mix(in srgb,var(--c) 30%,transparent)}
.qa-title{font-size:16px;font-weight:600}
.qa-desc{margin-top:6px;font-size:13px;color:#a7b3de}

.side{display:flex;flex-direction:column;gap:20px}
.recent{padding:18px 16px 16px}
.insights{padding:18px 16px 16px}
.side-head{display:flex;justify-content:space-between;align-items:center;margin:0 6px 16px}
.side-title{display:flex;align-items:center;gap:12px;font-size:16px;font-weight:600}
.link{display:flex;align-items:center;gap:6px;font-size:12px;color:#7fa0ff;text-decoration:none;font-weight:500}
.recent ul{
  list-style:none;
  margin:0;
  padding:0;
  display:flex;
  flex-direction:column;
  gap:8px;

  max-height:420px;
  overflow-y:auto;
  padding-right:6px;
}
  .recent ul::-webkit-scrollbar{
  width:6px;
}

.recent ul::-webkit-scrollbar-track{
  background:transparent;
}

.recent ul::-webkit-scrollbar-thumb{
  background:#29376f;
  border-radius:10px;
}

.recent ul::-webkit-scrollbar-thumb:hover{
  background:#40529a;
}
.file-row{width:100%;display:flex;align-items:center;gap:14px;height:62px;padding:0 16px 0 12px;border-radius:10px;background:#0a1334;border:1px solid #16224f;text-align:left}
.pdf-badge{flex:none;border-radius:9px;display:grid;place-items:center;background:linear-gradient(145deg,#ff4d63,#e1243d)}
.file-meta{flex:1;display:flex;flex-direction:column;gap:5px;min-width:0}
.file-name{font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-sub{font-size:12px;color:#9eabd6}
.file-row svg{color:#c3cdf2;flex:none}
.ins-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ins{display:flex;align-items:center;gap:14px;height:77px;padding:0 14px;border-radius:12px;background:#0a1334;border:1px solid #16224f}
.ins-ico{width:44px;height:44px;flex:none;border-radius:50%;display:grid;place-items:center;color:var(--c);background:color-mix(in srgb,var(--c) 22%,#0a1334)}
.ins-val{display:block;font-size:20px;font-weight:700}
.ins-label{display:block;margin-top:2px;font-size:12px;color:#a7b3de}

@media (max-width:1100px){
  .grid{grid-template-columns:1fr}
  .hero-art,.hero-script{display:none}
  .search{display:none}
  .qa-grid{grid-template-columns:repeat(2,1fr)}
}
  .analysis-result {
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;
}

.analysis-result .summary-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px 18px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
  .summary-content h1,
.summary-content h2,
.summary-content h3 {
  margin: 16px 0 10px;
}

.summary-content p {
  margin: 8px 0;
}

.summary-content ul,
.summary-content ol {
  margin: 8px 0;
  padding-left: 24px;
}

.summary-content li {
  margin: 5px 0;
}

.summary-content strong {
  font-weight: 700;
}

.summary-content code {
  padding: 2px 6px;
  border-radius: 5px;
  background: #111b3d;
}

.summary-content pre {
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  background: #060d24;
}
@media (max-width:640px){
  .topbar{padding:12px 16px}.brand{min-width:0}.brand-sub,.online{display:none}
  .page{padding:16px}.hero{padding:20px;flex-direction:column;align-items:flex-start;gap:16px}
  .hero h1{font-size:24px}.tab{padding:0 12px;font-size:13px}
  .tab svg{display:none}.dropzone{height:300px;padding:0 12px}
}
  /* =========================
   My Notes
   ========================= */

.my-notes-panel{
  margin-top:20px;
}

.saved-notes-list{
  display:flex;
  flex-direction:column;
  gap:16px;
  margin-top:18px;
}

.saved-note-card{
  padding:18px;
  border:1px solid var(--line);
  border-radius:14px;
  background:rgba(255,255,255,0.02);

  max-height:420px;
  overflow-y:auto;
}
  .saved-note-card::-webkit-scrollbar{
  width:6px;
}

.saved-note-card::-webkit-scrollbar-track{
  background:transparent;
}

.saved-note-card::-webkit-scrollbar-thumb{
  background:#29376f;
  border-radius:10px;
}

.saved-note-card::-webkit-scrollbar-thumb:hover{
  background:#40529a;
}

.saved-note-title{
  display:flex;
  align-items:center;
  gap:10px;
  font-size:15px;
  font-weight:600;
  color:#eef2ff;
}

.saved-note-subject{
  margin-top:6px;
  margin-left:32px;
  font-size:12px;
  color:#8997c5;
}

.saved-note-content{
  margin-top:16px;
}

.saved-note-section{
  padding:16px 0;
  border-top:1px solid var(--line);
}

.saved-note-section h4{
  margin:0 0 10px;
  color:#b9c5ed;
  font-size:14px;
  font-weight:600;
}

.saved-note-section p{
  margin:8px 0;
  color:#aeb9dd;
  line-height:1.7;
}

.saved-note-section ul,
.saved-note-section ol{
  margin:8px 0;
  padding-left:22px;
  color:#aeb9dd;
  line-height:1.7;
}

.saved-note-section li{
  margin:5px 0;
}

.saved-note-section strong{
  color:#eef2ff;
}

.saved-note-section code{
  padding:2px 6px;
  border-radius:5px;
  background:#111b3d;
}

.saved-note-section pre{
  padding:14px;
  border-radius:8px;
  overflow-x:auto;
  background:#060d24;
}

.saved-note-empty{
  padding:20px 0;
  color:#8997c5;
  font-size:13px;
}
  /* =========================
   AI CHAT
   ========================= */

.ai-chat-panel{
  margin-top:20px;
  border:1px solid var(--line);
  border-radius:16px;
  overflow:hidden;
  background:linear-gradient(180deg,var(--panel2),var(--panel));
}

.ai-chat-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:18px 20px;
  border-bottom:1px solid var(--line);
}

.ai-chat-title{
  display:flex;
  align-items:center;
  gap:12px;
  color:#eef2ff;
}

.ai-chat-title > svg{
  color:#8b7cff;
}

.ai-chat-title h3{
  margin:0;
  font-size:16px;
  font-weight:600;
}

.ai-chat-title p{
  margin:4px 0 0;
  font-size:12px;
  color:#8997c5;
}

.ai-chat-status{
  display:flex;
  align-items:center;
  gap:8px;
  padding:7px 12px;
  border-radius:999px;
  background:#0b2a2e;
  color:#3cf0a1;
  font-size:12px;
  font-weight:600;
}

.ai-status-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  background:#22e58f;
  box-shadow:0 0 8px #22e58f;
}
  .chat-message{
  display:flex;
  align-items:flex-start;
  gap:12px;
  margin-bottom:18px;
}

.chat-message.user{
  justify-content:flex-end;
}

.chat-message.user .chat-bubble{
  background:linear-gradient(145deg,#263477,#1b285c);
  border-color:#394b91;
  color:#eef2ff;
  max-width:75%;
}

.chat-message.assistant .chat-bubble{
  max-width:75%;
}

.chat-message .chat-bubble p{
  margin:7px 0;
}

.chat-message .chat-bubble ul,
.chat-message .chat-bubble ol{
  margin:8px 0;
  padding-left:20px;
}

.chat-message .chat-bubble li{
  margin:5px 0;
}

/* Selected PDF */

.chat-document-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  padding:14px 20px;
  border-bottom:1px solid var(--line);
  background:#07102a;
}

.chat-document-info{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}

.chat-document-name{
  font-size:14px;
  font-weight:600;
  color:#eef2ff;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.chat-document-sub{
  margin-top:4px;
  font-size:11px;
  color:#8997c5;
}

.chat-select-btn{
  display:flex;
  align-items:center;
  gap:7px;
  height:34px;
  padding:0 13px;
  border:1px solid #29376f;
  border-radius:8px;
  background:#0d1739;
  color:#bfc9ed;
  font-size:12px;
  font-weight:500;
}

.chat-select-btn:hover{
  border-color:#5868c9;
  background:#111d45;
}

/* Messages */

.chat-messages{
  min-height:330px;
  max-height:430px;
  overflow-y:auto;
  padding:24px;
}

.chat-empty{
  min-height:280px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.chat-empty-icon{
  width:70px;
  height:70px;
  display:grid;
  place-items:center;
  border-radius:20px;
  color:#9b8cff;
  background:#17205a;
  box-shadow:0 0 30px rgba(90,80,255,.25);
  margin-bottom:18px;
}

.chat-empty h3{
  margin:0;
  font-size:17px;
  color:#eef2ff;
}

.chat-empty p{
  max-width:420px;
  margin:8px 0 0;
  color:#8997c5;
  font-size:13px;
  line-height:1.6;
}

.chat-empty .choose{
  margin-top:18px;
}

.chat-welcome{
  display:flex;
  align-items:flex-start;
  gap:12px;
}

.chat-ai-avatar{
  width:36px;
  height:36px;
  flex:none;
  display:grid;
  place-items:center;
  border-radius:11px;
  background:linear-gradient(145deg,#6a4cff,#4236d8);
  color:#fff;
  font-size:11px;
  font-weight:700;
}

.chat-bubble{
  max-width:75%;
  padding:13px 16px;
  border-radius:12px;
  background:#0d1739;
  border:1px solid #1c2a5b;
  color:#b9c5e9;
  font-size:13px;
  line-height:1.6;
}

.chat-bubble strong{
  display:block;
  margin-bottom:5px;
  color:#eef2ff;
}

.chat-bubble p{
  margin:5px 0;
}
  .chat-answer-message{
  display:flex;
  align-items:flex-start;
  gap:12px;
  margin-top:18px;
}

.chat-answer-message .chat-bubble{
  max-width:75%;
}

.chat-answer-message .chat-bubble p{
  margin:7px 0;
}

.chat-answer-message .chat-bubble ul,
.chat-answer-message .chat-bubble ol{
  margin:8px 0;
  padding-left:20px;
}

.chat-answer-message .chat-bubble li{
  margin:5px 0;
}

/* Input */

.chat-input-area{
  padding:16px 20px 18px;
  border-top:1px solid var(--line);
  background:#07102a;
}

.chat-input-wrapper{
  display:flex;
  align-items:center;
  gap:10px;
  padding:6px;
  border:1px solid #26366f;
  border-radius:11px;
  background:#0a1536;
}

.chat-input-wrapper input{
  flex:1;
  min-width:0;
  height:38px;
  padding:0 10px;
  border:0;
  outline:0;
  background:transparent;
  color:#eef2ff;
  font-family:inherit;
  font-size:13px;
}

.chat-input-wrapper input::placeholder{
  color:#6878a9;
}

.chat-send-btn{
  height:38px;
  padding:0 18px;
  border:0;
  border-radius:8px;
  background:linear-gradient(90deg,#6a3cff,#4b6bff);
  color:#fff;
  font-size:12px;
  font-weight:600;
}

.chat-send-btn:disabled{
  opacity:.45;
  cursor:not-allowed;
}

.chat-input-hint{
  margin-top:8px;
  font-size:10px;
  color:#6878a9;
}

/* Chat scrollbar */

.chat-messages::-webkit-scrollbar{
  width:6px;
}

.chat-messages::-webkit-scrollbar-track{
  background:transparent;
}

.chat-messages::-webkit-scrollbar-thumb{
  background:#29376f;
  border-radius:10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover{
  background:#40529a;
}
  .thinking-content{
  display:flex;
  align-items:center;
  gap:5px;
  margin-top:8px;
}
.ai-chat-actions{
  display:flex;
  align-items:center;
  gap:10px;
}

.chat-clear-btn{
  height:32px;
  padding:0 12px;
  border:1px solid #29376f;
  border-radius:8px;
  background:#0d1739;
  color:#aeb9dd;
  font-family:inherit;
  font-size:11px;
  font-weight:600;
  cursor:pointer;
}

.chat-clear-btn:hover{
  border-color:#5868c9;
  background:#111d45;
  color:#eef2ff;
}
.thinking-content span{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#8b7cff;
  animation:chatThinking 1.2s infinite ease-in-out;
}

.thinking-content span:nth-child(2){
  animation-delay:.15s;
}

.thinking-content span:nth-child(3){
  animation-delay:.3s;
}

.thinking-content em{
  margin-left:6px;
  font-size:11px;
  font-style:normal;
  color:#8997c5;
}

@keyframes chatThinking{
  0%,60%,100%{
    opacity:.35;
    transform:translateY(0);
  }

  30%{
    opacity:1;
    transform:translateY(-3px);
  }
}

/* Mobile */

@media (max-width:640px){

  .ai-chat-header{
    padding:15px;
  }

  .ai-chat-status{
    display:none;
  }

  .chat-document-bar{
    align-items:flex-start;
    flex-direction:column;
    padding:14px 15px;
  }

  .chat-select-btn{
    width:100%;
    justify-content:center;
  }

  .chat-messages{
    padding:18px;
  }

  .chat-bubble{
    max-width:90%;
  }

  .chat-input-area{
    padding:14px;
  }
.ai-chat-actions{
  gap:6px;
}

.chat-clear-btn{
  padding:0 9px;
  font-size:10px;
}

.ai-chat-status{
  display:none;
}
  .chat-send-btn{
    padding:0 14px;
  }
}
`;
