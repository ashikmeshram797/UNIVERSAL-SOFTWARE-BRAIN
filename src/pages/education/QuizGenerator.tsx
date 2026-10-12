import React, {useEffect,  useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type QType = "MCQs" | "True/False" | "Short Answer";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Settings {
  subject: string;
  topic: string;
  types: QType[];
  count: number;
  difficulty: Difficulty;
}

interface Question {
  kind: QType;
  text: string;
  options: string[];
  answer: number; // index of correct option (MCQ / TF)
  correct_answer?: string;
  explanation: string;
}

interface RecentQuiz {
  id: number;
  subject: string;
  topic: string;
  question_types: QType[];
  count: number;
  difficulty: Difficulty;
  score: number;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  accuracy: number;
  time_taken: number;
  created_at: string;
}
const getRecentIcon = (quiz: RecentQuiz): IconName => {
  const value = `${quiz.subject} ${quiz.topic}`.toLowerCase();

  if (value.includes("python")) return "python";
  if (value.includes("database") || value.includes("dbms")) {
    return "database";
  }
  if (value.includes("ai") || value.includes("machine learning")) {
    return "cpu";
  }

  return "network";
};

const getRecentTone = (
  quiz: RecentQuiz
): "purple" | "blue" | "python" => {
  const value = `${quiz.subject} ${quiz.topic}`.toLowerCase();

  if (value.includes("python")) return "python";
  if (value.includes("database") || value.includes("dbms")) {
    return "blue";
  }

  return "purple";
};

const formatRecentTime = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return created.toLocaleDateString();
};
/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const SUBJECTS: Record<string, string[]> = {
  "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Networks"],
  Mathematics: ["Algebra", "Calculus", "Statistics"],
  Physics: ["Mechanics", "Optics", "Thermodynamics"],
};

const MCQ_BANK: Question[] = [
  {
    kind: "MCQs",
    text: "What is the time complexity of searching an element in a balanced binary search tree?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    answer: 1,
    explanation:
      "In a balanced binary search tree, the height is O(log n), so searching takes O(log n) time in the average and worst case.",
  },
  {
    kind: "MCQs",
    text: "Which data structure follows the Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Graph"],
    answer: 1,
    explanation: "A stack adds and removes items from the same end, so the last item pushed is the first popped.",
  },
  {
    kind: "MCQs",
    text: "Which traversal of a binary search tree visits nodes in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    answer: 2,
    explanation: "Inorder visits left subtree, node, then right subtree, which yields keys in ascending order.",
  },
  {
    kind: "MCQs",
    text: "What is the worst-case time to insert at the head of a singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 0,
    explanation: "Only the head pointer changes, so the insert takes constant time.",
  },
  {
    kind: "MCQs",
    text: "Which data structure is typically used to implement a priority queue?",
    options: ["Stack", "Heap", "Hash table", "Trie"],
    answer: 1,
    explanation: "A binary heap gives O(log n) insertion and removal of the highest-priority item.",
  },
  {
    kind: "MCQs",
    text: "What is the average time complexity of a lookup in a hash table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 0,
    explanation: "With a good hash function and low load factor, lookups take constant time on average.",
  },
  {
    kind: "MCQs",
    text: "Which data structure is used for breadth-first search on a graph?",
    options: ["Stack", "Queue", "Heap", "Set"],
    answer: 1,
    explanation: "BFS explores level by level, which matches the first-in first-out order of a queue.",
  },
  {
    kind: "MCQs",
    text: "How many children can a node in a binary tree have at most?",
    options: ["1", "2", "3", "Unlimited"],
    answer: 1,
    explanation: "By definition, each node in a binary tree has at most two children.",
  },
  {
    kind: "MCQs",
    text: "Which structure gives O(1) random access by index?",
    options: ["Linked list", "Array", "Stack", "Binary tree"],
    answer: 1,
    explanation: "Arrays store elements contiguously, so the address of any index is computed directly.",
  },
  {
    kind: "MCQs",
    text: "Which of these is a self-balancing binary search tree?",
    options: ["AVL tree", "Trie", "Heap", "Deque"],
    answer: 0,
    explanation: "An AVL tree rebalances with rotations so its height stays O(log n).",
  },
];

const TF_BANK: Question[] = [
  { kind: "True/False", text: "A stack can be implemented using a linked list.", options: ["True", "False"], answer: 0, explanation: "Push and pop at the head of a linked list give a valid stack." },
  { kind: "True/False", text: "Searching an unsorted array takes O(log n) time.", options: ["True", "False"], answer: 1, explanation: "Without order you must check each element, which is O(n)." },
  { kind: "True/False", text: "A queue removes the most recently added element first.", options: ["True", "False"], answer: 1, explanation: "A queue is first in, first out." },
  { kind: "True/False", text: "A binary heap is usually stored in an array.", options: ["True", "False"], answer: 0, explanation: "Parent and child positions are computed from indices, so no pointers are needed." },
  { kind: "True/False", text: "Every binary tree is a binary search tree.", options: ["True", "False"], answer: 1, explanation: "A BST must also keep left keys smaller and right keys larger." },
];

const SA_BANK: Question[] = [
  { kind: "Short Answer", text: "Name the data structure that follows FIFO ordering.", options: [], answer: -1, explanation: "Queue." },
  { kind: "Short Answer", text: "What is the height of a balanced binary tree with n nodes?", options: [], answer: -1, explanation: "O(log n)." },
  { kind: "Short Answer", text: "Which traversal uses a queue on a tree?", options: [], answer: -1, explanation: "Level order (breadth-first)." },
  { kind: "Short Answer", text: "What do we call two keys that map to the same hash slot?", options: [], answer: -1, explanation: "A collision." },
  { kind: "Short Answer", text: "Which operation removes the top item of a stack?", options: [], answer: -1, explanation: "Pop." },
];

const BANKS: Record<QType, Question[]> = {
  MCQs: MCQ_BANK,
  "True/False": TF_BANK,
  "Short Answer": SA_BANK,
};

const KIND_LABEL: Record<QType, string> = {
  MCQs: "Multiple Choice Question",
  "True/False": "True / False Question",
  "Short Answer": "Short Answer Question",
};



const DEFAULTS: Settings = {
  subject: "Computer Science",
  topic: "Data Structures",
  types: ["MCQs"],
  count: 10,
  difficulty: "Medium",
};

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
type IconName =
  | "gradCap" | "bell" | "chevDown" | "chevRight" | "settings" | "book" | "network"
  | "checkCircle" | "check" | "tf" | "short" | "minus" | "plus" | "easy" | "medium"
  | "hard" | "sparkle" | "arrowRight" | "fileText" | "barChart" | "help" | "list"
  | "gauge" | "clock" | "bulb" | "trophy" | "database" | "cpu" | "python";

