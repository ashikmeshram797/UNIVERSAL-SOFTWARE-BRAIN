import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Message = { id: number; role: "bot" | "user"; text: string };
type RecentQuestion = { id: number; text: string; time: string };


/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, no external dependency)                         */
/* ------------------------------------------------------------------ */
type IconProps = { size?: number; children: React.ReactNode; fill?: string };
const Icon = ({ size = 22, children, fill = "none" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const GraduationCap = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </Icon>
);
const SearchIcon = () => (
  <Icon size={20}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const BellIcon = () => (
  <Icon size={26}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);
const ChevronDown = ({ size = 18 }: { size?: number }) => (
  <Icon size={size}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
 

const BookOpen = ({ size = 28 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </Icon>
);

const FileText = ({ size = 28 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8M16 13H8M16 17H8" />
  </Icon>
);
 
const MessageIcon = () => (
  <Icon size={22}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.6} />
  </Icon>
);
const TrashIcon = () => (
  <Icon size={15}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </Icon>
);
const HistoryIcon = () => (
  <Icon size={26}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </Icon>
);
const BotIcon = () => (
  <Icon size={28}>
    <path d="M12 8V4H8" />
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
  </Icon>
);
const SparkleIcon = () => (
  <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 14c1.6 7.4 4.6 10.4 12 12-7.4 1.6-10.4 4.6-12 12-1.6-7.4-4.6-10.4-12-12 7.4-1.6 10.4-4.6 12-12z" />
    <path d="M35 6c.6 3 1.8 4.2 4.8 4.8-3 .6-4.2 1.8-4.8 4.8-.6-3-1.8-4.2-4.8-4.8 3-.6 4.2-1.8 4.8-4.8z" />
  </svg>
);
const PaperclipIcon = () => (
  <Icon size={22}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </Icon>
);
const SendIcon = () => (
  <Icon size={20}>
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </Icon>
);

/* Glowing brain illustration for the banner */
const BrainArt = () => (
  <svg viewBox="0 0 420 160" className="sa-brain" aria-hidden="true">
    <defs>
      <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5ab0ff" />
        <stop offset="1" stopColor="#9b6bff" />
      </linearGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* orbit + waves */}
    <path d="M0 110 C60 60, 110 140, 170 100 S 270 40, 330 70" fill="none" stroke="#3b56d9" strokeOpacity=".55" strokeWidth="1.2" />
    <ellipse cx="300" cy="80" rx="105" ry="48" transform="rotate(-14 300 80)" fill="none" stroke="#6b7dff" strokeOpacity=".7" strokeWidth="1.3" />
    {/* brain */}
    <g filter="url(#glow)" fill="none" stroke="url(#brainGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M300 30 C285 18, 258 22, 252 42 C234 44, 226 66, 238 80 C228 96, 240 118, 258 118 C264 134, 290 138, 300 122" />
      <path d="M300 30 C315 18, 342 22, 348 42 C366 44, 374 66, 362 80 C372 96, 360 118, 342 118 C336 134, 310 138, 300 122" />
      <path d="M300 30 V122" strokeWidth="2.4" />
      <path d="M252 42 C262 50, 268 56, 282 54" strokeWidth="2.2" />
      <path d="M238 80 C252 76, 262 82, 270 92" strokeWidth="2.2" />
      <path d="M258 118 C266 108, 276 104, 288 106" strokeWidth="2.2" />
      <path d="M348 42 C338 50, 332 56, 318 54" strokeWidth="2.2" />
      <path d="M362 80 C348 76, 338 82, 330 92" strokeWidth="2.2" />
      <path d="M342 118 C334 108, 324 104, 312 106" strokeWidth="2.2" />
    </g>
    {/* circuit nodes */}
    <g fill="#0a1650" stroke="#8fb4ff" strokeWidth="2">
      <circle cx="270" cy="62" r="4.5" />
      <circle cx="262" cy="92" r="4.5" />
      <circle cx="282" cy="108" r="4.5" />
      <circle cx="330" cy="62" r="4.5" />
      <circle cx="340" cy="96" r="4.5" />
      <circle cx="318" cy="110" r="4.5" />
    </g>
    {/* sparkles */}
    <g fill="#bcd0ff">
      <path d="M178 40 l2.2 6.2 6.2 2.2 -6.2 2.2 -2.2 6.2 -2.2 -6.2 -6.2 -2.2 6.2 -2.2z" />
      <path d="M392 24 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8z" />
      <circle cx="200" cy="124" r="2" />
      <circle cx="405" cy="96" r="1.8" />
      <circle cx="215" cy="20" r="1.5" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const SUBJECTS: Record<string, string[]> = {
  Mathematics: ["Quadratic Equations", "Linear Equations", "Trigonometry", "Probability", "Calculus Basics"],
  Physics: ["Newton's Laws", "Thermodynamics", "Optics", "Electricity"],
  Chemistry: ["Periodic Table", "Chemical Bonding", "Acids and Bases", "Stoichiometry"],
  Biology: ["Cell Structure", "Genetics", "Photosynthesis", "Human Anatomy"],
};





const getLoggedInUserFirstName = () => {
  try {
    const userData = localStorage.getItem("user");

    if (!userData) {
      return "Student";
    }

    const user = JSON.parse(userData);

    const fullName =
      user.full_name ||
      user.fullName ||
      user.name ||
      "";

    return fullName.trim().split(" ")[0] || "Student";
  } catch (error) {
    console.error("User data error:", error);
    return "Student";
  }
};

const USER_NAME = getLoggedInUserFirstName();

/* ------------------------------------------------------------------ */
/*  Dropdown                                                           */
/* ------------------------------------------------------------------ */
type SelectProps = {
  label: string;
  value: string;
  options: string[];
  icon: React.ReactNode;
  onChange: (v: string) => void;
};

const Select = ({ label, value, options, icon, onChange }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="sa-select" ref={ref}>
      <button type="button" className="sa-select-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="sa-select-icon">{icon}</span>
        <span className="sa-select-text">
          <small>{label}</small>
          <strong>{value}</strong>
        </span>
        <span className={"sa-chevron" + (open ? " open" : "")}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <ul className="sa-menu" role="listbox">
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                className={o === value ? "active" : ""}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function StudyAssistant() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState<string>("Mathematics");
  const [topic, setTopic] = useState<string>("Quadratic Equations");
  const [recent, setRecent] = useState<RecentQuestion[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Hi " + USER_NAME + "! 👋\nI'm your Study Assistant. Ask me anything about studies, and I'll explain it step by step in simple terms.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);
  useEffect(() => {
  loadRecentConversations();
}, []);
const formatConversationTime = (dateString: string) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
};

  const changeSubject = (s: string) => {
    setSubject(s);
    setTopic(SUBJECTS[s][0]);
    setMessages((m) => [
      { ...m[0], text: "Hi " + USER_NAME + "! 👋\nI'm your Study Assistant. Ask me anything about " + s + ", and I'll explain it step by step in simple terms." },
      ...m.slice(1),
    ]);
  };
  const loadRecentConversations = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/study/conversations",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log(
      "Recent Conversations Response:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Unable to load recent conversations"
      );
    }

    const conversations: RecentQuestion[] =
      (data.conversations || []).map(
        (conversation: any) => ({
          id: conversation.id,
          text:
            conversation.title ||
            "New Study Chat",
          time:
            formatConversationTime(
              conversation.updated_at
            ),
        })
      );

    setRecent(conversations);

  } catch (error) {
    console.error(
      "Recent Conversations Error:",
      error
    );
  }
};
const loadConversation = async (
  id: number
) => {
  try {
    setTyping(true);
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first.");
  return;
}
    const response = await fetch(
      `http://127.0.0.1:5000/api/education/study/conversations/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log(
      "Load Conversation Response:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to load conversation"
      );
    }

    // Save selected conversation ID
    setConversationId(
      data.conversation.id
    );

    // Restore subject
    if (data.conversation.subject) {
      setSubject(
        data.conversation.subject
      );
    }

    // Restore topic
    if (data.conversation.topic) {
      setTopic(
        data.conversation.topic
      );
    }

    // Convert backend messages
    const loadedMessages: Message[] =
      data.messages.map(
        (message: any) => ({
          id: message.id,
          role:
            message.role === "user"
              ? "user"
              : "bot",
          text: message.message,
        })
      );

    setMessages(loadedMessages);

  } catch (error) {
    console.error(
      "Load Conversation Error:",
      error
    );
  } finally {
    setTyping(false);
  }
};
const startNewConversation = () => {
  setConversationId(null);

  setSubject("Mathematics");
  setTopic("Quadratic Equations");

  setMessages([
    {
      id: 0,
      role: "bot",
      text:
        "Hi " +
        USER_NAME +
        "! 👋\nI'm your Study Assistant. Ask me anything about Mathematics, and I'll explain it step by step in simple terms.",
    },
  ]);

  setInput("");
  setTyping(false);
};
   const send = async (raw?: string) => {
  const text = (raw ?? input).trim();

  if (!text || typing) return;

  // Get JWT token
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    return;
  }

  const id = Date.now();

  // Show user question immediately
  setMessages((m) => [
    ...m,
    {
      id,
      role: "user",
      text,
    },
  ]);

  setInput("");
  setTyping(true);

  try {
    let currentConversationId = conversationId;

    // -------------------------------------------------
    // 1. Create conversation if this is a new chat
    // -------------------------------------------------

    if (!currentConversationId) {
      const createResponse = await fetch(
        "http://127.0.0.1:5000/api/education/study/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: text,
            subject,
            topic,
          }),
        }
      );

      const createData = await createResponse.json();

      console.log(
        "Create Conversation Response:",
        createData
      );

      if (!createResponse.ok) {
        throw new Error(
          createData.message ||
          "Unable to create conversation"
        );
      }

      currentConversationId =
        createData.conversation.id;

      setConversationId(currentConversationId);
    }

    // -------------------------------------------------
    // 2. Send question to conversation API
    // -------------------------------------------------

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/study/conversations/${currentConversationId}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: text,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Conversation Ask API Response:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Unable to get response from Study Assistant"
      );
    }

    const answer =
      data.answer || "No answer received.";

    // -------------------------------------------------
    // 3. Update Recent Questions
    // -------------------------------------------------

    setRecent((r) =>
      [
        {
          id: currentConversationId!,
          text,
          time: "Just now",
        },
        ...r.filter(
          (item) =>
            item.id !== currentConversationId
        ),
      ].slice(0, 6)
    );

    // -------------------------------------------------
    // 4. Create bot message
    // -------------------------------------------------

    const botId = id + 1;

    setMessages((m) => [
      ...m,
      {
        id: botId,
        role: "bot",
        text: "",
      },
    ]);

    // -------------------------------------------------
    // 5. Typing animation
    // -------------------------------------------------

    let index = 0;

    const typingInterval = window.setInterval(() => {
      index += 2;

      const currentText =
        answer.slice(0, index);

      setMessages((m) =>
        m.map((message) =>
          message.id === botId
            ? {
                ...message,
                text: currentText,
              }
            : message
        )
      );

      if (index >= answer.length) {
        window.clearInterval(typingInterval);
        setTyping(false);
      }
    }, 15);

  } catch (error) {
    console.error(
      "Study Assistant API Error:",
      error
    );

    setMessages((m) => [
      ...m,
      {
        id: id + 1,
        role: "bot",
        text:
          "Sorry, I couldn't process your question right now. Please make sure the Education backend is running and try again.",
      },
    ]);

    setTyping(false);
  }
};

  const hasConversation = messages.length > 1;

  return (
    <div className="sa-root">
      <style>{CSS}</style>

      {/* ---------- Top bar ---------- */}
      <header className="sa-top">
        <div className="sa-brand">
          <div className="sa-logo">
            <GraduationCap size={30} />
          </div>
          <div>
            <h1>Universal Software Brain</h1>
            <p>Build • Learn • Create • Grow</p>
            <button
    className="sa-back-btn"
    onClick={() => navigate("/ai-workspace/education")}
  >
    ← Back to Education
  </button>
          </div>
        </div>

        <label className="sa-search">
          <SearchIcon />
          <input type="text" placeholder="Search anything in Education..." />
          <kbd>Ctrl K</kbd>
        </label>

        <div className="sa-top-right">
          <button className="sa-bell" aria-label="Notifications">
            <BellIcon />
            <span className="sa-dot" />
          </button>
          <button className="sa-user">
            <span className="sa-avatar">{USER_NAME[0]}</span>
            <span className="sa-user-name">{USER_NAME}</span>
            <ChevronDown />
          </button>
        </div>
      </header>

      <div className="sa-body">
      

        {/* ---------- Main ---------- */}
        <main className="sa-main">
          {/* Banner */}
          <section className="sa-banner">
            <div className="sa-banner-icon">
              <BookOpen size={46} />
            </div>
            <div className="sa-banner-text">
              <h2>Study Assistant</h2>
              <p>Ask questions, get clear explanations and learn better.</p>
            </div>
            <BrainArt />
          </section>

          <div className="sa-grid">
            <div className="sa-left">
              {/* Selectors */}
              <section className="sa-card sa-selectors">
                <Select label="Subject" value={subject} options={Object.keys(SUBJECTS)} icon={<GraduationCap size={30} />} onChange={changeSubject} />
                <Select label="Topic" value={topic} options={SUBJECTS[subject]} icon={<FileText size={26} />} onChange={setTopic} />
              </section>

              {/* Chat */}
              <section className="sa-card sa-chat">
                <div className="sa-messages" ref={scrollRef}>
                  {messages.map((m) => (
                    <div key={m.id} className={"sa-msg " + m.role}>
                      {m.role === "bot" && (
                        <div className="sa-bot">
                          <BotIcon />
                        </div>
                      )}
                       <div className="sa-bubble">
  {m.role === "bot" ? (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {m.text}
    </ReactMarkdown>
  ) : (
    <p>{m.text}</p>
  )}
</div>
                    </div>
                  ))}
                  {typing && (
                    <div className="sa-msg bot">
                      <div className="sa-bot">
                        <BotIcon />
                      </div>
                      <div className="sa-bubble sa-typing">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  )}

                  {!hasConversation && (
                    <div className="sa-empty">
                      <SparkleIcon />
                      <h3>Ask a question to get started</h3>
                      <p>I can explain concepts, solve problems, give examples and much more...</p>
                    </div>
                  )}
                </div>

                <div className="sa-input">
                  <button className="sa-clip" aria-label="Attach file">
                    <PaperclipIcon />
                  </button>
                  <input
                    type="text"
                    value={input}
                    placeholder="Ask your question here..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                  />
                  <button className="sa-send" onClick={() => send()} aria-label="Send question">
                    <SendIcon />
                  </button>
                </div>
              </section>
            </div>

            {/* Recent questions */}
            <aside className="sa-card sa-recent">
               <div className="sa-recent-head">
  <HistoryIcon />

  <h3>Recent Chats</h3>

  <button onClick={startNewConversation}>
    + New
  </button>

  <button onClick={() => setRecent([])}>
    <TrashIcon /> Clear
  </button>
</div>
              <ul>
                {recent.map((r) => (
                  <li key={r.id}>
                    <button
  onClick={() => loadConversation(r.id)}
>
                      <span className="sa-q-icon">
                        <MessageIcon />
                      </span>
                      <span className="sa-q-text">{r.text}</span>
                      <span className="sa-q-time">{r.time}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const CSS = `
.sa-root{
  --bg:#050a26; --bg2:#060d30; --panel:rgba(9,22,74,.55); --panel-solid:#0a1646;
  --line:#16307f; --line-soft:#12266b; --text:#f2f5ff; --muted:#8a9bd6; --icon:#8fa6ff;
  --accent:#7b5cff; --accent2:#4f6bff;
  min-height:100vh; color:var(--text);
  font-family:"Inter","Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;
  background:radial-gradient(1200px 500px at 70% 100%,#0a1650 0%,transparent 70%),linear-gradient(180deg,#040820 0%,#050b2b 100%);
}
.sa-root *{box-sizing:border-box}
.sa-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.sa-root ul{list-style:none;margin:0;padding:0}
.sa-root h1,.sa-root h2,.sa-root h3,.sa-root p{margin:0}

/* top bar */
.sa-top{height:82px;display:flex;align-items:center;gap:40px;padding:0 26px;border-bottom:1px solid var(--line-soft);background:rgba(4,9,36,.9)}
.sa-brand{display:flex;align-items:center;gap:14px;width:256px;flex:none}
.sa-logo{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#6c4bff,#4a63ff);box-shadow:0 0 22px rgba(108,75,255,.55)}
.sa-brand h1{font-size:18px;font-weight:700;letter-spacing:.1px;white-space:nowrap}
.sa-brand p{font-size:12.5px;color:var(--muted);margin-top:3px;white-space:nowrap}
.sa-search{flex:0 1 765px;height:46px;display:flex;align-items:center;gap:12px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:rgba(10,22,74,.5);color:var(--muted)}
.sa-search input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--text);font-size:15px}
.sa-search input::placeholder{color:#7d8ec9}
.sa-search kbd{font:inherit;font-size:13px;padding:4px 8px;border-radius:7px;border:1px solid var(--line);background:rgba(30,50,130,.45);color:#9fb0e6}
.sa-top-right{margin-left:auto;display:flex;align-items:center;gap:30px}
.sa-bell{position:relative;color:#b5c3ff;display:grid;place-items:center}
.sa-dot{position:absolute;top:-3px;right:-2px;width:12px;height:12px;border-radius:50%;background:#ff3358;border:2px solid #050a26}
.sa-user{display:flex;align-items:center;gap:12px}
.sa-avatar{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-weight:600;font-size:20px;background:linear-gradient(135deg,#7b5cff,#5d7bff)}
.sa-user-name{font-size:17px;font-weight:600}
.sa-back-btn{
  margin-top:6px;
  padding:0;
  font-size:12px;
  color:#9fb0ff;
  cursor:pointer;
  text-align:left;
}

.sa-back-btn:hover{
  color:#ffffff;
}

/* layout */
.sa-body{display:flex;min-height:calc(100vh - 82px)}
.sa-side{width:282px;flex:none;padding:14px 14px 20px;border-right:1px solid var(--line-soft);background:rgba(4,9,36,.75)}
.sa-back{display:flex;align-items:center;gap:8px;color:#a9b8f0;font-size:15px;padding:4px 12px}
.sa-back-link{margin-bottom:12px}
.sa-agent{display:flex;align-items:center;gap:14px;padding:10px 12px;border-radius:14px;border:1px solid #233c9b;background:linear-gradient(90deg,rgba(77,69,220,.38),rgba(20,40,120,.35))}
.sa-agent-icon{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#4a58f0,#3a3fc0);color:#fff;border:1px solid #6e7cff}
.sa-agent strong{display:block;font-size:17px;font-weight:600}
.sa-agent span{display:block;font-size:12.5px;color:var(--muted);margin-top:4px}
.sa-nav{margin-top:18px;display:flex;flex-direction:column;gap:4px}
.sa-nav button{display:flex;align-items:center;gap:22px;height:53px;padding:0 12px;border-radius:12px;font-size:17px;color:#dfe6ff;text-align:left;transition:background .15s}
.sa-nav button svg{color:var(--icon);flex:none}
.sa-nav button:hover{background:rgba(60,80,200,.15)}
.sa-nav button.on{background:rgba(70,90,230,.22)}
.sa-rule{height:1px;background:var(--line-soft);margin:22px 12px 4px}

.sa-main{flex:1;min-width:0;padding:20px}
.sa-grid{display:grid;grid-template-columns:minmax(0,1fr) 392px;gap:20px;margin-top:20px;align-items:stretch}
.sa-left{display:flex;flex-direction:column;gap:14px;min-width:0}
.sa-card{border:1px solid var(--line);border-radius:18px;background:var(--panel)}

/* banner */
.sa-banner{position:relative;overflow:hidden;height:156px;display:flex;align-items:center;gap:30px;padding:0 44px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(100deg,#0a1650 0%,#0b1a66 55%,#10206f 100%)}
.sa-banner-icon{width:91px;height:92px;flex:none;border-radius:22px;display:grid;place-items:center;color:#e9efff;background:linear-gradient(135deg,#1f4cd8,#2a3fb5);border:1px solid #4c72ff;box-shadow:0 0 30px rgba(60,100,255,.45)}
.sa-banner-text{position:relative;z-index:1}
.sa-banner-text h2{font-size:34px;font-weight:700;letter-spacing:-.3px}
.sa-banner-text p{margin-top:10px;font-size:18px;color:#b2c0ee}
.sa-brain{position:absolute;right:10px;top:0;height:100%;width:auto;max-width:55%}

/* selectors */
.sa-selectors{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:14px 20px}
.sa-select{position:relative}
.sa-select-btn{width:100%;height:58px;display:flex;align-items:center;gap:14px;padding:0 18px 0 12px;border:1px solid var(--line);border-radius:14px;background:rgba(12,28,92,.6);text-align:left}
.sa-select-btn:hover{border-color:#2c4bc4}
.sa-select-icon{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#c8d4ff;background:rgba(40,62,170,.35);flex:none}
.sa-select-text{flex:1;min-width:0}
.sa-select-text small{display:block;font-size:13px;color:var(--muted)}
.sa-select-text strong{display:block;font-size:17px;font-weight:500;margin-top:2px}
.sa-chevron{transition:transform .15s;color:#dfe6ff;display:grid}
.sa-chevron.open{transform:rotate(180deg)}
.sa-menu{position:absolute;z-index:20;left:0;right:0;top:calc(100% + 6px);padding:6px;border:1px solid var(--line);border-radius:14px;background:#0a1650;box-shadow:0 18px 40px rgba(0,0,10,.6)}
.sa-menu button{width:100%;text-align:left;padding:10px 12px;border-radius:9px;font-size:15px;color:#d5defc}
.sa-menu button:hover{background:rgba(80,100,240,.22)}
.sa-menu button.active{background:rgba(110,90,255,.3);color:#fff}

/* chat */
.sa-chat{display:flex;flex-direction:column;padding:18px 20px 26px;min-height:555px;flex:1}
.sa-messages{
  flex:1;
  min-height:0;
  max-height:520px;
  overflow-y:auto;
  overflow-x:hidden;
  display:flex;
  flex-direction:column;
  gap:16px;
  padding:0 8px 0 2px;
  scroll-behavior:smooth;
}
.sa-messages::-webkit-scrollbar{
  width:6px;
}

.sa-messages::-webkit-scrollbar-track{
  background:transparent;
}

.sa-messages::-webkit-scrollbar-thumb{
  background:rgba(143,166,255,.25);
  border-radius:10px;
}

.sa-messages::-webkit-scrollbar-thumb:hover{
  background:rgba(143,166,255,.45);
}
.sa-msg{display:flex;gap:16px;align-items:flex-start}
.sa-msg.user{justify-content:flex-end}
.sa-bot{width:58px;height:58px;flex:none;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#4c4cf0,#3a35b8);border:1px solid #6e7cff}
.sa-bubble{max-width:540px;padding:16px 22px;border:1px solid #1f3aa8;border-radius:16px;background:rgba(17,36,120,.55);font-size:16px;line-height:1.55;color:#dfe6ff}
.sa-bubble h1,
.sa-bubble h2,
.sa-bubble h3 {
  margin: 14px 0 8px;
  color: #ffffff;
  font-weight: 700;
}

.sa-bubble h1 {
  font-size: 22px;
}

.sa-bubble h2 {
  font-size: 19px;
}

.sa-bubble h3 {
  font-size: 17px;
}

.sa-bubble p {
  margin: 7px 0;
}

.sa-bubble ul,
.sa-bubble ol {
  margin: 8px 0;
  padding-left: 24px;
}

.sa-bubble li {
  margin: 5px 0;
}

.sa-bubble strong {
  color: #ffffff;
  font-weight: 700;
}

.sa-bubble code {
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
}

.sa-bubble pre {
  overflow-x: auto;
  padding: 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
}
.sa-bubble .katex-display {
  margin: 14px 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 0;
}

.sa-bubble .katex {
  color: #ffffff;
}
.sa-bubble p.hi{font-weight:600;color:#fff;margin-bottom:4px}
.sa-msg.user .sa-bubble{background:linear-gradient(135deg,#5d48e8,#4658ee);border-color:#7a78ff;color:#fff}
.sa-typing{display:flex;gap:6px;align-items:center;padding:20px 22px}
.sa-typing i{width:8px;height:8px;border-radius:50%;background:#8fa6ff;animation:sa-b 1s infinite ease-in-out}
.sa-typing i:nth-child(2){animation-delay:.15s}
.sa-typing i:nth-child(3){animation-delay:.3s}
@keyframes sa-b{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
.sa-empty{margin:auto;padding:30px 0;text-align:center;color:var(--muted)}
.sa-empty svg{color:#7b84ff;filter:drop-shadow(0 0 10px rgba(123,132,255,.6))}
.sa-empty h3{margin-top:12px;font-size:18px;font-weight:600;color:#dfe6ff}
.sa-empty p{margin-top:10px;font-size:15px;max-width:380px;margin-inline:auto;line-height:1.55}
.sa-input{display:flex;align-items:center;gap:14px;height:76px;padding:0 14px 0 22px;border:1px solid var(--line);border-radius:18px;background:rgba(8,20,72,.8)}
.sa-input:focus-within{border-color:#4a63ff;box-shadow:0 0 0 3px rgba(74,99,255,.2)}
.sa-clip{color:#b5c3ff;display:grid}
.sa-input input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font-size:16px;padding:0 6px}
.sa-input input::placeholder{color:#7d8ec9}
.sa-send{width:60px;height:48px;border-radius:24px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#8a5cff,#6a4af0);box-shadow:0 0 18px rgba(123,92,255,.5)}
.sa-send:hover{filter:brightness(1.12)}

/* recent */
.sa-recent{padding:18px 14px;min-height:655px}
.sa-recent-head{display:flex;align-items:center;gap:14px;padding:0 6px 16px;border-bottom:1px solid var(--line-soft);color:var(--icon)}
.sa-recent-head h3{flex:1;font-size:18px;font-weight:600;color:#fff}
.sa-recent-head button{display:flex;align-items:center;gap:6px;font-size:14px;color:#9fb0ff}
.sa-recent-head button:hover{color:#fff}
.sa-recent li{border-bottom:1px solid var(--line-soft)}
.sa-recent li button{width:100%;display:flex;align-items:center;gap:14px;padding:18px 6px;text-align:left;border-radius:10px}
.sa-recent li button:hover{background:rgba(70,90,230,.12)}
.sa-q-icon{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;color:#8fa6ff;background:rgba(40,62,170,.3)}
.sa-q-text{flex:1;min-width:0;font-size:14px;color:#e4eaff;line-height:1.35}
.sa-q-time{font-size:12px;color:var(--muted);white-space:nowrap;align-self:center}

/* responsive */
@media (max-width:1180px){
  .sa-grid{grid-template-columns:1fr}
  .sa-recent{min-height:0}
  .sa-brain{opacity:.5}
}
@media (max-width:860px){
  .sa-side{display:none}
  .sa-top{gap:16px;padding:0 14px}
  .sa-brand{width:auto}
  .sa-brand p,.sa-search kbd,.sa-user-name{display:none}
  .sa-selectors{grid-template-columns:1fr;gap:12px}
  .sa-banner{padding:0 20px;gap:16px}
  .sa-banner-icon{width:64px;height:64px}
  .sa-banner-text h2{font-size:24px}
  .sa-banner-text p{font-size:14px}
  .sa-brain{display:none}
  .sa-bubble{max-width:100%}
}
`;
