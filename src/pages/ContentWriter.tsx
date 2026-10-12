import React, { useMemo, useState } from "react";



type FormatId =
  | "blog"
  | "social"
  | "email"
  | "marketing"
  | "website"
  | "product";

type TabId = "write" | "post" | "history" | "saved";

type Draft = {
  id: string;
  title: string;
  format: FormatId;
  content: string;
  ago: string;
};

const FORMATS: {
  id: FormatId;
  title: string;
  blurb: string;
  sample: string;
  icon: string;
}[] = [
  {
    id: "blog",
    title: "Blog Post",
    blurb: "Informative, SEO-friendly articles",
    sample: "Benefits of AI in Education",
    icon: "▤",
  },
  {
    id: "social",
    title: "Social Media Post",
    blurb: "Short & engaging content",
    sample: "Study Tips for Engineering Students",
    icon: "⌯",
  },
  {
    id: "email",
    title: "Email Draft",
    blurb: "Professional email templates",
    sample: "Internship Inquiry",
    icon: "✉",
  },
  {
    id: "marketing",
    title: "Marketing Copy",
    blurb: "Ads, product description, slogans",
    sample: "AI Study Assistant",
    icon: "✦",
  },
  {
    id: "website",
    title: "Website Content",
    blurb: "Landing pages, about us, etc.",
    sample: "Universal Software Brain",
    icon: "▣",
  },
  {
    id: "product",
    title: "Product Description",
    blurb: "E-commerce product details",
    sample: "Smart Laptop for Students",
    icon: "◇",
  },
];

const TONES = [
  "Professional",
  "Friendly",
  "Casual",
  "Persuasive",
  "Academic",
  "Creative",
];

const LANGUAGES = ["English", "Hindi", "Marathi"];

const WORD_RANGES = [
  "100 - 200 words",
  "200 - 400 words",
  "500 - 800 words",
  "800 - 1200 words",
  "1200+ words",
];

const SEED_DRAFTS: Draft[] = [
  {
    id: "seed-1",
    title: "AI in Education Blog",
    format: "blog",
    content:
      "Artificial Intelligence is transforming education by helping students learn faster, practice effectively, and receive personalized support.",
    ago: "2 hours ago",
  },
  {
    id: "seed-2",
    title: "Social Media Post - Study Tips",
    format: "social",
    content:
      "Study smarter, not harder. Break difficult topics into smaller goals, practice regularly, and track your progress.",
    ago: "5 hours ago",
  },
  {
    id: "seed-3",
    title: "Product Description - Laptop",
    format: "product",
    content:
      "A reliable student laptop designed for everyday productivity, coding, learning, and creative work.",
    ago: "1 day ago",
  },
  {
    id: "seed-4",
    title: "Email Draft - Internship Inquiry",
    format: "email",
    content:
      "Dear Sir/Madam,\n\nI am writing to inquire about internship opportunities at your organization.",
    ago: "2 days ago",
  },
];

