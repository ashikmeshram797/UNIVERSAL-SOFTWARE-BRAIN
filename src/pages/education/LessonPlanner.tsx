import React, { useState, useEffect, type ReactNode,type JSX } from 'react';
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const I = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const Search=()=> <I><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></I>;
const Bell=()=> <I><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></I>;
const Book=({size=20}:{size?:number})=><I size={size}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21M8 7h8M8 11h8M8 15h5"/></I>;
const Spark=()=> <I><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></I>;
const Target=()=> <I><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></I>;
const Bulb=()=> <I><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></I>;
const Activity=()=> <I><path d="M4 19V5"/><path d="M4 6c5-4 7 4 12 0 2-1.6 3-1 4 0v11c-1-1-2-1-4 0-5 4-7-4-12 0"/></I>;
const Clip=()=> <I><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M8 10h8M8 14h6M8 18h4"/></I>;
const Clock=()=> <I><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></I>;
const Save=()=> <I><path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></I>;
const Download=()=> <I><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></I>;
const Right=()=> <I size={14}><path d="M4 12h15M13 6l6 6-6 6"/></I>;
const Down=()=> <I size={15}><path d="m6 9 6 6 6-6"/></I>;



export default function LessonPlanner(): JSX.Element {
  const [subject,setSubject]=useState('Mathematics');
  const [topic,setTopic]=useState('Quadratic Equations');
  const [grade,setGrade]=useState('10th Grade');
  const [duration,setDuration]=useState('45 Minutes');
  const [objectives,setObjectives]=useState('e.g. Understand the concept of quadratic equations, learn the formula, solve problems...');
  const [tab,setTab]=useState('Lesson Plan');
  const [menu,setMenu]=useState(false);
  const [lessonPlan, setLessonPlan] = useState<string>("");
const [generating, setGenerating] = useState(false);
const [recentPlans, setRecentPlans] = useState<any[]>([]);
const [recentLoading, setRecentLoading] = useState(false);
const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
const [resources, setResources] = useState<any>({
  wikipedia: [],
  google_books: [],
  youtube: [],
  educational_sites: [],
});

const [resourcesLoading, setResourcesLoading] = useState(false);

const handleGenerateLessonPlan = async () => {
  if (!subject.trim()) {
    alert("Please enter a subject.");
    return;
  }

  if (!topic.trim()) {
    alert("Please enter a topic.");
    return;
  }

  if (!grade.trim()) {
    alert("Please enter a grade or class.");
    return;
  }

  if (!duration.trim()) {
    alert("Please enter a duration.");
    return;
  }

  if (!objectives.trim()) {
    alert("Please enter learning objectives.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  try {
    setGenerating(true);

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/lesson/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          topic,
          grade,
          duration,
          objectives,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate lesson plan."
      );
    }

    setLessonPlan(data.lesson_plan || "");
    await fetchLessonResources();
    setTab("Lesson Plan");

  } catch (error) {
    console.error("LESSON PLAN ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );

  } finally {
    setGenerating(false);
  }
};

const handleSaveLessonPlan = async () => {
  if (!lessonPlan.trim()) {
    alert("Please generate a lesson plan first.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/education/lesson/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          topic,
          grade,
          duration,
          objectives,
          lesson_plan: lessonPlan,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save lesson plan."
      );
    }
     setSelectedPlanId(data.lesson_plan_id);
     
    await fetchRecentLessonPlans();
    alert("Lesson plan saved successfully.");

  } catch (error) {
    console.error("LESSON PLAN SAVE ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to save lesson plan."
    );
  }
};

const fetchRecentLessonPlans = async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {

    setRecentLoading(true);

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/lesson/recent",
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
        data.message || "Failed to fetch recent lesson plans."
      );
    }

    setRecentPlans(data.lesson_plans || []);

  } catch (error) {

    console.error(
      "RECENT LESSON PLANS ERROR:",
      error
    );

  } finally {

    setRecentLoading(false);

  }
};
const handleOpenRecentPlan = (plan: any) => {
  setSelectedPlanId(plan.id);

  setSubject(plan.subject || "");
  setTopic(plan.topic || "");
  setGrade(plan.grade || "");
  setDuration(plan.duration || "");
  setObjectives(plan.objectives || "");

  setLessonPlan(plan.lesson_plan || "");

  // Always open the actual saved lesson plan
  setTab("Lesson Plan");
};
useEffect(() => {
  fetchRecentLessonPlans();
}, []);