const ICONS: Record<IconName, React.ReactNode> = {
  gradCap: (<><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2.5 9 2.5 12 0v-5" /><path d="M22 10v6" /></>),
  bell: (<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>),
  chevDown: <path d="m6 9 6 6 6-6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  settings: (<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>),
  book: (<><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" /><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" /></>),
  network: (<><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M12 7.5v4M12 11.5l-6 4.5M12 11.5l6 4.5" /></>),
  checkCircle: (<><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
  check: <path d="m5 12 5 5 9-10" />,
  tf: (<><rect x="3" y="4" width="18" height="16" rx="4" /><path d="M12 4v16" /></>),
  short: <rect x="4" y="4" width="16" height="16" rx="4" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  easy: (<><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" /></>),
  medium: (<><circle cx="12" cy="12" r="9" /><path d="M8.5 15h7M9 9.5h.01M15 9.5h.01" /></>),
  hard: (<><circle cx="12" cy="12" r="9" /><path d="M8 16s1.5-2 4-2 4 2 4 2M9 9.5h.01M15 9.5h.01" /></>),
  sparkle: (<><path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z" /><path d="M19 15v5M16.5 17.5h5" /></>),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  fileText: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" /></>),
  barChart: (<><rect x="3" y="12" width="4" height="8" rx="1" /><rect x="10" y="5" width="4" height="15" rx="1" /><rect x="17" y="9" width="4" height="11" rx="1" /></>),
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>),
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  gauge: (<><path d="M4 18a9 9 0 1 1 16 0" /><path d="m12 14 4-5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  bulb: (<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>),
  trophy: (<><path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 14v4M8 21h8M10 18h4" /></>),
  database: (<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>),
  cpu: (<><rect x="6" y="6" width="12" height="12" rx="3" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 12h4" /></>),
  python: <path d="" />,
};

const Icon: React.FC<{ name: IconName; size?: number; sw?: number }> = ({ name, size = 18, sw = 1.8 }) => {
  if (name === "python") return <PythonLogo size={size} />;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
};

const PythonLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M15.9 3C10 3 10.4 5.6 10.4 5.6V8.3H16v.9H8.2S4 8.7 4 15s3.6 6.1 3.6 6.1h2.1v-3s-.1-3.6 3.6-3.6h5.9s3.4.1 3.4-3.3V6.4S23.1 3 15.9 3zm-3.3 2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" fill="#3b82f6" />
    <path d="M16.1 29c5.9 0 5.5-2.6 5.5-2.6v-2.7H16v-.9h7.8S28 23.3 28 17s-3.6-6.1-3.6-6.1h-2.1v3s.1 3.6-3.6 3.6h-5.9s-3.4-.1-3.4 3.3v5.8S8.9 29 16.1 29zm3.3-2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" fill="#facc15" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Hero illustration                                                  */
/* ------------------------------------------------------------------ */
const HeroArt: React.FC = () => (
  <svg className="hero-art" viewBox="0 0 470 150" aria-hidden="true">
    <defs>
      <linearGradient id="pad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b4cc9" />
        <stop offset="1" stopColor="#1a2470" />
      </linearGradient>
      <linearGradient id="bk1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2b3a9e" />
        <stop offset="1" stopColor="#4c5bd4" />
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#5b6dff" stopOpacity="0.45" />
        <stop offset="1" stopColor="#5b6dff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="290" cy="85" rx="170" ry="70" fill="url(#glow)" />
    {/* clipboard */}
    <g transform="rotate(8 290 80)">
      <rect x="205" y="22" width="150" height="112" rx="10" fill="url(#pad)" stroke="#7a88ff" strokeOpacity="0.6" />
      <rect x="250" y="15" width="60" height="14" rx="5" fill="#2a3596" stroke="#8c98ff" strokeOpacity="0.6" />
      <rect x="220" y="40" width="120" height="14" rx="3" fill="#0f1650" opacity="0.8" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0 ${i * 20})`}>
          <rect x="220" y={60} width="12" height="12" rx="3" fill="#0f1650" stroke="#9aa7ff" />
          <path d={`M223 ${66} l3 3 5-6`} stroke="#c5ccff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="240" y={63} width="85" height="6" rx="3" fill="#b7c0ff" opacity="0.9" />
        </g>
      ))}
    </g>
    {/* question bubble */}
    <g transform="translate(262 4)">
      <circle cx="18" cy="18" r="18" fill="#2d3ccf" stroke="#b9c2ff" strokeWidth="2" />
      <text x="18" y="26" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">?</text>
    </g>
    {/* books */}
    <g>
      <rect x="392" y="92" width="74" height="18" rx="3" fill="url(#bk1)" stroke="#8c98ff" strokeOpacity="0.5" />
      <rect x="398" y="110" width="68" height="18" rx="3" fill="#33429f" stroke="#8c98ff" strokeOpacity="0.5" />
      <rect x="388" y="128" width="78" height="18" rx="3" fill="url(#bk1)" stroke="#8c98ff" strokeOpacity="0.5" />
      <rect x="405" y="74" width="50" height="18" rx="3" fill="#3b4cc9" stroke="#8c98ff" strokeOpacity="0.5" />
      <path d="M440 74c4-14 10-18 18-22-2 8-6 16-10 22z" fill="#2f8f7a" opacity="0.8" />
      <path d="M432 74c-2-12-8-18-14-20 0 8 4 15 8 20z" fill="#3fb59a" opacity="0.7" />
    </g>
    {/* mug */}
    <rect x="178" y="102" width="26" height="24" rx="4" fill="#1e2a7a" stroke="#6f7dff" strokeOpacity="0.5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const LETTERS = ["A", "B", "C", "D"];

const QuizGenerator: React.FC = () => {
  const [draft, setDraft] = useState<Settings>(DEFAULTS);
  const [applied, setApplied] = useState<Settings>(DEFAULTS);
  const [answers, setAnswers] = useState<Record<number, number>>({ 0: 1 });
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [generated, setGenerated] = useState(false);
const [timeLeft, setTimeLeft] = useState(0);
const [submitted, setSubmitted] = useState(false);
const [score, setScore] = useState(0);
const [correctCount, setCorrectCount] = useState(0);
const [wrongCount, setWrongCount] = useState(0);
const [skippedCount, setSkippedCount] = useState(0);
const [accuracy, setAccuracy] = useState(0);
const [timeTaken, setTimeTaken] = useState(0);
const [showResult, setShowResult] = useState(false);
const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
const [recentLoading, setRecentLoading] = useState(false);

 const loadRecentQuizzes = async () => {
  try {
    setRecentLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/quiz/recent",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("Recent Quizzes Response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load recent quizzes"
      );
    }

    setRecentQuizzes(data.quizzes || []);

  } catch (error) {
    console.error("Recent Quizzes Error:", error);
  } finally {
    setRecentLoading(false);
  }
};

useEffect(() => {
  loadRecentQuizzes();
}, []);

const openRecentQuiz = async (quizId: number) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No authentication token found.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/education/quiz/${quizId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("Recent Quiz Detail:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load quiz"
      );
    }

    const quiz = data.quiz;

    // Restore quiz settings
    setApplied({
      subject: quiz.subject,
      topic: quiz.topic,
      types: quiz.question_types,
      count: quiz.count,
      difficulty: quiz.difficulty,
    });

    // Restore questions
    setQuestions(quiz.questions || []);

    // ⭐ Restore user's old answers
    setAnswers(quiz.answers || {});
    setShortAnswers(quiz.short_answers || {});

    // Restore result
    setScore(quiz.score || 0);
    setCorrectCount(quiz.correct_count || 0);
    setWrongCount(quiz.wrong_count || 0);
    setSkippedCount(quiz.skipped_count || 0);
    setAccuracy(quiz.accuracy || 0);
    setTimeTaken(quiz.time_taken || 0);

    // Old quiz is already completed
    setGenerated(true);
    setSubmitted(true);
    setShowResult(true);

  } catch (error) {
    console.error("Open Recent Quiz Error:", error);
  }
};
  const toggleType = (t: QType) =>
    setDraft((d) => {
      const has = d.types.includes(t);
      if (has && d.types.length === 1) return d; // keep at least one
      const next = has ? d.types.filter((x) => x !== t) : [...d.types, t];
      return { ...d, types: (["MCQs", "True/False", "Short Answer"] as QType[]).filter((x) => next.includes(x)) };
    });

  const setSubject = (subject: string) =>
  setDraft((d) => ({
    ...d,
    subject,
  }));

  
  const generate = async () => {
  if (!draft.subject.trim()) {
    setError("Please enter a subject.");
    return;
  }

  if (!draft.topic.trim()) {
    setError("Please enter a topic.");
    return;
  }

  setLoading(true);
  setError("");
  setSubmitted(false);
  setGenerated(false);
  setScore(0);
setCorrectCount(0);
setWrongCount(0);
setSkippedCount(0);
setAccuracy(0);
setTimeTaken(0);
setShowResult(false);
  setAnswers({});
  setShortAnswers({});
  setQuestions([]);

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/education/quiz/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: draft.subject.trim(),
          topic: draft.topic.trim(),
          question_types: draft.types,
          count: draft.count,
          difficulty: draft.difficulty,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to generate quiz."
      );
    }

    setApplied(draft);
    setQuestions(data.quiz.questions || []);

    if (data.timer?.total_seconds) {
      setTimeLeft(data.timer.total_seconds);
    }

    setGenerated(true);

    setTimeout(() => {
      previewRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);

  } catch (err) {
    console.error("Quiz generation error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while generating the quiz."
    );
  } finally {
    setLoading(false);
  }
};
  const submitQuiz = async () => {
  if (!questions.length) return;

  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  questions.forEach((q, index) => {
    if (q.kind === "Short Answer") {
      const userAnswer = (shortAnswers[index] || "").trim();

      if (!userAnswer) {
        skipped++;
        return;
      }

      if (
        q.correct_answer &&
        userAnswer.toLowerCase() ===
          q.correct_answer.trim().toLowerCase()
      ) {
        correct++;
      } else {
        wrong++;
      }

      return;
    }

    const selectedAnswer = answers[index];

    if (selectedAnswer === undefined) {
      skipped++;
      return;
    }

    if (selectedAnswer === q.answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  const total = questions.length;

  const calculatedAccuracy =
    total > 0
      ? Math.round((correct / total) * 100)
      : 0;

  const calculatedScore = correct;

  const calculatedTimeTaken =
    applied.count *
      (applied.difficulty === "Easy"
        ? 60
        : applied.difficulty === "Medium"
        ? 90
        : 120) -
    timeLeft;

  const finalTimeTaken = Math.max(0, calculatedTimeTaken);

  // --------------------------------------------------
  // UPDATE RESULT UI
  // --------------------------------------------------

  setCorrectCount(correct);
  setWrongCount(wrong);
  setSkippedCount(skipped);
  setScore(calculatedScore);
  setAccuracy(calculatedAccuracy);
  setTimeTaken(finalTimeTaken);

  setSubmitted(true);
  setShowResult(false);

  // --------------------------------------------------
  // SAVE QUIZ TO DATABASE
  // --------------------------------------------------

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No authentication token found.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/quiz/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: applied.subject,
          topic: applied.topic,
          question_types: applied.types,
          count: applied.count,
          difficulty: applied.difficulty,

          // Save complete generated questions
          questions: questions,
          answers: answers,
  short_answers: shortAnswers,

          // Result
          score: calculatedScore,
          correct_count: correct,
          wrong_count: wrong,
          skipped_count: skipped,
          accuracy: calculatedAccuracy,
          time_taken: finalTimeTaken,
        }),
      }
    );

    const data = await response.json();

    console.log("Quiz Save Response:", data);

    if (!response.ok) {
      console.error(
        "Quiz save failed:",
        data?.message || "Unable to save quiz"
      );

      return;
    }

    console.log("Quiz saved successfully:", data);
    await loadRecentQuizzes();

  } catch (error) {
    console.error("Quiz Save Error:", error);
  }
};
useEffect(() => {
  if (!generated || submitted || timeLeft <= 0) {
    return;
  }

  const timer = window.setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        window.clearInterval(timer);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => window.clearInterval(timer);
}, [generated, submitted, timeLeft]);

  const typeLabel = applied.types.length === 1 ? applied.types[0] : "Mixed";

  return (
    <div className="qg-root">
      <style>{CSS}</style>

      {/* ---------------- Top bar ---------------- */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon"><Icon name="gradCap" size={34} sw={1.6} /></span>
          <span className="brand-name">Education Agent</span>
          <span className="brand-sep" />
          <span className="brand-page">Quiz Generator</span>
        </div>
        <div className="top-right">
          <span className="online"><i />Online</span>
          <button className="bell" aria-label="Notifications">
            <Icon name="bell" size={22} />
            <b />
          </button>
          <button className="user">
            <span className="avatar">A</span>
            <span>Ashik</span>
            <Icon name="chevDown" size={16} />
          </button>
        </div>
      </header>

      <main className="page">
        {/* ---------------- Hero ---------------- */}
        <section className="hero">
          <div className="hero-icon">
            <svg width="62" height="62" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
              <circle cx="30" cy="34" r="22" opacity=".9" />
              <circle cx="30" cy="34" r="14" />
              <circle cx="30" cy="34" r="5.5" fill="#fff" />
              <path d="M30 34 52 12M46 8v10h10" />
            </svg>
          </div>
          <div className="hero-text">
            <span className="eyebrow">QUIZ GENERATOR</span>
            <h1>Create Your <span>Custom Quiz</span></h1>
            <p>
              Generate personalized quizzes with MCQs, True/False and short-answer
              <br />questions. Test your knowledge and track your progress.
            </p>
          </div>
          <div className="hero-quote">
            <span>Practice Today</span>
            <span>Perform Tomorrow</span>
            <svg viewBox="0 0 140 30" aria-hidden="true"><path d="M2 26C40 12 90 6 138 2" stroke="#8ea0ff" strokeWidth="1.2" fill="none" /></svg>
          </div>
          <HeroArt />
        </section>

        <div className="grid">
          {/* ---------------- Settings ---------------- */}
          <aside className="panel settings">
            <div className="panel-head">
              <span className="head-ico"><Icon name="settings" size={30} sw={1.5} /></span>
              <div>
                <h2>Quiz Settings</h2>
                <small>Configure your quiz preferences</small>
              </div>
            </div>

            <label className="lbl">Subject</label>
            <div className="select">
  <Icon name="book" size={20} />

  <input
    value={draft.subject}
    onChange={(e) =>
      setDraft((d) => ({
        ...d,
        subject: e.target.value,
      }))
    }
    placeholder="Enter subject"
  />
</div>

            <label className="lbl">Topic</label>
             <div className="select">
  <Icon name="network" size={20} />

  <input
    value={draft.topic}
    onChange={(e) =>
      setDraft((d) => ({
        ...d,
        topic: e.target.value,
      }))
    }
    placeholder="Enter topic"
  />
</div>

            <label className="lbl">Question Type</label>
            <div className="chips">
              {([
                ["MCQs", "checkCircle"],
                ["True/False", "tf"],
                ["Short Answer", "short"],
              ] as [QType, IconName][]).map(([t, ic]) => {
                const on = draft.types.includes(t);
                return (
                  <button key={t} className={"chip" + (on ? " on" : "")} onClick={() => toggleType(t)} aria-pressed={on}>
                    <Icon name={ic} size={17} />
                    <span>{t}</span>
                    {on && <em><Icon name="check" size={13} sw={3} /></em>}
                  </button>
                );
              })}
            </div>

            <label className="lbl">Number of Questions</label>
            <div className="stepper">
  <button
    aria-label="Decrease"
    onClick={() =>
      setDraft((d) => ({
        ...d,
        count: d.count === 30 ? 20 : 10,
      }))
    }
  >
    <Icon name="minus" size={18} />
  </button>

  <span>{draft.count}</span>

  <button
    aria-label="Increase"
    onClick={() =>
      setDraft((d) => ({
        ...d,
        count: d.count === 10 ? 20 : 30,
      }))
    }
  >
    <Icon name="plus" size={18} />
  </button>
</div>

<div className="count-options">
  {[10, 20, 30].map((count) => (
    <button
      key={count}
      className={draft.count === count ? "active" : ""}
      onClick={() =>
        setDraft((d) => ({
          ...d,
          count,
        }))
      }
    >
      {count}
    </button>
  ))}
</div>

            <label className="lbl lbl-gap">Difficulty Level</label>
            <div className="diff">
              {([
                ["Easy", "easy"],
                ["Medium", "medium"],
                ["Hard", "hard"],
              ] as [Difficulty, IconName][]).map(([d, ic]) => (
                <button
                  key={d}
                  className={draft.difficulty === d ? "on" : ""}
                  onClick={() => setDraft({ ...draft, difficulty: d })}
                  aria-pressed={draft.difficulty === d}
                >
                  <Icon name={ic} size={15} />
                  {d}
                </button>
              ))}
            </div>

            <button className="generate" onClick={generate}>
              <Icon name="sparkle" size={20} />
              Generate Quiz
              <Icon name="arrowRight" size={18} />
            </button>
          </aside>

          {/* ---------------- Preview ---------------- */}
          <section className="panel preview">
            <div className="panel-head preview-head">
              <span className="head-ico"><Icon name="fileText" size={30} sw={1.5} /></span>
              <div>
                <h2>Quiz Preview</h2>
                <small>Review your quiz before starting</small>
              </div>
              <div className="pills">
                <span><Icon name="book" size={13} />{applied.subject}</span>
                <span><Icon name="network" size={13} />{applied.topic}</span>
                <span><Icon name="help" size={13} />{applied.count} Questions</span>
                {generated && !submitted && (
  <span className="timer-pill">
    <Icon name="clock" size={13} />
    {Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0")}
    :
    {(timeLeft % 60)
      .toString()
      .padStart(2, "0")}
  </span>
)}
              </div>
            </div>

            <div className="q-scroll" ref={previewRef}>
              {loading && (
  <div className="quiz-loading">
    <Icon name="sparkle" size={28} />
    <h3>Generating your quiz...</h3>
    <p>
      Finding topic information and creating questions with AI.
    </p>
  </div>
)}

{error && !loading && (
  <div className="quiz-error">
    <Icon name="help" size={24} />
    <div>
      <b>Quiz generation failed</b>
      <p>{error}</p>
    </div>
  </div>
)}
              {questions.map((q, i) => (
                <article className="qcard" key={i}>
                  <span className="qnum">{i + 1}</span>
                  <div className="qbody">
                    <div className="qtop">
                      <span className="badge">{KIND_LABEL[q.kind]}</span>
                      <span className="count">{i + 1} / {applied.count}</span>
                    </div>
                    <h3>{q.text}</h3>

                    {q.kind === "Short Answer" ? (
                      <input
                        className="short-input"
                        placeholder="Type your answer here"
                        value={shortAnswers[i] ?? ""}
                        onChange={(e) => setShortAnswers({ ...shortAnswers, [i]: e.target.value })}
                      />
                    ) : (
                      <div className="opts">
                        {q.options.map((o, oi) => {
                          const sel = answers[i] === oi;
                          return (
                            <button
                              key={oi}
                              className={"opt" + (sel ? " sel" : "")}
                              onClick={() => setAnswers({ ...answers, [i]: oi })}
                              role="radio"
                              aria-checked={sel}
                            >
                              <span className="radio" />
                              <span className="letter">{LETTERS[oi]}</span>
                              <span>{o}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                     {submitted && (
  <div className="explain">
                        <span className="bulb"><Icon name="bulb" size={22} /></span>
                        <div>
                          <small>Explanation (will be shown after submission)</small>
                          <p>{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {generated && !submitted && questions.length > 0 && (
  <div className="submit-quiz-wrap">
    <button
      className="submit-quiz-btn"
      onClick={submitQuiz}
    >
      <Icon name="check" size={18} />
      Submit Quiz
    </button>
  </div>
)}
            </div>
          </section>

          {/* ---------------- Right column ---------------- */}
          <aside className="right">
             <section className="panel summary">
  {!submitted ? (
    <>
      <div className="sum-head">
        <span className="sum-ico">
          <Icon name="barChart" size={24} sw={1.6} />
        </span>
        <h2>Quiz Summary</h2>
      </div>

      <div className="sum-grid">
        <div className="tile">
          <span className="t-ico blue">
            <Icon name="help" size={24} sw={1.5} />
          </span>
          <div>
            <b>{applied.count}</b>
            <small>Total Questions</small>
          </div>
        </div>

        <div className="tile">
          <span className="t-ico blue">
            <Icon name="list" size={22} sw={1.6} />
          </span>
          <div>
            <b>{typeLabel}</b>
            <small>Question Type</small>
          </div>
        </div>

        <div className="tile">
          <span className="t-ico orange">
            <Icon name="gauge" size={24} sw={1.6} />
          </span>
          <div>
            <b>{applied.difficulty}</b>
            <small>Difficulty</small>
          </div>
        </div>

        <div className="tile">
          <span className="t-ico blue">
            <Icon name="gradCap" size={24} sw={1.5} />
          </span>
          <div>
            <b>{applied.subject}</b>
            <small>Subject</small>
          </div>
        </div>
      </div>
    </>
   
  ) : (
    <>
      {/* Existing Quiz Completed Summary */}
      <div className="result-head">
        <span className="result-trophy">
          <Icon name="trophy" size={26} sw={1.6} />
        </span>

        <div>
          <h2>Quiz Completed</h2>
          <small>Great job! Here is your result.</small>
        </div>
      </div>

      <div className="score-box">
        <strong>
          {score} / {questions.length}
        </strong>

        <span>{accuracy}% Accuracy</span>
      </div>

      <div className="result-stats">
        <div className="result-stat correct">
          <span>✓</span>

          <div>
            <b>{correctCount}</b>
            <small>Correct</small>
          </div>
        </div>

        <div className="result-stat wrong">
          <span>✕</span>

          <div>
            <b>{wrongCount}</b>
            <small>Wrong</small>
          </div>
        </div>

        <div className="result-stat skipped">
          <span>─</span>

          <div>
            <b>{skippedCount}</b>
            <small>Skipped</small>
          </div>
        </div>
      </div>

      <div className="time-result">
        <span className="time-result-icon">
          <Icon name="clock" size={19} />
        </span>

        <div>
          <small>Time Taken</small>

          <b>
            {Math.floor(timeTaken / 60)
              .toString()
              .padStart(2, "0")}
            :
            {(timeTaken % 60)
              .toString()
              .padStart(2, "0")}
          </b>
        </div>
      </div>

      <button
        className="view-result-btn"
        onClick={() => setShowResult(true)}
      >
        <Icon name="fileText" size={18} />
        View Result
        <Icon name="arrowRight" size={17} />
      </button>
    </>
  )}
</section>

            <section className="panel recent">
              <div className="rec-head">
                <span className="sum-ico"><Icon name="clock" size={22} sw={1.6} /></span>
                <h2>Recent Quizzes</h2>
                <a href="#all">View All <Icon name="arrowRight" size={13} /></a>
              </div>
               <ul>
  {recentLoading ? (
    <li>
      <div className="r-text">
        <b>Loading recent quizzes...</b>
      </div>
    </li>
  ) : recentQuizzes.length === 0 ? (
    <li>
      <div className="r-text">
        <b>No recent quizzes yet</b>
        <small>Complete a quiz to see it here</small>
      </div>
    </li>
  ) : (
    recentQuizzes.map((r) => (
      <li
  key={r.id}
  onClick={() => openRecentQuiz(r.id)}
  style={{ cursor: "pointer" }}
>
        <span className={"r-ico " + getRecentTone(r)}>
          <Icon name={getRecentIcon(r)} size={26} sw={1.5} />
        </span>

        <div className="r-text">
          <b>{r.topic}</b>

          <small>
            {r.subject} • {r.count} Qs • {r.difficulty}
          </small>

          <span className="ago">
            <i />
            {formatRecentTime(r.created_at)}
          </span>
        </div>

        <Icon name="chevRight" size={18} />
      </li>
    ))
  )}
</ul>
            </section>

            <section className="panel cta">
              <span className="trophy"><Icon name="trophy" size={34} sw={1.4} /></span>
              <p>Small steps every day<br />lead to big results!</p>
              <button>Keep Practicing <Icon name="arrowRight" size={16} /></button>
              <svg className="mount" viewBox="0 0 200 110" aria-hidden="true">
                <path d="M20 110 90 30l30 35 25-25 55 70z" fill="#1c2a7d" opacity=".75" />
                <path d="M90 30l-14 16 14-6 10 10z" fill="#5b6dff" opacity=".6" />
                <path d="M145 40V14" stroke="#7d8cff" strokeWidth="2" />
                <path d="M145 14l18 6-18 6z" fill="#7d8cff" />
              </svg>
            </section>
          </aside>
        </div>
        {/* ================= RESULT MODAL ================= */}

        {submitted && showResult && (
          <div
            className="result-modal-overlay"
            onClick={() => setShowResult(false)}
          >
            <div
              className="result-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="result-modal-header">
                <div className="result-modal-title">
                  <span className="result-modal-icon">
                    <Icon name="fileText" size={23} />
                  </span>

                  <div>
                    <h2>Quiz Result</h2>
                    <small>Review your answers</small>
                  </div>
                </div>

                <button
                  className="result-modal-close"
                  onClick={() => setShowResult(false)}
                  aria-label="Close result"
                >
                  ×
                </button>
              </div>

              <div className="modal-score">
                <strong>
                  {score} / {questions.length}
                </strong>
                <span>{accuracy}% Accuracy</span>
              </div>

              <div className="modal-stats">
                <div className="modal-stat correct">
                  <b>{correctCount}</b>
                  <small>Correct</small>
                </div>

                <div className="modal-stat wrong">
                  <b>{wrongCount}</b>
                  <small>Wrong</small>
                </div>

                <div className="modal-stat skipped">
                  <b>{skippedCount}</b>
                  <small>Skipped</small>
                </div>
              </div>

              <div className="modal-time">
                <span>
                  <Icon name="clock" size={19} />
                </span>

                <div>
                  <small>Time Taken</small>
                  <b>
                    {Math.floor(timeTaken / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(timeTaken % 60)
                      .toString()
                      .padStart(2, "0")}
                  </b>
                </div>
              </div>

              <div className="modal-answer-review">
                {questions.map((q, index) => {
                  const userAnswer =
                    q.kind === "Short Answer"
                      ? shortAnswers[index] || ""
                      : answers[index] !== undefined
                      ? q.options[answers[index]]
                      : "";

                  const correctAnswer =
                    q.kind === "Short Answer"
                      ? q.correct_answer || q.explanation
                      : q.options[q.answer];

                  let status = "Skipped";

                  if (q.kind === "Short Answer") {
                    if (userAnswer.trim()) {
                      status =
                        userAnswer.trim().toLowerCase() ===
                        (q.correct_answer || "")
                          .trim()
                          .toLowerCase()
                          ? "Correct"
                          : "Wrong";
                    }
                  } else {
                    if (answers[index] !== undefined) {
                      status =
                        answers[index] === q.answer
                          ? "Correct"
                          : "Wrong";
                    }
                  }

                  return (
                    <div
                      className="modal-review-question"
                      key={index}
                    >
                      <div className="modal-review-top">
                        <span>Q{index + 1}</span>

                        <strong
                          className={
                            status === "Correct"
                              ? "status-correct"
                              : status === "Wrong"
                              ? "status-wrong"
                              : "status-skipped"
                          }
                        >
                          {status}
                        </strong>
                      </div>

                      <h4>{q.text}</h4>

                      <div className="modal-review-answer">
                        <small>Your Answer</small>
                        <p>{userAnswer || "Not answered"}</p>
                      </div>

                      <div className="modal-review-answer modal-correct-answer">
                        <small>Correct Answer</small>
                        <p>{correctAnswer}</p>
                      </div>

                      <div className="modal-review-explanation">
                        <Icon name="bulb" size={17} />
                        <p>{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="result-modal-footer">
                <button
                  className="modal-back-btn"
                  onClick={() => setShowResult(false)}
                >
                  ← Back to Summary
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizGenerator;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@500&display=swap');

.qg-root{
  --bg:#050b24; --panel:rgba(9,19,58,.72); --line:#16276a; --line2:#1f3382;
  --field:#0a1646; --txt:#f3f6ff; --mute:#8b9bd0; --purple:#7c5cff; --blue:#3b82f6;
  min-height:100vh; color:var(--txt); font-family:'Inter',system-ui,sans-serif;
  background:
    radial-gradient(900px 500px at 15% -10%, rgba(60,80,220,.22), transparent 60%),
    radial-gradient(800px 500px at 100% 0%, rgba(100,60,220,.18), transparent 60%),
    var(--bg);
}
.qg-root *{box-sizing:border-box}
.qg-root button{font-family:inherit;color:inherit;cursor:pointer}
.qg-root h1,.qg-root h2,.qg-root h3,.qg-root p{margin:0}

/* top bar */
.topbar{height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 36px;border-bottom:1px solid #12215a;background:rgba(5,11,36,.6)}
.brand{display:flex;align-items:center;gap:14px}
.brand-icon{color:#b9c6ff;display:grid;place-items:center}
.brand-name{font-size:21px;font-weight:600}
.brand-sep{width:1px;height:24px;background:#1f2f70;margin:0 6px}
.brand-page{font-size:19px;color:#c7d2f5}
.top-right{display:flex;align-items:center;gap:28px}
.online{display:flex;align-items:center;gap:12px;padding:0 24px;height:38px;border-radius:12px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.18);color:#34d399;font-weight:600;font-size:15px}
.online i{width:12px;height:12px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e}
.bell{position:relative;background:none;border:0;color:#d5dcff;padding:4px;display:grid}
.bell b{position:absolute;top:0;right:1px;width:8px;height:8px;border-radius:50%;background:#ef4444}
.user{display:flex;align-items:center;gap:12px;background:none;border:0;font-weight:600;font-size:15px}
.avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:18px;font-weight:500;background:linear-gradient(135deg,#2f6bff,#3b4cf0)}

.page{padding:16px 24px 24px}

/* hero */
.hero{position:relative;overflow:hidden;height:154px;border-radius:16px;border:1px solid var(--line2);display:flex;align-items:center;gap:36px;padding:0 36px;
  background:linear-gradient(90deg,#0b1544 0%,#09113a 55%,#0c1a55 100%)}
.hero-icon{width:104px;height:104px;border-radius:26px;display:grid;place-items:center;flex:none;
  background:linear-gradient(135deg,#9a5cff,#5b4cff 55%,#3b6cff);box-shadow:0 10px 30px rgba(110,80,255,.4), inset 0 0 0 1px rgba(255,255,255,.12)}
.hero-text{position:relative;z-index:2}
.eyebrow{font-size:12px;letter-spacing:.2em;color:#8fa2ff;font-weight:600}
.hero h1{font-size:31px;font-weight:700;margin:6px 0 10px;letter-spacing:-.01em}
.hero h1 span{background:linear-gradient(90deg,#a066ff,#6f8bff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:15px;line-height:1.5;color:#c3cdf0}
.hero-quote{position:absolute;right:400px;top:28px;transform:rotate(-8deg);font-family:'Caveat',cursive;font-size:25px;line-height:1.05;color:#dfe6ff;display:flex;flex-direction:column;z-index:2}
.hero-quote span:last-of-type{margin-left:22px}
.hero-quote svg{width:150px;height:30px;margin-left:0;margin-top:4px}
.hero-art{position:absolute;right:10px;top:0;height:150px;width:470px}

/* grid */
.grid{display:grid;grid-template-columns:347px minmax(0,1fr) 350px;gap:17px;margin-top:17px;align-items:start}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px}
.panel h2{font-size:17px;font-weight:600}
.panel small{color:var(--mute);font-size:12px}
.panel-head{display:flex;align-items:center;gap:14px}
.head-ico{color:#b7c5ff;display:grid}

/* settings */
.settings{padding:24px 20px 28px;height:742px}
.settings .panel-head{margin-bottom:22px}
.settings .panel-head h2{font-size:18px;margin-bottom:4px}
.lbl{display:block;font-size:15px;font-weight:500;color:#dbe3ff;margin:0 0 10px}
.lbl-gap{margin-top:0}
.select{position:relative;display:flex;align-items:center;gap:12px;height:43px;padding:0 14px;margin-bottom:26px;border-radius:10px;background:var(--field);border:1px solid var(--line2);color:#dbe3ff}
.select select{appearance:none;-webkit-appearance:none;position:absolute;inset:0;width:100%;height:100%;padding:0 44px 0 46px;background:transparent;border:0;color:var(--txt);font:500 15px 'Inter',sans-serif;outline:none;cursor:pointer}
.select select option{background:#0a1646;color:#fff}
.select > svg:last-child{margin-left:auto;position:relative;pointer-events:none}
.select > svg:first-child{pointer-events:none;position:relative;z-index:1}
.chips{display:flex;flex-wrap:wrap;gap:8px 8px;margin-bottom:26px}
.chip{position:relative;display:flex;align-items:center;gap:9px;height:43px;padding:0 15px;border-radius:10px;background:#0b164a;border:1px solid #15266a;font-size:14px;color:#c8d2f5}
.chip.on{background:#16247a;border-color:#5b63f5;color:#fff;box-shadow:0 0 0 1px rgba(91,99,245,.3) inset}
.chip em{margin-left:6px;width:20px;height:20px;border-radius:50%;background:#7c6cff;display:grid;place-items:center;color:#fff}
.stepper{display:flex;align-items:center;justify-content:space-between;height:48px;padding:0 6px;border-radius:10px;background:var(--field);border:1px solid var(--line2);margin-bottom:26px}
.stepper button{width:34px;height:34px;border-radius:8px;border:0;background:#1a2d86;color:#dfe6ff;display:grid;place-items:center}
.stepper span{font-size:16px;font-weight:500}
.diff{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:8px;margin-bottom:26px}
.diff button{display:flex;align-items:center;justify-content:center;gap:7px;height:46px;border-radius:10px;background:#0b164a;border:1px solid #15266a;font-size:14px;color:#c8d2f5}
.diff button.on{background:#19258a;border-color:#6d6bff;color:#fff;box-shadow:0 0 14px rgba(109,107,255,.35)}
.generate{width:100%;height:54px;display:flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:10px;font-size:17px;font-weight:600;color:#fff;
  background:linear-gradient(90deg,#7c3aed,#4f5bf5 50%,#0ea5e9);box-shadow:0 8px 24px rgba(79,91,245,.35)}
.generate:hover{filter:brightness(1.1)}
.submit-quiz-wrap{
  display:flex;
  justify-content:center;
  padding:10px 0 24px;
}

.submit-quiz-btn{
  border:0;
  border-radius:10px;
  height:50px;
  padding:0 28px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  font-size:16px;
  font-weight:600;
  color:#fff;
  background:linear-gradient(90deg,#7c3aed,#4f5bf5 50%,#0ea5e9);
  box-shadow:0 8px 24px rgba(79,91,245,.35);
}

.submit-quiz-btn:hover{
  filter:brightness(1.1);
}

/* preview */
.preview{padding:22px 18px 0;height:742px;display:flex;flex-direction:column;overflow:hidden}
.preview-head{padding:0 6px;margin-bottom:24px;position:relative}
.preview-head h2{font-size:18px;margin-bottom:5px}
.pills{
  margin-left:auto;
  display:grid;
  grid-template-columns:auto auto;
  gap:8px 10px;
  align-self:flex-start;
}
.timer-pill{
  display:flex !important;
  align-items:center;
  gap:6px;
  white-space:nowrap;
  flex-shrink:0;
}
.pills span{display:flex;align-items:center;gap:8px;height:30px;padding:0 13px;border-radius:9px;background:#0d1a55;border:1px solid #1d3080;font-size:12px;color:#d6defa;white-space:nowrap}
.q-scroll{flex:1;overflow-y:auto;padding-bottom:16px;margin-right:-8px;padding-right:8px;scrollbar-width:thin;scrollbar-color:#22338a transparent}
.qcard{display:flex;gap:18px;padding:18px 18px 18px;margin-bottom:16px;border-radius:14px;background:rgba(10,20,64,.75);border:1px solid #16286e}
.qnum{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#1c3fb5;font-size:18px;font-weight:600;box-shadow:0 0 14px rgba(40,90,240,.4)}
.qbody{flex:1;min-width:0}
.qtop{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.badge{font-size:11px;font-weight:500;color:#a9a4ff;background:#151f6b;border:1px solid #2b3a9c;padding:3px 10px;border-radius:6px}
.count{font-size:11px;color:#b9c4ee;background:#0f1b5a;border:1px solid #1d2f7e;padding:3px 10px;border-radius:6px}
.qcard h3{font-size:17px;font-weight:600;line-height:1.35;margin-bottom:18px;max-width:560px}
.opts{display:flex;flex-direction:column;gap:8px}
.opt{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;text-align:left;border-radius:10px;background:#0a1750;border:1px solid #15276c;font-size:14px;color:#e6ebff;width:100%}
.opt:hover{border-color:#2d44a8}
.radio{width:20px;height:20px;border-radius:50%;border:1.6px solid #6f7fd0;flex:none;display:grid;place-items:center}
.letter{width:24px;height:24px;border-radius:50%;background:#14246f;border:1px solid #233588;display:grid;place-items:center;font-size:11px;color:#b9c4ee;flex:none}
.opt.sel{background:linear-gradient(90deg,#1b1f86,#151d74);border-color:#7a6cff;box-shadow:0 0 0 1px rgba(122,108,255,.35) inset}
.opt.sel .radio{border-color:#8f7cff;background:#7c5cff;box-shadow:inset 0 0 0 4px #1b1f86}
.short-input{width:100%;height:48px;padding:0 16px;border-radius:10px;background:#0a1750;border:1px solid #15276c;color:#fff;font:400 14px 'Inter',sans-serif;outline:none}
.short-input:focus{border-color:#7a6cff}
.explain{display:flex;gap:14px;margin:16px -2px 0;padding:16px;border-radius:12px;background:#09143f;border:1px solid #16286e}
.bulb{flex:none;width:34px;height:34px;display:grid;place-items:center;color:#fbbf24}
.explain small{display:block;margin-bottom:8px;color:#b9c4ee}
.explain p{font-size:13px;line-height:1.6;color:#dbe3ff}

/* right column */
.right{display:flex;flex-direction:column;gap:17px}
.summary{padding:20px 16px 16px}
/* result card */
.result-head{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:18px;
  padding:0 2px;
}

.result-head h2{
  font-size:17px;
  margin-bottom:4px;
}

.result-trophy{
  width:46px;
  height:46px;
  border-radius:12px;
  display:grid;
  place-items:center;
  color:#fbbf24;
  background:rgba(245,158,11,.12);
  border:1px solid rgba(245,158,11,.25);
}

.score-box{
  text-align:center;
  padding:18px 10px;
  margin-bottom:14px;
  border-radius:14px;
  background:linear-gradient(
    135deg,
    rgba(124,58,237,.20),
    rgba(59,130,246,.12)
  );
  border:1px solid #293b91;
}

.score-box strong{
  display:block;
  font-size:32px;
  font-weight:700;
  line-height:1.1;
  background:linear-gradient(90deg,#a78bfa,#60a5fa);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}

.score-box span{
  display:block;
  margin-top:7px;
  color:#b8c6ef;
  font-size:12px;
}

.result-stats{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:7px;
  margin-bottom:12px;
}

.result-stat{
  min-height:68px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  border-radius:10px;
  background:#0b1850;
  border:1px solid #16286e;
}

.result-stat > span{
  width:25px;
  height:25px;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:14px;
  font-weight:700;
}

.result-stat b{
  display:block;
  font-size:15px;
  line-height:1.1;
}

.result-stat small{
  display:block;
  font-size:10px;
  margin-top:3px;
}

.result-stat.correct > span{
  color:#34d399;
  background:rgba(16,185,129,.12);
}

.result-stat.correct b{
  color:#34d399;
}

.result-stat.wrong > span{
  color:#f87171;
  background:rgba(239,68,68,.12);
}

.result-stat.wrong b{
  color:#f87171;
}

.result-stat.skipped > span{
  color:#94a3b8;
  background:rgba(148,163,184,.12);
}

.result-stat.skipped b{
  color:#cbd5e1;
}

.time-result{
  display:flex;
  align-items:center;
  gap:11px;
  padding:11px 12px;
  margin-bottom:13px;
  border-radius:10px;
  background:#0b1850;
  border:1px solid #16286e;
}

.time-result-icon{
  width:34px;
  height:34px;
  border-radius:9px;
  display:grid;
  place-items:center;
  color:#8fa6ff;
  background:#14247a;
}

.time-result small{
  display:block;
  font-size:10px;
  color:#7f92d0;
  margin-bottom:3px;
}

.time-result b{
  display:block;
  font-size:14px;
  color:#fff;
}

.view-result-btn{
  width:100%;
  height:44px;
  border:0;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  color:#fff;
  font-size:14px;
  font-weight:600;
  background:linear-gradient(
    90deg,
    #7c3aed,
    #4f5bf5 50%,
    #0ea5e9
  );
  box-shadow:0 7px 20px rgba(79,91,245,.30);
}

.view-result-btn:hover{
  filter:brightness(1.1);
}
.sum-head,.rec-head{display:flex;align-items:center;gap:12px}
.sum-head{margin-bottom:16px;padding-left:2px}
.sum-ico{color:#8fa6ff;display:grid}
.sum-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tile{display:flex;align-items:center;gap:12px;height:78px;padding:0 12px;border-radius:12px;background:#0b1850;border:1px solid #16286e}
.tile b{display:block;font-size:15px;font-weight:600;line-height:1.2}
.tile small{font-size:11px}
.t-ico{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex:none;background:#14247a;color:#8fa6ff}
.t-ico.orange{color:#f59e0b;background:#2a2470}
.recent{padding:20px 16px 8px}
.rec-head{margin-bottom:10px;padding-left:2px}
.rec-head a{margin-left:auto;display:flex;align-items:center;gap:5px;font-size:11px;color:#a5b4ff;text-decoration:underline;text-underline-offset:2px}
.recent ul{
  list-style:none;
  margin:0;
  padding:0;
  max-height:270px;
  overflow-y:auto;
  scrollbar-width:thin;
  scrollbar-color:#3347a0 transparent;
  padding-right:6px;
}
.recent li{display:flex;align-items:center;gap:14px;padding:10px 0;color:#9fb0e8}
.recent li + li{border-top:1px solid #12215f}
.r-ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;flex:none;background:#16257f;border:1px solid #23379a;color:#a9a6ff}
.r-ico.blue{color:#6ea8ff;background:#13267f}
.r-ico.python{background:#12267c}
.r-text{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.r-text b{font-size:13px;font-weight:600;color:#fff}
.r-text small{font-size:11px;color:#7d92d8}
.ago{display:flex;align-items:center;gap:5px;font-size:11px;color:#8fa2e8}
.ago i{width:5px;height:5px;background:#5b8cff;transform:rotate(45deg)}
.cta{position:relative;overflow:hidden;height:146px;padding:22px 18px;background:linear-gradient(120deg,#0b1544,#101c62)}
.trophy{position:absolute;left:18px;top:22px;color:#f5b301;width:40px;height:40px;display:grid;place-items:center}
.cta p{margin-left:56px;font-size:13px;font-weight:600;line-height:1.45;position:relative}
.cta button{position:absolute;left:40px;bottom:20px;display:flex;align-items:center;gap:10px;height:40px;padding:0 22px;border:0;border-radius:10px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(90deg,#6d3bf0,#3b6cff)}
.mount{position:absolute;right:0;bottom:0;width:190px}

 /* =========================
   VIEW RESULT MODAL
========================= */

.result-modal-overlay{
  position:fixed;
  inset:0;
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:28px;
  background:rgba(2,6,23,.78);
  backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px);
}

.result-modal{
  width:min(760px,100%);
  max-height:calc(100vh - 56px);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:18px;
  background:#07113b;
  border:1px solid #293b91;
  box-shadow:
    0 25px 80px rgba(0,0,0,.55),
    0 0 0 1px rgba(124,92,255,.08);
}

.result-modal-header{
  flex:none;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:18px 20px;
  border-bottom:1px solid #17286b;
  background:linear-gradient(
    90deg,
    #0b1650,
    #0a143f
  );
}

.result-modal-title{
  display:flex;
  align-items:center;
  gap:12px;
}

.result-modal-icon{
  width:42px;
  height:42px;
  border-radius:11px;
  display:grid;
  place-items:center;
  color:#a78bfa;
  background:#16247a;
  border:1px solid #293b91;
}

.result-modal-title h2{
  font-size:18px;
  font-weight:600;
  margin:0 0 3px;
}

.result-modal-title small{
  color:#8b9bd0;
  font-size:11px;
}

.result-modal-close{
  width:38px;
  height:38px;
  border:1px solid #263986;
  border-radius:9px;
  background:#0b1850;
  color:#cbd5ff;
  display:grid;
  place-items:center;
  font-size:25px;
  line-height:1;
  cursor:pointer;
}

.result-modal-close:hover{
  background:#182978;
  color:#fff;
}

.modal-score{
  flex:none;
  margin:16px 20px 12px;
  padding:16px;
  text-align:center;
  border-radius:13px;
  background:linear-gradient(
    135deg,
    rgba(124,58,237,.20),
    rgba(59,130,246,.12)
  );
  border:1px solid #293b91;
}

.modal-score strong{
  display:block;
  font-size:30px;
  font-weight:700;
  background:linear-gradient(
    90deg,
    #a78bfa,
    #60a5fa
  );
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}

.modal-score span{
  display:block;
  margin-top:5px;
  color:#b8c6ef;
  font-size:12px;
}

.modal-stats{
  flex:none;
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:9px;
  margin:0 20px 12px;
}

.modal-stat{
  text-align:center;
  padding:10px;
  border-radius:10px;
  background:#0b1850;
  border:1px solid #16286e;
}

.modal-stat b{
  display:block;
  font-size:18px;
  color:#fff;
}

.modal-stat small{
  display:block;
  margin-top:3px;
  font-size:10px;
  color:#8b9bd0;
}

.modal-stat.correct b{
  color:#34d399;
}

.modal-stat.wrong b{
  color:#f87171;
}

.modal-stat.skipped b{
  color:#cbd5e1;
}

.modal-time{
  flex:none;
  display:flex;
  align-items:center;
  gap:10px;
  margin:0 20px 14px;
  padding:10px 12px;
  border-radius:10px;
  background:#0b1850;
  border:1px solid #16286e;
}

.modal-time > span{
  width:34px;
  height:34px;
  border-radius:9px;
  display:grid;
  place-items:center;
  color:#8fa6ff;
  background:#14247a;
}

.modal-time small{
  display:block;
  font-size:10px;
  color:#7f92d0;
  margin-bottom:2px;
}

.modal-time b{
  font-size:14px;
  color:#fff;
}

/* =========================
   ANSWER REVIEW
========================= */

.modal-answer-review{
  flex:1;
  min-height:0;
  overflow-y:auto;
  padding:0 20px 8px;
  scrollbar-width:thin;
  scrollbar-color:#3347a0 transparent;
}

.modal-review-question{
  padding:15px;
  margin-bottom:10px;
  border-radius:11px;
  background:#0b1850;
  border:1px solid #16286e;
}

.modal-review-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:9px;
}

.modal-review-top > span{
  font-size:11px;
  font-weight:600;
  color:#aebcff;
  background:#14247a;
  padding:4px 9px;
  border-radius:6px;
}

.modal-review-top strong{
  font-size:10px;
  padding:4px 9px;
  border-radius:6px;
}

.status-correct{
  color:#34d399;
  background:rgba(16,185,129,.12);
}

.status-wrong{
  color:#f87171;
  background:rgba(239,68,68,.12);
}

.status-skipped{
  color:#94a3b8;
  background:rgba(148,163,184,.12);
}

.modal-review-question h4{
  font-size:13px;
  line-height:1.5;
  font-weight:600;
  color:#eef2ff;
  margin:0 0 10px;
}

.modal-review-answer{
  padding:9px 10px;
  margin-top:7px;
  border-radius:7px;
  background:#081440;
  border:1px solid #14255f;
}

.modal-review-answer small{
  display:block;
  font-size:9px;
  color:#7f92d0;
  margin-bottom:3px;
}

.modal-review-answer p{
  margin:0;
  font-size:11px;
  line-height:1.45;
  color:#e1e7ff;
}

.modal-correct-answer{
  border-color:rgba(52,211,153,.20);
}

.modal-correct-answer p{
  color:#6ee7b7;
}

.modal-review-explanation{
  display:flex;
  align-items:flex-start;
  gap:7px;
  margin-top:8px;
  padding:9px 10px;
  border-radius:7px;
  background:rgba(251,191,36,.06);
  border:1px solid rgba(251,191,36,.12);
  color:#fbbf24;
}

.modal-review-explanation p{
  margin:0;
  font-size:10px;
  line-height:1.5;
  color:#cbd5e1;
}

/* =========================
   MODAL FOOTER
========================= */

.result-modal-footer{
  flex:none;
  padding:14px 20px 18px;
  border-top:1px solid #17286b;
  background:#07113b;
}

.modal-back-btn{
  width:100%;
  height:42px;
  border:1px solid #293b91;
  border-radius:9px;
  background:#0d1b58;
  color:#dbe3ff;
  font-size:13px;
  font-weight:600;
  cursor:pointer;
}

.modal-back-btn:hover{
  background:#16247a;
}

/* =========================
   MOBILE
========================= */

@media (max-width:700px){

  .result-modal-overlay{
    padding:12px;
    align-items:center;
  }

  .result-modal{
    max-height:calc(100vh - 24px);
    border-radius:15px;
  }

  .result-modal-header{
    padding:14px;
  }

  .modal-score{
    margin-left:14px;
    margin-right:14px;
  }

  .modal-stats{
    margin-left:14px;
    margin-right:14px;
  }

  .modal-time{
    margin-left:14px;
    margin-right:14px;
  }

  .modal-answer-review{
    padding-left:14px;
    padding-right:14px;
  }

  .result-modal-footer{
    padding-left:14px;
    padding-right:14px;
  }
}

@media (max-width:1200px){
  .grid{grid-template-columns:1fr}
  .settings,.preview{height:auto}
  .q-scroll{max-height:640px}
  .hero-quote,.hero-art{display:none}
  
   
}
`;