function Icon({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        flex: "0 0 auto",
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function makeContent(
  format: FormatId,
  topic: string,
  tone: string,
  language: string,
  wordRange: string,
  extra: string
) {
  const formatName =
    FORMATS.find((item) => item.id === format)?.title ?? "Content";

  if (language !== "English") {
    return `[${language} AI generation will be connected from the backend]\n\n${formatName}: ${topic}\n\nTone: ${tone}\nWord count: ${wordRange}\n\nAdditional instructions: ${extra || "None"}`;
  }

  if (format === "email") {
    return `Subject: ${topic}

Dear Sir/Madam,

I am writing regarding ${topic}. I would like to share the following information and request your consideration.

The purpose of this email is to communicate the key details clearly and professionally. Please let me know if any additional information is required.

Thank you for your time and consideration.

Regards,
Ashik`;
  }

  if (format === "social") {
    return `🚀 ${topic}

Discover practical ideas, useful insights, and simple strategies that can help you move forward.

Stay consistent, keep learning, and turn your knowledge into real results.

#Learning #Technology #AI #Students`;
  }

  if (format === "marketing") {
    return `${topic}

Work smarter. Create faster. Achieve more.

Designed to deliver a simple, powerful experience for modern users, ${topic} helps turn ideas into meaningful results.

Key benefits:
• Easy to use
• Fast and practical
• Designed for real-world needs
• Focused on better productivity

${extra || "Make your message clear, useful, and memorable."}`;
  }

  if (format === "product") {
    return `${topic}

A practical solution designed for users who value performance, reliability, and ease of use.

Key Features:
• Modern and user-friendly design
• Reliable everyday performance
• Suitable for students and professionals
• Easy to use and maintain

Why choose it?
It combines useful features with a simple experience to help users get more done.`;
  }

  if (format === "website") {
    return `${topic}

Build a stronger digital experience with clear information, useful features, and an intuitive user journey.

Our goal is to make technology simple, accessible, and valuable for every user.

What you get:
• Clean and intuitive experience
• Useful tools and resources
• Fast and organized workflow
• Designed around user needs`;
  }

  return `${topic}

Introduction

Artificial Intelligence and modern technology are changing the way people learn, work, and solve problems. This topic has become increasingly important because it can improve productivity, access to information, and decision-making.

Key Points

First, technology can simplify complex tasks by providing structured information and useful recommendations. Second, users can save time by automating repetitive activities. Finally, intelligent systems can provide personalized experiences based on individual requirements.

Practical Benefits

A well-designed solution can help users understand concepts faster, organize their work, and make better decisions. It can also provide a consistent experience across different tasks and workflows.

Conclusion

${topic} is an important area with significant potential. With the right approach, users can combine technology, creativity, and practical knowledge to achieve better outcomes.

${extra ? `Additional focus: ${extra}` : ""}`;
}

export default function ContentWriter() {
  const [tab, setTab] = useState<TabId>("write");
  const [formatId, setFormatId] = useState<FormatId>("blog");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [wordRange, setWordRange] = useState(WORD_RANGES[2]);
  const [extra, setExtra] = useState("");

  const [output, setOutput] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>(SEED_DRAFTS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [publishedIds, setPublishedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const format = useMemo(
    () => FORMATS.find((item) => item.id === formatId) ?? FORMATS[0],
    [formatId]
  );

  const currentDraft = drafts.find((item) => item.content === output);
  const isSaved = currentDraft ? savedIds.includes(currentDraft.id) : false;
  const isPublished = currentDraft
    ? publishedIds.includes(currentDraft.id)
    : false;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const generate = () => {
    if (!topic.trim()) {
      showToast("Please enter a topic or title.");
      return;
    }

    setBusy(true);

    window.setTimeout(() => {
      const content = makeContent(
        formatId,
        topic.trim(),
        tone,
        language,
        wordRange,
        extra.trim()
      );

      const draft: Draft = {
        id: `draft-${Date.now()}`,
        title: `${format.title} - ${topic.trim()}`,
        format: formatId,
        content,
        ago: "Just now",
      };

      setDrafts((prev) => [draft, ...prev]);
      setOutput(content);
      setBusy(false);
      showToast("Content generated successfully.");
    }, 700);
  };

  const useTemplate = () => {
    setTopic(format.sample);
  };

  const copyContent = async () => {
    if (!output) {
      showToast("Generate content first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      showToast("Copied to clipboard.");
    } catch {
      showToast("Copy is blocked. Select the content and copy it.");
    }
  };

  const downloadContent = () => {
    if (!output) {
      showToast("Generate content first.");
      return;
    }

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.trim() || "content"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("Download started.");
  };

  const saveContent = () => {
    if (!currentDraft) {
      showToast("Generate content first.");
      return;
    }

    setSavedIds((prev) =>
      prev.includes(currentDraft.id)
        ? prev.filter((id) => id !== currentDraft.id)
        : [currentDraft.id, ...prev]
    );

    showToast(
      savedIds.includes(currentDraft.id)
        ? "Removed from Saved."
        : "Saved successfully."
    );
  };

  const publishContent = () => {
    if (!currentDraft) {
      showToast("Generate content first.");
      return;
    }

    if (publishedIds.includes(currentDraft.id)) {
      showToast("Already published.");
      return;
    }

    setPublishedIds((prev) => [currentDraft.id, ...prev]);
    showToast("Published successfully.");
  };

  const openDraft = (draft: Draft) => {
    setFormatId(draft.format);
    setTopic(draft.title.replace(/^.*? - /, ""));
    setOutput(draft.content);
    setTab("write");
  };

  const selectFormat = (id: FormatId, sample = "") => {
    setFormatId(id);
    if (sample) setTopic(sample);
    setTab("write");
  };

  const listByIds = (ids: string[]) =>
    ids
      .map((id) => drafts.find((draft) => draft.id === id))
      .filter(Boolean) as Draft[];

  return (
    <div className="cw-app">
      <style>{`
        * { box-sizing: border-box; }

        .cw-app {
          min-height: 100vh;
          color: #eef3ff;
          background:
            radial-gradient(circle at 20% 0%, rgba(60, 72, 180, .20), transparent 28%),
            radial-gradient(circle at 85% 15%, rgba(0, 115, 255, .12), transparent 25%),
            #020b21;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 32px;
        }

        .cw-topbar {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: 0 28px;
          border-bottom: 1px solid rgba(99, 139, 255, .16);
          background: rgba(2, 12, 37, .90);
          backdrop-filter: blur(16px);
        }

        .cw-brand { display:flex; align-items:center; gap:12px; min-width:300px; }
        .cw-logo {
          width:48px; height:48px; border-radius:14px;
          display:grid; place-items:center;
          color:#dce7ff;
          border:1px solid rgba(129,144,255,.55);
          background:linear-gradient(145deg,#182b77,#32126d);
          box-shadow:0 0 22px rgba(72,64,255,.38);
          font-size:27px;
        }
        .cw-brand-name { font-weight:800; font-size:18px; }
        .cw-brand-tag { color:#a7b8df; font-size:12px; margin-top:2px; }

        .cw-search {
          height:42px; max-width:560px; flex:1;
          display:flex; align-items:center; gap:10px;
          padding:0 12px;
          border:1px solid #183d81;
          border-radius:10px;
          background:#071d49;
          box-shadow: inset 0 0 18px rgba(28,83,190,.10);
        }
        .cw-search input {
          flex:1; border:0; outline:0; color:#dce7ff;
          background:transparent; font-size:14px;
        }
        .cw-search input::placeholder { color:#88a0cb; }
        .cw-kbd {
          padding:4px 8px; border-radius:5px; font-size:11px;
          color:#9bb1dc; background:#0b2a61; border:1px solid #1a4487;
        }

        .cw-userbar { display:flex; align-items:center; gap:18px; }
        .cw-online {
          display:flex; align-items:center; gap:8px; padding:10px 16px;
          border-radius:22px; color:#00e9a0; font-size:13px; font-weight:700;
          background:rgba(0,205,150,.09); border:1px solid rgba(0,205,150,.13);
        }
        .cw-dot { width:9px; height:9px; border-radius:50%; background:#00e7a0; box-shadow:0 0 12px #00e7a0; }
        .cw-notify { font-size:24px; position:relative; }
        .cw-notify-dot { position:absolute; top:0; right:0; width:7px; height:7px; border-radius:50%; background:#ff3c63; }
        .cw-profile { display:flex; align-items:center; gap:10px; font-weight:700; }
        .cw-avatar {
          width:44px; height:44px; display:grid; place-items:center; border-radius:50%;
          background:linear-gradient(145deg,#287aff,#1260df); font-size:18px;
          box-shadow:0 0 22px rgba(0,114,255,.25);
        }

        .cw-shell { max-width:1500px; margin:0 auto; padding:12px 26px 0; }

        .cw-hero {
          min-height:158px; position:relative; overflow:hidden;
          display:flex; align-items:center; gap:34px;
          padding:22px 38px; border-radius:16px;
          background:linear-gradient(100deg,#132a72 0%,#28116e 55%,#0d2775 100%);
          border:1px solid rgba(98,120,255,.32);
          box-shadow:0 16px 50px rgba(0,0,0,.18);
        }
        .cw-hero:after {
          content:""; position:absolute; inset:auto -50px -75px auto;
          width:430px; height:160px;
          background:radial-gradient(ellipse,rgba(44,107,255,.35),transparent 65%);
        }
        .cw-hero-icon {
          width:112px; height:112px; border-radius:28px;
          display:grid; place-items:center; flex:0 0 auto;
          font-size:55px; color:#fff;
          background:linear-gradient(145deg,#ca32ff,#2c74ff);
          box-shadow:0 0 34px rgba(111,55,255,.62);
        }
        .cw-eyebrow { color:#26d7ff; font-weight:800; letter-spacing:2px; font-size:12px; }
        .cw-hero h1 { margin:7px 0 7px; font-size:34px; line-height:1; letter-spacing:-1px; }
        .cw-hero h1 span {
          background:linear-gradient(90deg,#b62fff,#6b8cff);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .cw-hero p { margin:0; color:#d4def4; max-width:620px; line-height:1.55; font-size:14px; }
        .cw-hero-art { margin-left:auto; position:relative; z-index:1; font-size:74px; opacity:.9; transform:rotate(-5deg); }

        .cw-workspace {
          display:grid;
          grid-template-columns:350px minmax(500px,1fr) 350px;
          gap:16px; margin-top:18px; align-items:start;
        }

        .cw-card, .cw-panel {
          border:1px solid rgba(74,117,203,.30);
          background:linear-gradient(180deg,rgba(7,26,67,.96),rgba(4,19,50,.96));
          border-radius:14px;
          box-shadow:0 12px 34px rgba(0,0,0,.18);
        }
        .cw-card { padding:18px; }
        .cw-card-head { display:flex; align-items:center; gap:10px; margin-bottom:5px; }
        .cw-card-title { font-weight:800; font-size:16px; }
        .cw-card-sub { color:#91a7ce; font-size:12px; line-height:1.55; margin:7px 0 12px; }

        .cw-format {
          width:100%; display:flex; align-items:center; gap:12px;
          padding:11px 10px; margin:7px 0; border:1px solid transparent;
          border-radius:11px; color:#dce7ff; text-align:left; cursor:pointer;
          background:rgba(9,34,82,.72);
          transition:.18s ease;
        }
        .cw-format:hover { border-color:#315ca6; transform:translateX(2px); }
        .cw-format.active {
          background:linear-gradient(100deg,#7926ef,#0879ff);
          border-color:#527aff;
          box-shadow:0 7px 22px rgba(65,65,255,.22);
        }
        .cw-format-icon {
          width:40px; height:40px; border-radius:10px; display:grid; place-items:center;
          background:linear-gradient(145deg,#6334f4,#126eff);
          font-size:20px; flex:0 0 auto;
        }
        .cw-format:nth-child(2) .cw-format-icon { background:linear-gradient(145deg,#4734ec,#0b71e8); }
        .cw-format:nth-child(3) .cw-format-icon { background:linear-gradient(145deg,#fa3b9b,#ff7b27); }
        .cw-format:nth-child(4) .cw-format-icon { background:linear-gradient(145deg,#08b99c,#2ecf7e); }
        .cw-format-text { flex:1; min-width:0; }
        .cw-format-title { display:block; font-weight:700; font-size:13px; }
        .cw-format-sub { display:block; margin-top:3px; color:#91a7ce; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cw-format.active .cw-format-sub { color:#dce7ff; }
        .cw-chevron { color:#b6c9ed; font-size:22px; }

        .cw-post-box { margin-top:10px; }
        .cw-wide-btn {
          width:100%; border:0; border-radius:10px; padding:13px;
          color:white; font-weight:800; cursor:pointer;
          background:linear-gradient(90deg,#9424f4,#087dff);
          box-shadow:0 7px 20px rgba(68,52,255,.25);
        }

        .cw-tabs {
          display:flex; border-bottom:1px solid rgba(67,106,183,.35);
          background:rgba(4,18,50,.78); border-radius:14px 14px 0 0;
        }
        .cw-tab {
          flex:1; padding:14px 8px; color:#9cb2db; background:transparent;
          border:0; cursor:pointer; font-weight:700; font-size:12px;
          border-bottom:2px solid transparent;
        }
        .cw-tab.active {
          color:#fff; background:linear-gradient(180deg,rgba(78,44,255,.48),rgba(78,44,255,.08));
          border-bottom-color:#8e43ff;
        }
        .cw-center-body { padding:14px; }

        .cw-panel { padding:16px; margin-bottom:12px; }
        .cw-panel-head { display:flex; align-items:center; gap:12px; }
        .cw-panel-icon {
          width:44px; height:44px; border-radius:10px; display:grid; place-items:center;
          background:linear-gradient(135deg,#7b31ff,#2377ff); font-size:20px;
        }
        .cw-panel-heading { flex:1; }
        .cw-panel-heading h2 { margin:0; font-size:15px; }
        .cw-panel-heading p { margin:4px 0 0; color:#8299c5; font-size:11px; }
        .cw-template-btn {
          border:1px solid #245298; color:#c6d7f7; background:#092451;
          border-radius:8px; padding:9px 11px; cursor:pointer; font-size:11px;
        }

        .cw-form-grid {
          display:grid; grid-template-columns:1.35fr .72fr; gap:13px; margin-top:17px;
        }
        .cw-field.full { grid-column:1 / -1; }
        .cw-label { display:block; color:#d8e4fa; font-weight:700; font-size:11px; margin-bottom:7px; }
        .cw-control, .cw-textarea {
          width:100%; color:#dbe8ff; background:#082454;
          border:1px solid #17447f; border-radius:8px; outline:none;
        }
        .cw-control { height:40px; padding:0 11px; }
        .cw-textarea { min-height:82px; resize:vertical; padding:11px; font-family:inherit; }
        .cw-control:focus, .cw-textarea:focus { border-color:#567dff; box-shadow:0 0 0 3px rgba(76,105,255,.12); }
        .cw-generate-row { display:flex; justify-content:flex-end; margin-top:12px; }
        .cw-generate {
          border:0; border-radius:10px; padding:12px 19px; color:#fff; font-weight:800;
          cursor:pointer; background:linear-gradient(90deg,#9d24ff,#087eff);
          box-shadow:0 8px 22px rgba(77,48,255,.28);
        }
        .cw-generate:disabled { opacity:.55; cursor:not-allowed; }

        .cw-output { min-height:195px; }
        .cw-output-body {
          min-height:125px; margin-top:13px; padding:18px;
          border:1px solid rgba(54,94,161,.30); border-radius:9px;
          background:#061a40;
          white-space:pre-wrap; line-height:1.7; font-size:13px; color:#d7e4fb;
        }
        .cw-empty { min-height:125px; display:grid; place-items:center; text-align:center; color:#849bc3; }
        .cw-empty-icon {
          width:50px; height:50px; display:grid; place-items:center; margin:0 auto 8px;
          border-radius:50%; background:rgba(78,79,255,.18); font-size:24px;
        }
        .cw-empty strong { display:block; color:#e4edff; margin-bottom:5px; }

        .cw-actions { display:flex; gap:8px; align-items:center; }
        .cw-action {
          border:1px solid #1c457f; background:#071d43; color:#d1def5;
          border-radius:8px; padding:9px 13px; cursor:pointer; font-size:11px;
        }
        .cw-action.publish { margin-left:auto; }
        .cw-action:hover { border-color:#5479ce; }

        .cw-list { list-style:none; padding:0; margin:10px 0 0; }
        .cw-row {
          width:100%; display:flex; align-items:center; gap:10px; padding:10px;
          margin:6px 0; border:1px solid rgba(53,92,160,.30); border-radius:10px;
          color:#dbe7fc; background:#061b42; text-align:left; cursor:pointer;
        }
        .cw-row:hover { border-color:#466ec1; }
        .cw-row-icon {
          width:38px; height:38px; border-radius:9px; display:grid; place-items:center;
          background:linear-gradient(145deg,#6934ef,#1476ef); flex:0 0 auto;
        }
        .cw-row-text { flex:1; min-width:0; }
        .cw-row-title { display:block; font-size:12px; font-weight:750; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cw-row-sub { display:block; color:#8097c0; font-size:10px; margin-top:3px; }
        .cw-empty-list { color:#7e95bc; font-size:12px; padding:20px 8px; text-align:center; }

        .cw-tip {
          margin-top:12px; min-height:100px; padding:18px; position:relative; overflow:hidden;
          border:1px solid rgba(81,111,212,.3); border-radius:14px;
          background:linear-gradient(135deg,#101f59,#071b4a);
        }
        .cw-tip-icon { font-size:26px; }
        .cw-tip p { margin:8px 0 0; font-size:12px; font-weight:800; line-height:1.5; }
        .cw-toast {
          position:fixed; left:50%; bottom:24px; transform:translateX(-50%);
          z-index:99; padding:12px 18px; border-radius:9px;
          background:#112b5e; border:1px solid #4775c5; color:#eaf2ff;
          box-shadow:0 12px 35px rgba(0,0,0,.35); font-size:12px;
        }

        @media (max-width: 1200px) {
          .cw-workspace { grid-template-columns:280px minmax(450px,1fr); }
          .cw-right { grid-column:1 / -1; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          .cw-tip { display:none; }
          .cw-search { max-width:380px; }
        }

        @media (max-width: 850px) {
          .cw-topbar { padding:0 14px; }
          .cw-brand { min-width:auto; }
          .cw-brand-name, .cw-brand-tag, .cw-online, .cw-profile span:not(.cw-avatar) { display:none; }
          .cw-search { max-width:none; }
          .cw-shell { padding:10px 12px; }
          .cw-hero { padding:20px; }
          .cw-hero-art { display:none; }
          .cw-workspace { grid-template-columns:1fr; }
          .cw-right { display:block; }
          .cw-form-grid { grid-template-columns:1fr; }
          .cw-field.full { grid-column:auto; }
        }
      `}</style>

      <header className="cw-topbar">
        <div className="cw-brand">
          <div className="cw-logo">⌬</div>
          <div>
            <div className="cw-brand-name">Universal Software Brain</div>
            <div className="cw-brand-tag">Build • Learn • Create • Grow</div>
          </div>
        </div>

        <label className="cw-search">
          <Icon size={19}>⌕</Icon>
          <input placeholder="Search anything..." />
          <span className="cw-kbd">Ctrl K</span>
        </label>

        <div className="cw-userbar">
          <div className="cw-online">
            <span className="cw-dot" />
            Online
          </div>
          <div className="cw-notify">
            ♧
            <span className="cw-notify-dot" />
          </div>
          <div className="cw-profile">
            <span className="cw-avatar">A</span>
            <span>Ashik</span>
            <span>⌄</span>
          </div>
        </div>
      </header>

      <main className="cw-shell">
        <section className="cw-hero">
          <div className="cw-hero-icon">▱</div>
          <div>
            <div className="cw-eyebrow">CONTENT WRITING</div>
            <h1>
              Write Better. <span>Create Greater.</span>
            </h1>
            <p>
              Generate high-quality content for blogs, articles, emails, social
              media, marketing and more — powered by AI.
            </p>
          </div>
          <div className="cw-hero-art">✎ ◫</div>
        </section>

        <div className="cw-workspace">
          <aside>
            <section className="cw-card">
              <div className="cw-card-head">
                <span>✦</span>
                <div className="cw-card-title">Create New Content</div>
              </div>
              <p className="cw-card-sub">
                Choose a format, add your details and let AI create amazing
                content for you.
              </p>

              {FORMATS.map((item) => (
                <button
                  key={item.id}
                  className={`cw-format ${
                    formatId === item.id ? "active" : ""
                  }`}
                  onClick={() => selectFormat(item.id)}
                  type="button"
                >
                  <span className="cw-format-icon">{item.icon}</span>
                  <span className="cw-format-text">
                    <span className="cw-format-title">{item.title}</span>
                    <span className="cw-format-sub">{item.blurb}</span>
                  </span>
                  <span className="cw-chevron">›</span>
                </button>
              ))}
            </section>

            <section className="cw-card cw-post-box">
              <div className="cw-card-head">
                <span>♧</span>
                <div>
                  <div className="cw-card-title">Content Post</div>
                  <div className="cw-card-sub">
                    View and manage your generated content and published posts.
                  </div>
                </div>
              </div>
              <button
                className="cw-wide-btn"
                type="button"
                onClick={() => setTab("post")}
              >
                ✦ &nbsp; View My Posts &nbsp; →
              </button>
            </section>
          </aside>

          <section className="cw-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="cw-tabs">
              {(
                [
                  ["write", "▤", "Write Content"],
                  ["post", "♧", "Post Content"],
                  ["history", "◷", "History"],
                  ["saved", "♡", "Saved"],
                ] as [TabId, string, string][]
              ).map(([id, icon, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`cw-tab ${tab === id ? "active" : ""}`}
                  onClick={() => setTab(id)}
                >
                  {icon} &nbsp; {label}
                </button>
              ))}
            </div>

            <div className="cw-center-body">
              {tab === "write" && (
                <>
                  <section className="cw-panel">
                    <div className="cw-panel-head">
                      <div className="cw-panel-icon">▤</div>
                      <div className="cw-panel-heading">
                        <h2>Generate {format.title}</h2>
                        <p>
                          Create detailed {format.title.toLowerCase()} with AI.
                        </p>
                      </div>
                      <button
                        className="cw-template-btn"
                        type="button"
                        onClick={useTemplate}
                      >
                        ▤ &nbsp; Use Template
                      </button>
                    </div>

                    <div className="cw-form-grid">
                      <div className="cw-field">
                        <label className="cw-label">💡 Topic / Title *</label>
                        <input
                          className="cw-control"
                          value={topic}
                          placeholder={format.sample}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>

                      <div className="cw-field">
                        <label className="cw-label">☺ Tone</label>
                        <select
                          className="cw-control"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                        >
                          {TONES.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="cw-field">
                        <label className="cw-label">◎ Language</label>
                        <select
                          className="cw-control"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          {LANGUAGES.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="cw-field">
                        <label className="cw-label">▣ Word Count</label>
                        <select
                          className="cw-control"
                          value={wordRange}
                          onChange={(e) => setWordRange(e.target.value)}
                        >
                          {WORD_RANGES.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="cw-field full">
                        <label className="cw-label">
                          ▤ Additional Instructions (Optional)
                        </label>
                        <textarea
                          className="cw-textarea"
                          rows={3}
                          value={extra}
                          placeholder="Add any specific points, keywords, or requirements..."
                          onChange={(e) => setExtra(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cw-generate-row">
                      <button
                        className="cw-generate"
                        type="button"
                        disabled={busy}
                        onClick={generate}
                      >
                        ✦ &nbsp; {busy ? "Generating..." : "Generate Content"}{" "}
                        &nbsp; →
                      </button>
                    </div>
                  </section>

                  <section className="cw-panel cw-output">
                    <div className="cw-panel-head">
                      <div
                        className="cw-panel-icon"
                        style={{ background: "#0c2a61" }}
                      >
                        ▤
                      </div>
                      <div className="cw-panel-heading">
                        <h2>Generated Content</h2>
                        <p>
                          {output
                            ? `About ${wordCount(output)} words`
                            : "Your AI-generated content will appear here..."}
                        </p>
                      </div>
                    </div>

                    <div className="cw-output-body">
                      {busy ? (
                        <div className="cw-empty">
                          <div>
                            <div className="cw-empty-icon">✦</div>
                            <strong>Generating content...</strong>
                            <span>Please wait a moment.</span>
                          </div>
                        </div>
                      ) : output ? (
                        output
                      ) : (
                        <div className="cw-empty">
                          <div>
                            <div className="cw-empty-icon">▤</div>
                            <strong>No content yet</strong>
                            <span>
                              Fill in the details above and click "Generate
                              Content"
                              <br />
                              to create your content.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  <div className="cw-actions">
                    <button className="cw-action" onClick={copyContent}>
                      ▣ &nbsp; Copy
                    </button>
                    <button className="cw-action" onClick={downloadContent}>
                      ⇩ &nbsp; Download
                    </button>
                    <button className="cw-action" onClick={saveContent}>
                      {isSaved ? "✓" : "♡"} &nbsp; {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      className="cw-action publish"
                      onClick={publishContent}
                      disabled={!output || isPublished}
                    >
                      ♧ &nbsp; {isPublished ? "Published" : "Publish"}
                    </button>
                  </div>
                </>
              )}

              {tab === "post" && (
                <section className="cw-panel">
                  <div className="cw-card-title">Published Posts</div>
                  <div className="cw-card-sub">
                    Content you have published from this workspace.
                  </div>

                  {listByIds(publishedIds).length === 0 ? (
                    <div className="cw-empty-list">
                      Nothing published yet. Generate content, then choose
                      Publish.
                    </div>
                  ) : (
                    <div className="cw-list">
                      {listByIds(publishedIds).map((draft) => (
                        <button
                          className="cw-row"
                          key={draft.id}
                          onClick={() => openDraft(draft)}
                        >
                          <span className="cw-row-icon">▤</span>
                          <span className="cw-row-text">
                            <span className="cw-row-title">{draft.title}</span>
                            <span className="cw-row-sub">{draft.ago}</span>
                          </span>
                          <span>›</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {tab === "history" && (
                <section className="cw-panel">
                  <div className="cw-card-title">History</div>
                  <div className="cw-card-sub">
                    Everything generated in this workspace, newest first.
                  </div>

                  <div className="cw-list">
                    {drafts.map((draft) => (
                      <button
                        className="cw-row"
                        key={draft.id}
                        onClick={() => openDraft(draft)}
                      >
                        <span className="cw-row-icon">▤</span>
                        <span className="cw-row-text">
                          <span className="cw-row-title">{draft.title}</span>
                          <span className="cw-row-sub">{draft.ago}</span>
                        </span>
                        <span>›</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {tab === "saved" && (
                <section className="cw-panel">
                  <div className="cw-card-title">Saved</div>
                  <div className="cw-card-sub">
                    Drafts you bookmarked to come back to.
                  </div>

                  {listByIds(savedIds).length === 0 ? (
                    <div className="cw-empty-list">
                      No saved drafts. Choose Save under a generated draft.
                    </div>
                  ) : (
                    <div className="cw-list">
                      {listByIds(savedIds).map((draft) => (
                        <button
                          className="cw-row"
                          key={draft.id}
                          onClick={() => openDraft(draft)}
                        >
                          <span className="cw-row-icon">♡</span>
                          <span className="cw-row-text">
                            <span className="cw-row-title">{draft.title}</span>
                            <span className="cw-row-sub">{draft.ago}</span>
                          </span>
                          <span>›</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </section>

          <aside className="cw-right">
            <section className="cw-card">
              <div className="cw-card-head">
                <span>▣</span>
                <div className="cw-card-title">Content Templates</div>
                <button
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: 0,
                    color: "#4aa6ff",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                  onClick={() => showToast("All templates are shown here.")}
                >
                  View All →
                </button>
              </div>

              <ul className="cw-list">
                {FORMATS.map((item) => (
                  <li key={item.id}>
                    <button
                      className="cw-row"
                      type="button"
                      onClick={() => selectFormat(item.id, item.sample)}
                    >
                      <span className="cw-row-icon">{item.icon}</span>
                      <span className="cw-row-text">
                        <span className="cw-row-title">{item.title}</span>
                        <span className="cw-row-sub">{item.blurb}</span>
                      </span>
                      <span>›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cw-card">
              <div className="cw-card-head">
                <span>▤</span>
                <div className="cw-card-title">Recent Drafts</div>
                <button
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: 0,
                    color: "#4aa6ff",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                  onClick={() => setTab("history")}
                >
                  View All →
                </button>
              </div>

              <ul className="cw-list">
                {drafts.slice(0, 4).map((draft) => (
                  <li key={draft.id}>
                    <button
                      className="cw-row"
                      type="button"
                      onClick={() => openDraft(draft)}
                    >
                      <span className="cw-row-icon">▤</span>
                      <span className="cw-row-text">
                        <span className="cw-row-title">{draft.title}</span>
                        <span className="cw-row-sub">{draft.ago}</span>
                      </span>
                      <span>›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cw-tip">
              <div className="cw-tip-icon">✎</div>
              <p>
                Good content builds
                <br />
                bigger opportunities.
              </p>
            </section>
          </aside>
        </div>
      </main>

      {toast && <div className="cw-toast">{toast}</div>}
    </div>
  );
}