const fetchLessonResources = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  try {
    setResourcesLoading(true);

    const response = await fetch(
      "http://127.0.0.1:5000/api/education/lesson/resources",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          topic,
          grade,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch resources."
      );
    }

    setResources(data.resources || {
      wikipedia: [],
      google_books: [],
      youtube: [],
      educational_sites: [],
    });

  } catch (error) {
    console.error("RESOURCE FETCH ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to fetch resources."
    );
  } finally {
    setResourcesLoading(false);
  }
};
  return <div className="lesson-app"><style>{CSS}</style>
    <header className="topbar">
      <div className="brand"><div className="brand-logo"><Book size={34}/></div><div><b>Universal Software Brain</b><small>Build • Learn • Create • Grow</small></div></div>
      <label className="search"><Search/><input placeholder="Search anything..."/><kbd>Ctrl K</kbd></label>
      <div className="top-right"><span className="online"><i/> Online</span><button className="icon-btn"><Bell/><em/></button><button className="user" onClick={()=>setMenu(!menu)}><span>A</span><b>Ashik</b><Down/></button></div>
    </header>
    {menu&&<div className="user-menu"><div>Profile</div><div>Settings</div><div>Logout</div></div>}

    <main className="page">
      <section className="hero">
        <div className="hero-icon"><Clip/></div>
        <div className="hero-copy"><label>LESSON PLANNER</label><h1>Plan Smarter. <span>Teach Better.</span></h1><p>Create structured, AI-powered lesson plans with objectives,<br/>activities, resources and assessments – in minutes.</p></div>
        <div className="hero-art"><div className="hand">Better Plans<br/><span>Brighter Classrooms</span></div><div className="books">✎<i/><i/><i/></div></div>
      </section>

      <div className="layout">
        <section className="panel form-panel">
          <div className="form-title"><Spark/><div><b>Create Lesson Plan</b><small>Fill in the details to generate a structured<br/>lesson plan using AI.</small></div></div>
          <Field label="Subject">
  <SmartSelect
    value={subject}
    onChange={setSubject}
    placeholder="Enter or select subject"
    options={[
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "English",
      "History",
      "Geography",
    ]}
  />
</Field>
          <Field label="Topic">
  <SmartSelect
    value={topic}
    onChange={setTopic}
    placeholder="Enter or select topic"
    options={[
      "Quadratic Equations",
      "Linear Equations",
      "Polynomials",
      "Trigonometry",
      "Probability",
      "Statistics",
      "Calculus",
    ]}
  />
</Field>
           <Field label="Grade / Class">
  <SmartSelect
    value={grade}
    onChange={setGrade}
    placeholder="Enter or select grade"
    options={[
      "8th Grade",
      "9th Grade",
      "10th Grade",
      "11th Grade",
      "12th Grade",
      "Diploma",
      "B.Tech 1st Year",
      "B.Tech 2nd Year",
      "B.Tech 3rd Year",
      "B.Tech 4th Year",
    ]}
  />
</Field>
           <Field label="Duration">
  <SmartSelect
    value={duration}
    onChange={setDuration}
    placeholder="Enter or select duration"
    options={[
      "30 Minutes",
      "45 Minutes",
      "60 Minutes",
      "90 Minutes",
      "120 Minutes",
      "2 Hours",
    ]}
  />
</Field>
          <div className="field"><label><Target/> Learning Objectives</label><textarea value={objectives} onChange={e=>setObjectives(e.target.value)}/></div>
          <button
  className="generate"
  onClick={handleGenerateLessonPlan}
  disabled={generating}
>
  <Spark />
  {generating ? "Generating..." : "Generate Lesson Plan"}
  {!generating && <Right />}
</button>
        </section>

        <section className="panel plan-panel">
          <nav className="tabs">
            {['Lesson Plan','Resources','Activities','Assessment'].map((x,i)=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{i===0?<Book/>:i===1?<Book/>:i===2?<Activity/>:<Clip/>}{x}</button>)}
            <div className="tab-actions"><button onClick={handleSaveLessonPlan}><Save/> Save</button><button><Download/> Download</button></div>
          </nav>
          <div className="plan-head"><div className="plan-icon"><Book/></div><div><b>{topic}</b><small>{subject} <span>•</span> {grade} <span>•</span> {duration}</small></div><label>✦ AI Generated</label><time>Mon, 29 Sept, 2025 • 10:24 AM</time></div>
          {tab === 'Lesson Plan' && (
  lessonPlan ? (
    <GeneratedLessonPlan plan={lessonPlan} />
  ) : (
    <LessonBody />
  )
)}
          {tab === "Resources" && (
  <ResourcesTab
    resources={resources}
    loading={resourcesLoading}
  />
)}
          {tab==='Activities'&&<Alt title="Classroom Activities" items={['Pair-based equation solving','Real-life area problem activity','Create-your-own-equation challenge']}/>} 
          {tab==='Assessment'&&<Alt title="Assessment Plan" items={['5-minute concept check','Worksheet evaluation','Exit ticket: solve one quadratic equation']}/>} 
        </section>

        <aside className="side">
          <section className="panel recent-panel"><SideHead icon={<Clock/>} title="Recent Lesson Plans"/>
          <div>

  {recentLoading ? (

    <div className="recent-loading">
      Loading recent lesson plans...
    </div>

  ) : recentPlans.length === 0 ? (

    <div className="recent-empty">
      No saved lesson plans yet.
    </div>

  ) : (

    recentPlans.map((plan) => (

      <button
        className="recent-row"
        key={plan.id}
         onClick={() => handleOpenRecentPlan(plan)}
      >

        <span className="recent-icon purple">
          ▤
        </span>

        <span className="recent-text">

          <b>{plan.topic}</b>

          <small>
            {plan.subject} • {plan.grade} • {plan.duration}
          </small>

          <em>
            {plan.created_at
              ? new Date(plan.created_at).toLocaleDateString()
              : ""}
          </em>

        </span>

        <Right />

      </button>

    ))

  )}

</div></section>
          <section className="panel promo-panel">
            <img className="promo-image" src="/lesson-planner-promo.png" alt="Plan today, make a difference tomorrow" />
          </section>
        </aside>
      </div>
    </main>
  </div>;
}
function SmartSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="smart-select">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
        }}
      />

      <Down />

      {open && (
        <div className="smart-options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option}
                onMouseDown={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="no-option">
              Press Enter or continue typing
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function ResourcesTab({
  resources,
  loading,
}: {
  resources: any;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="alt">
        <div className="resource-loading">
          <div className="resource-spinner" />
          <h2>Finding learning resources...</h2>
          <p>
            Searching Wikipedia, Google Books, YouTube
            and educational websites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-content">

      {/* Wikipedia */}
      <ResourceSection
        icon="📚"
        title="Wikipedia"
        items={resources.wikipedia}
      />

      {/* Google Books */}
      <ResourceSection
        icon="📖"
        title="Google Books"
        items={resources.google_books}
      />

      {/* Educational Sites */}
      <ResourceSection
        icon="🌐"
        title="Educational Websites"
        items={resources.educational_sites}
      />

      {/* YouTube */}
      <ResourceSection
        icon="▶️"
        title="YouTube"
        items={resources.youtube}
      />

    </div>
  );
}
function ResourceSection({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: any[];
}) {
  return (
    <section className="resource-section">

      <div className="resource-section-head">
        <div className="resource-section-icon">
          {icon}
        </div>

        <div>
          <h2>{title}</h2>
          <span>
            {items.length} resource{items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="resource-empty">
          No resources found.
        </div>
      ) : (
        <div className="resource-grid">
          {items.map((item, index) => (
            <ResourceCard
              key={`${item.type}-${index}`}
              item={item}
            />
          ))}
        </div>
      )}

    </section>
  );
}
function ResourceCard({
  item,
}: {
  item: any;
}) {
  return (
    <article className="resource-card">

      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="resource-thumbnail"
        />
      )}

      <div className="resource-card-body">

        <div className="resource-type">
          {item.type === "wikipedia" && "📚 Wikipedia"}

          {item.type === "google_books" && "📖 Google Books"}

          {item.type === "youtube" && "▶️ YouTube"}

          {item.type === "educational_site" &&
            "🌐 Educational"}
        </div>

        <h3>{item.title}</h3>

        {item.author && (
          <div className="resource-author">
            {item.author}
          </div>
        )}

        {item.channel && (
          <div className="resource-author">
            {item.channel}
          </div>
        )}

        <p>
          {item.description ||
            "Educational resource related to this lesson topic."}
        </p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-link"
        >
          Open Resource
          <Right />
        </a>

      </div>

    </article>
  );
}
function Field({label,children}:{label:string;children:ReactNode}){return <div className="field"><label>{label}</label><div className="control">{children}</div></div>}
function SideHead({icon,title}:{icon:ReactNode;title:string}){return <div className="side-head"><div>{icon}<b>{title}</b></div><button>View Details <Right/></button></div>}
function Step({
  n,
  icon,
  title,
  time,
  items
}: {
  n: number;
  icon: ReactNode;
  title: string;
  time?: string;
  items: string[];
}) {
  return (
    <div className="step">
      <span>{n}</span>

      <div>
        <h3>
          {icon}
          <b>{title}</b>
          {time && <small>({time})</small>}
        </h3>

        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {item}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


 function GeneratedLessonPlan({
  plan,
}: {
  plan: string;
}) {
  const sections = parseLessonPlan(plan);

  const sectionConfig = [
    {
      key: "learning objectives",
      n: 1,
      icon: <Target />,
      title: "Learning Objectives",
    },
    {
      key: "introduction",
      n: 2,
      icon: <Bulb />,
      title: "Introduction",
    },
    {
      key: "main content",
      n: 3,
      icon: <Book />,
      title: "Main Content",
    },
    {
      key: "practice & activity",
      n: 4,
      icon: <Activity />,
      title: "Practice & Activity",
    },
    {
      key: "conclusion",
      n: 5,
      icon: <Bulb />,
      title: "Conclusion",
    },
  ];

  return (
    <div className="content generated-plan-scroll">
      {sectionConfig.map((section) => {
        const content = sections[section.key];

        if (!content || content.length === 0) {
          return null;
        }

        return (
          <Step
            key={section.key}
            n={section.n}
            icon={section.icon}
            title={section.title}
            items={content}
          />
        );
      })}
    </div>
  );
}
 function parseLessonPlan(
  plan: string
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  let currentSection = "";

  const lines = plan
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const cleanLine = line
      .replace(/^#+\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .replace(/\*\*/g, "")
      .trim();

    const normalized = cleanLine.toLowerCase();

    // Learning Objectives
    if (normalized.includes("learning objectives")) {
      currentSection = "learning objectives";
      result[currentSection] = [];
      continue;
    }

    // Introduction
    if (
      normalized === "introduction" ||
      normalized.startsWith("introduction ")
    ) {
      currentSection = "introduction";
      result[currentSection] = [];
      continue;
    }

    // Main Content
    if (
      normalized === "main content" ||
      normalized.startsWith("main content ")
    ) {
      currentSection = "main content";
      result[currentSection] = [];
      continue;
    }

    // Practice & Activity
    if (
      normalized.includes("practice & activity") ||
      normalized.includes("practice and activity")
    ) {
      currentSection = "practice & activity";
      result[currentSection] = [];
      continue;
    }

    // Conclusion
    if (
      normalized === "conclusion" ||
      normalized.startsWith("conclusion ")
    ) {
      currentSection = "conclusion";
      result[currentSection] = [];
      continue;
    }

    // Content
    if (currentSection) {
      const content = cleanLine
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+\)\s*/, "")
        .trim();

      if (content) {
        result[currentSection].push(content);
      }
    }
  }

  return result;
}
function LessonBody(){return <div className="content"><Step n={1} icon={<Target/>} title="Learning Objectives" items={['Understand the concept of quadratic equations.','Learn the standard form and general formula.','Solve quadratic equations using different methods (factorization, formula, completing square).','Apply the concept to real-life problems.']}/><Step n={2} icon={<Bulb/>} title="Introduction" time="5 minutes" items={['Start with a real-life example (e.g., area of a rectangle).','Ask students what they think a quadratic equation is.','Briefly explain the need for a formula to solve such equations.']}/><Step n={3} icon={<Book/>} title="Main Content" time="20 minutes" items={['Explain the standard form: ax² + bx + c = 0.','Derive and explain the quadratic formula.','Show examples with step-by-step solutions.','Discuss different methods (factorization, formula, completing square).']}/><Step n={4} icon={<Activity/>} title="Practice & Activity" time="15 minutes" items={['Solve worksheet problems (individual or pair work).','Discuss solutions and common mistakes.','Ask students to create their own quadratic equation from a given situation.']}/><Step n={5} icon={<Bulb/>} title="Conclusion" time="5 minutes" items={['Recap key points and formulas.','Answer any remaining questions.','Give a short exit ticket (one quick question).']}/></div>}
function Alt({title,items}:{title:string;items:string[]}){return <div className="alt"><h2>{title}</h2>{items.map(x=><div className="alt-item" key={x}><Book/>{x}</div>)}</div>}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@500;600&display=swap');
.lesson-app{--bg:#030a1d;--panel:#081833;--line:#17376e;--text:#f2f5ff;--muted:#91a7d5;min-height:100vh;background:radial-gradient(1000px 500px at 50% -10%,#102b62 0,transparent 65%),var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif}.lesson-app *{box-sizing:border-box}.lesson-app button,.lesson-app input,.lesson-app select,.lesson-app textarea{font:inherit}.lesson-app button{color:inherit;cursor:pointer}
.topbar{height:84px;padding:0 32px;display:flex;align-items:center;gap:25px;background:#040d25;border-bottom:1px solid #112653}.brand{display:flex;align-items:center;gap:13px;min-width:390px}.brand-logo{color:#e9ddff;filter:drop-shadow(0 0 10px #784dff)}.brand b{display:block;font-size:20px}.brand small{display:block;color:#8ea4d3;font-size:13px;margin-top:3px}.search{height:44px;flex:1;max-width:565px;margin:auto;display:flex;align-items:center;gap:11px;padding:0 14px;border:1px solid #173a76;border-radius:13px;background:#081a3a;color:#b8c9ec}.search input{flex:1;min-width:0;border:0;outline:0;background:none;color:#fff}.search input::placeholder{color:#94a7cc}.search kbd{padding:4px 8px;border:1px solid #25457b;border-radius:6px;background:#0b2147;color:#b9c9e7;font-size:12px}.top-right{display:flex;align-items:center;gap:22px}.online{display:flex;align-items:center;gap:9px;padding:10px 16px;border-radius:99px;background:#062d30;color:#25e99b;font-weight:700;font-size:14px}.online i{width:12px;height:12px;border-radius:50%;background:#18e394;box-shadow:0 0 11px #18e394}.icon-btn,.user{border:0;background:none}.icon-btn{position:relative}.icon-btn em{position:absolute;right:0;top:0;width:7px;height:7px;border-radius:50%;background:#ff3d58}.user{display:flex;align-items:center;gap:9px}.user>span{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#3f8cff,#2461da);font-size:18px}.user-menu{position:absolute;z-index:20;right:25px;top:73px;padding:7px;width:150px;border:1px solid #1d3d76;border-radius:12px;background:#091833;box-shadow:0 15px 40px #0008}.user-menu div{padding:10px;border-radius:8px}.user-menu div:hover{background:#112853}
.page{max-width:1536px;margin:auto;padding:18px 24px 35px}.hero{height:168px;position:relative;display:flex;align-items:center;gap:32px;padding:20px 52px;border-radius:16px;overflow:hidden;border:1px solid #2947a0;background:radial-gradient(500px 220px at 55% 60%,#193d9e,transparent 75%),linear-gradient(105deg,#142275,#102d7f 48%,#10205e)}.hero-icon{width:110px;height:110px;display:grid;place-items:center;flex:none;border-radius:27px;background:linear-gradient(145deg,#704dff,#4032dc);box-shadow:0 0 42px #684cff99}.hero-copy label{font-size:12px;letter-spacing:1px;color:#1fc9ff;font-weight:700}.hero h1{font-size:31px;margin:7px 0 9px}.hero h1 span{color:#6f82ff}.hero p{margin:0;color:#dce5ff;font-size:15px;line-height:1.55}.hero-art{position:absolute;right:35px;top:0;width:410px;height:100%}.hand{position:absolute;right:110px;top:43px;transform:rotate(-7deg);font:25px/1.1 Caveat,cursive;color:#dbe4ff}.hand span{margin-left:14px}.books{position:absolute;right:5px;bottom:0;width:180px;height:130px;font-size:58px;transform:rotate(12deg)}.books i{position:absolute;right:0;width:155px;height:20px;border-radius:4px;background:linear-gradient(90deg,#183b96,#6375e5);box-shadow:0 0 18px #3d5cff55}.books i:nth-child(2){bottom:16px}.books i:nth-child(3){bottom:40px;right:12px;background:linear-gradient(90deg,#3049ad,#7483ec)}.books i:nth-child(4){bottom:64px;right:3px;background:linear-gradient(90deg,#1b3078,#5565cb)}
.layout{display:grid;grid-template-columns:348px minmax(560px,1fr) 355px;gap:14px;margin-top:18px;align-items:start}.panel{border:1px solid var(--line);border-radius:14px;background:linear-gradient(180deg,#091b3a,#07142e)}.form-panel{padding:20px 21px 22px}.form-title{display:flex;gap:11px;margin-bottom:19px}.form-title>svg{color:#9a80ff;filter:drop-shadow(0 0 7px #784dff)}.form-title b{display:block;font-size:15px}.form-title small{display:block;margin-top:7px;color:#89a1d0;font-size:12px;line-height:1.45}.field{margin-top:14px}.field>label{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:#dce6ff;font-size:12px;font-weight:600}.field>label svg{width:16px}.control{position:relative}.control select{width:100%;height:45px;padding:0 37px 0 14px;border:1px solid #1d4380;border-radius:10px;outline:0;background:#0a2044;color:#eaf0ff;appearance:none}.control:after{content:'⌄';position:absolute;right:13px;top:8px;color:#b5c8ee;font-size:20px;pointer-events:none}.field textarea{width:100%;height:98px;padding:12px;border:1px solid #1d4380;border-radius:10px;resize:vertical;outline:0;background:#0a2044;color:#cbd8f5;font-size:12px;line-height:1.5}.generate{width:100%;height:48px;margin-top:18px;display:flex;justify-content:center;align-items:center;gap:9px;border:0;border-radius:10px;background:linear-gradient(90deg,#7939ff,#277fff);box-shadow:0 8px 25px #623fff66;font-weight:700;font-size:13px}
.plan-panel{min-width:0;overflow:hidden}.tabs{height:57px;display:flex;align-items:center;border-bottom:1px solid #163467;padding:0 12px}.tabs>button{height:57px;padding:0 14px;display:flex;align-items:center;gap:8px;border:0;border-bottom:2px solid transparent;background:none;color:#bdcae7;font-size:12px}.tabs>button.active{color:#fff;border-bottom-color:#7b55ff;background:linear-gradient(180deg,transparent,#4d3bff25)}.tab-actions{margin-left:auto;display:flex;gap:8px}.tab-actions button{display:flex;align-items:center;gap:5px;padding:7px 11px;border:1px solid #214378;border-radius:18px;background:#0b2450;font-size:11px}.plan-head{position:relative;display:flex;align-items:center;gap:11px;margin:12px 13px 10px;padding:12px 13px;border:1px solid #163a77;border-radius:10px;background:linear-gradient(90deg,#14276a,#0c2452)}.plan-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(145deg,#794aff,#5235d8);box-shadow:0 0 20px #6844ff66}.plan-head>b{}.plan-head>div:nth-child(2)>b{font-size:17px}.plan-head small{display:block;margin-top:7px;color:#b7c7e8;font-size:11px}.plan-head small span{margin:0 5px;color:#6276aa}.plan-head>label{margin-left:auto;align-self:flex-start;padding:7px 10px;border-radius:16px;background:#07365b;color:#29c9ff;font-size:10px}.plan-head time{position:absolute;right:12px;bottom:9px;color:#7e98c8;font-size:9px}.content{padding:0 13px}.step{display:grid;grid-template-columns:38px 1fr;gap:9px;margin-bottom:6px;padding:11px 14px;border:1px solid #143463;border-radius:9px;background:#091a37}.step>span{width:31px;height:31px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#1166d6,#153caa);font-weight:700}.step h3{display:flex;align-items:center;gap:7px;margin:0;color:#eaf0ff;font-size:12px}.step h3 svg{width:19px}.step h3 small{font-size:11px;color:#9db0d8;font-weight:400}.step ul{margin:7px 0 0;padding-left:19px;color:#b5c5e4;font-size:10.5px;line-height:1.65}.alt{padding:20px 25px;min-height:470px}.alt h2{font-size:18px}.alt-item{display:flex;gap:10px;align-items:center;padding:14px;margin:12px 0;border:1px solid #17386e;border-radius:10px;background:#091a37;color:#cbd8f5}
.resources-content{
  padding:14px;
  max-height:620px;
  overflow-y:auto;
}

.resource-section{
  margin-bottom:22px;
}

.resource-section-head{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
}

.resource-section-icon{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:10px;
  background:#132d63;
  font-size:19px;
}

.resource-section-head h2{
  margin:0;
  color:#edf3ff;
  font-size:15px;
}

.resource-section-head span{
  display:block;
  margin-top:3px;
  color:#7890bd;
  font-size:10px;
}

.resource-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
}

.resource-card{
  display:flex;
  flex-direction:column;
  border:1px solid #17386e;
  border-radius:11px;
  overflow:hidden;
  background:#091a37;
}

.resource-thumbnail{
  width:100%;
  height:130px;
  object-fit:cover;
  background:#0b2147;
}

.resource-card-body{
  padding:13px;
}

.resource-type{
  color:#7d9eff;
  font-size:9px;
  font-weight:700;
  margin-bottom:6px;
  text-transform:uppercase;
}

.resource-card h3{
  margin:0 0 6px;
  color:#edf3ff;
  font-size:13px;
  line-height:1.4;
}

.resource-author{
  color:#8fa8d4;
  font-size:10px;
  margin-bottom:6px;
}

.resource-card p{
  margin:0 0 12px;
  color:#aebfdf;
  font-size:10px;
  line-height:1.5;
}

.resource-link{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:8px 10px;
  border:1px solid #244987;
  border-radius:7px;
  color:#b9caff;
  text-decoration:none;
  font-size:10px;
}

.resource-link:hover{
  background:#112d60;
  color:#fff;
}

.resource-empty{
  padding:15px;
  border:1px dashed #244477;
  border-radius:9px;
  color:#8098c2;
  font-size:11px;
}

.resource-loading{
  min-height:350px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  color:#aebfdf;
}

.resource-loading h2{
  color:#edf3ff;
  font-size:16px;
  margin:12px 0 5px;
}

.resource-loading p{
  color:#8198c1;
  font-size:11px;
}

.resource-spinner{
  width:32px;
  height:32px;
  border:3px solid #214477;
  border-top-color:#7b55ff;
  border-radius:50%;
  animation:resourceSpin .8s linear infinite;
}

@keyframes resourceSpin{
  to{
    transform:rotate(360deg);
  }
}
.side{display:flex;flex-direction:column;gap:14px}.recent-panel{padding:17px 14px}.promo-panel{height:254px;overflow:hidden;padding:0;background:#0a1740} .promo-image{display:block;width:100%;height:100%;object-fit:cover;object-position:center;border-radius:13px}.side-head{display:flex;justify-content:space-between;align-items:center;margin:0 5px 12px}.side-head>div{display:flex;align-items:center;gap:8px;font-size:13px}.side-head button{display:flex;align-items:center;gap:4px;border:0;background:none;color:#55aaff;font-size:10px}.recent-row{width:100%;min-height:64px;padding:8px 5px;display:flex;align-items:center;gap:10px;border:0;border-top:1px solid #142f5d;background:none;text-align:left}.recent-row:first-child{border-top:0}.recent-icon{width:39px;height:39px;display:grid;place-items:center;flex:none;border-radius:10px;font-size:20px}.purple{background:#6235cf;color:#e9dcff}.green{background:#078b68;color:#bfffe8}.blue{background:#1b63c8;color:#d5ebff}.orange{background:#c75d12;color:#ffe2bb}.pink{background:#bb2d68;color:#ffd8e8}.recent-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.recent-text b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.recent-text small,.recent-text em{font-size:9px;color:#9bb0d7}.recent-text em{color:#7187b4;font-style:normal}@media(max-width:1250px){.layout{grid-template-columns:310px minmax(500px,1fr)}.side{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr}.brand{min-width:300px}}@media(max-width:900px){.topbar{padding:0 16px}.brand{min-width:auto}.brand small,.search,.online{display:none}.layout{grid-template-columns:1fr}.side{grid-column:auto;display:flex}.hero-art{display:none}.tabs{overflow:auto}.tab-actions{display:none}}@media(max-width:600px){.page{padding:12px}.topbar{height:70px}.brand b{font-size:16px}.hero{height:auto;min-height:190px;padding:22px}.hero-icon{width:76px;height:76px}.hero h1{font-size:25px}.hero p br{display:none}.plan-head{padding-bottom:38px}.plan-head>label{position:absolute;right:10px;top:10px}.step{grid-template-columns:32px 1fr}.stats{grid-template-columns:1fr 1fr}}
.smart-select{
  position:relative;
  width:100%;
}

.smart-select input{
  width:100%;
  height:44px;
  padding:0 42px 0 14px;
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  background:rgba(255,255,255,.04);
  color:inherit;
  outline:none;
  font:inherit;
  box-sizing:border-box;
}

.smart-select input:focus{
  border-color:rgba(143,166,255,.65);
}

.smart-select > svg{
  position:absolute;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  pointer-events:none;
}

.smart-options{
  position:absolute;
  z-index:50;
  top:calc(100% + 6px);
  left:0;
  right:0;
  max-height:210px;
  overflow-y:auto;
  padding:6px;
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  background:#171b2a;
  box-shadow:0 12px 30px rgba(0,0,0,.35);
}

.smart-options button{
  width:100%;
  border:0;
  background:transparent;
  color:inherit;
  text-align:left;
  padding:10px 12px;
  border-radius:7px;
  cursor:pointer;
  font:inherit;
}

.smart-options button:hover{
  background:rgba(255,255,255,.08);
}

.no-option{
  padding:10px 12px;
  opacity:.55;
  font-size:13px;
}
  .generated-plan{
  padding:4px 2px 20px;
}

.generated-heading{
  margin:22px 0 10px;
  font-size:18px;
  font-weight:700;
  color:#dfe6ff;
}

.generated-heading:first-child{
  margin-top:0;
}

.generated-text{
  margin:7px 0;
  line-height:1.7;
  color:#c9d0e5;
  font-size:14px;
}

.generated-bullet{
  margin:6px 0 6px 22px;
  padding-left:4px;
  line-height:1.65;
  color:#c9d0e5;
  font-size:14px;
}

.plan-space{
  height:5px;
}
  .generated-plan-scroll {
  max-height: 620px;
  overflow-y: auto;
  padding-right: 10px;
}

.generated-plan-scroll::-webkit-scrollbar {
  width: 6px;
}

.generated-plan-scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
}

.generated-plan-scroll::-webkit-scrollbar-track {
  background: transparent;
}
  .recent-row.selected {
  background: #10295a;
  border-color: #315fa8;
  box-shadow: 0 0 0 1px rgba(90, 130, 255, 0.15);
}

.recent-row.selected .recent-text b {
  color: #ffffff;
}
`;
