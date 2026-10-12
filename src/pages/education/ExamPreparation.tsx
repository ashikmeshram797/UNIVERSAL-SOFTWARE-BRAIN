import React, { useState,useEffect } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");
const EDUCATION_API_URL = `${API_BASE_URL}/api/education`;

type IconProps = { size?: number };

const I = ({ children, size = 20 }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Search = ({size=21}:IconProps)=><I size={size}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></I>;
const Bell = ({size=24}:IconProps)=><I size={size}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></I>;
const Down = ({size=16}:IconProps)=><I size={size}><path d="m6 9 6 6 6-6"/></I>;
const Right = ({size=18}:IconProps)=><I size={size}><path d="m9 6 6 6-6 6"/></I>;
const Target = ({size=22}:IconProps)=><I size={size}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m14.8 9.2 2.5-2.5"/></I>;
const Calendar = ({size=21}:IconProps)=><I size={size}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></I>;
const Clock = ({size=19}:IconProps)=><I size={size}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></I>;
const Check = ({size=18}:IconProps)=><I size={size}><path d="m5 12 4 4L19 6"/></I>;
const Chart = ({size=21}:IconProps)=><I size={size}><path d="M4 19V5M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/></I>;
const Book = ({size=21}:IconProps)=><I size={size}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21"/></I>;
const File = ({size=21}:IconProps)=><I size={size}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></I>;
const Trophy = ({size=21}:IconProps)=><I size={size}><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M12 13v5M8 21h8M9 18h6"/></I>;
const Light = ({size=21}:IconProps)=><I size={size}><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></I>;
const Play = ({size=17}:IconProps)=><I size={size}><path d="m9 6 8 6-8 6z"/></I>;

const exams = [
  {date:"08", month:"Feb", title:"GATE 2026", sub:"Computer Science & IT", days:"132 days left", color:"blue"},
  {date:"15", month:"Mar", title:"SSC CGL 2026", sub:"Tier 1", days:"167 days left", color:"teal"},
  {date:"12", month:"Apr", title:"Bank PO 2026", sub:"Prelims", days:"195 days left", color:"orange"},
  {date:"25", month:"May", title:"UPSC 2026", sub:"Prelims", days:"238 days left", color:"pink"},
];

const topics = [
  ["Data Structures & Algorithms","Theory","45 min","2 topics","Completed","green"],
  ["Database Management System","Practice Questions","60 min","15 questions","In Progress","blue"],
  ["Computer Networks","Video Lecture","30 min","1 topic","Not Started","gray"],
  ["Previous Year Paper (2019)","Full Test","180 min","65 questions","Not Started","gray"],
];

const materials = [
  ["GATE 2024 Solved Paper","PDF","2.4 MB","red"],
  ["DSA Notes","PDF","1.8 MB","blue"],
  ["DBMS Short Notes","PDF","980 KB","red"],
  ["CS Important Questions","PDF","1.2 MB","green"],
];

export default function ExamPreparation() {
  const [exam,setExam] = useState("GATE");
  const [branch,setBranch] = useState("Computer Science & IT");
  const [year,setYear] = useState("2026");
  const [menu,setMenu] = useState(false);
  const [examDate, setExamDate] = useState("");
const [dailyHours, setDailyHours] = useState("4");
const [level, setLevel] = useState("Beginner");

const [generating, setGenerating] = useState(false);
const [plan, setPlan] = useState<any>(null);
const [todayPlan, setTodayPlan] = useState<any>(null);
const [todayLoading, setTodayLoading] = useState(false);

const handleGeneratePlan = async () => {
  if (!exam.trim()) {
    alert("Please enter exam name.");
    return;
  }

  if (!branch.trim()) {
    alert("Please enter paper / subject.");
    return;
  }

  if (!examDate) {
    alert("Please select exam date.");
    return;
  }

  if (!dailyHours || Number(dailyHours) <= 0) {
    alert("Please enter valid daily study hours.");
    return;
  }

  try {
    setGenerating(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${EDUCATION_API_URL}/exam/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam: exam.trim(),
          paper: branch.trim(),
          exam_date: examDate,
          daily_hours: Number(dailyHours),
          level,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate study plan.");
    }

    setPlan(data.data);

    console.log("Generated Exam Plan:", data.data);

    alert("Study plan generated successfully.");
  } catch (error: any) {
    console.error("Exam plan generation error:", error);
    alert(error.message || "Something went wrong.");
  } finally {
    setGenerating(false);
  }
};
const handleSavePlan = async () => {
  if (!plan) {
    alert("Please generate a study plan first.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${EDUCATION_API_URL}/exam/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plan),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save study plan."
      );
    }

    alert("Study plan saved successfully.");

    console.log("Saved Exam Preparation:", data);

  } catch (error: any) {
    console.error("Save exam plan error:", error);

    alert(
      error.message || "Something went wrong while saving."
    );
  }
};
const fetchTodayPlan = async () => {
  try {
    setTodayLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${EDUCATION_API_URL}/exam/today`,
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
        data.message || "Failed to fetch today's plan."
      );
    }

    setTodayPlan(data.data);

  } catch (error: any) {
    console.error("Today's plan error:", error);
  } finally {
    setTodayLoading(false);
  }
};
const handleCompleteTask = async (taskId: number) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${EDUCATION_API_URL}/exam/task/${taskId}/complete`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to complete task."
      );
    }

    // Update task immediately in UI
    setTodayPlan((prev: any) => {
      if (!prev) return prev;

      return {
        ...prev,
        day: {
          ...prev.day,
          tasks: prev.day.tasks.map((task: any) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "completed",
                }
              : task
          ),
        },
      };
    });

  } catch (error: any) {
    console.error("Complete task error:", error);

    alert(
      error.message || "Failed to complete task."
    );
  }
};
useEffect(() => {
  fetchTodayPlan();
}, []);
  return <div className="ep">
    <style>{css}</style>

    <header className="topbar">
      <div className="brand">
        <div className="brandmark">◇</div>
        <div><b>Universal Software Brain</b><small>Build • Learn • Create • Grow</small></div>
      </div>
      <div className="search"><Search/><input placeholder="Search anything..."/><kbd>Ctrl K</kbd></div>
      <div className="topright">
        <div className="online"><i/> Online</div>
        <button className="bell"><Bell/><em/></button>
        <button className="profile" onClick={()=>setMenu(!menu)}>
          <span>A</span><b>Ashik</b><Down/>
        </button>
      </div>
      {menu && <div className="profile-menu"><div>Profile</div><div>Settings</div><div>Logout</div></div>}
    </header>

    <main>
      <section className="hero">
        <div className="hero-icon"><File size={56}/><Clock size={23}/></div>
        <div className="hero-copy">
          <label>EXAM PREPARATION</label>
          <h1>Your Goal. <span>Our Support.</span></h1>
          <p>Prepare for your exams with personalized study plans,<br/>practice tests, previous year papers and expert guidance.</p>
          <div className="hero-chips">
            <span>✦ Smart Study Plans</span><span>◉ Practice Tests</span><span>▣ Previous Year Papers</span><span>◇ Performance Analysis</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="dream">Dream<br/>Prepare<br/>Achieve</div>
          <div className="book-scene">
            <div className="pen-cup"><i></i><i></i><i></i><b></b></div>
            <div className="book-stack">
              <div className="book book-1"></div>
              <div className="book book-2"></div>
              <div className="book book-3"></div>
              <div className="book book-4"></div>
            </div>
            <div className="cap">
              <span></span><b></b>
            </div>
          </div>
        </div>
      </section>

      <div className="grid">
        <aside className="left">
          <section className="panel select-panel">
            <h3><Target/> Select Exam</h3>
            <p>Choose your exam and start preparing</p>
            <Field label="Exam Type">
              <input
                list="exam-types"
                value={exam}
                onChange={e => setExam(e.target.value)}
                placeholder="Type or select an exam"
              />
              <datalist id="exam-types">
                <option value="GATE" />
                <option value="CAT" />
                <option value="SSC CGL" />
                <option value="UPSC" />
                <option value="Bank PO" />
              </datalist>
            </Field>
            <Field label="Subject / Paper">
              <input
                list="exam-subjects"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="Type or select a subject"
              />
              <datalist id="exam-subjects">
                <option value="Computer Science & IT" />
                <option value="Data Science & AI" />
                <option value="Electrical Engineering" />
                <option value="Mechanical Engineering" />
              </datalist>
            </Field>
            <Field label="Exam Date">
  <input
    type="date"
    value={examDate}
    onChange={(e) => setExamDate(e.target.value)}
  />
</Field>
<Field label="Daily Study Hours">
  <input
    type="number"
    min="1"
    max="16"
    step="0.5"
    value={dailyHours}
    onChange={(e) => setDailyHours(e.target.value)}
    placeholder="e.g. 4"
  />
</Field>

<Field label="Preparation Level" showDropdown>
  <select
    value={level}
    onChange={(e) => setLevel(e.target.value)}
  >
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>
  </select>
</Field>
            <button
  className="primary"
  onClick={handleGeneratePlan}
  disabled={generating}
>
  ✦
  <span>
    {generating ? "Generating..." : "Get Study Plan"}
  </span>
  <Right size={16} />
</button>
          </section>
          {plan && (
  <section className="generated-plan-section">

    <div className="generated-plan-header">
      <div>
        <h2>AI Study Plan</h2>
        <p>
          {plan.exam} • {plan.paper}
        </p>
      </div>
      <div className="generated-plan-header">
  <div>
    <h2>AI Study Plan</h2>
    <p>
      {plan.exam} • {plan.paper}
    </p>
  </div>

  <button
    className="primary"
    onClick={handleSavePlan}
  >
    <span>Save Study Plan</span>
  </button>
</div>

      <div className="plan-summary">
        <span>{plan.total_days} Days</span>
        <span>{plan.daily_hours}h / Day</span>
        <span>{plan.total_hours}h Total</span>
      </div>
    </div>

    <div className="exam-plan-days">
      {plan.days?.map((day: any) => (
        <div className="exam-day-card" key={day.day_number}>

          <div className="exam-day-header">
            <div>
              <span className="day-label">
                Day {day.day_number}
              </span>

              <h3>{day.focus}</h3>
            </div>

            <span className="day-status">
              Pending
            </span>
          </div>

          <div className="exam-day-tasks">
            {day.tasks?.map((task: any, index: number) => (
              <div
                className="exam-task"
                key={index}
              >
                <div className="task-type">
                  {task.type}
                </div>

                <div className="task-content">
                  <h4>{task.title}</h4>

                  <p>
                    {task.description}
                  </p>

                  <div className="task-meta">
                    <span>
                      ⏱ {task.duration_minutes} min
                    </span>

                    {task.questions_count > 0 && (
                      <span>
                        📝 {task.questions_count} questions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>

  </section>
)}

          <section className="panel quick">
            <h3>♧ <span>Quick Stats</span></h3>
            <div className="stat-grid">
              <Stat icon={<Book/>} value="12" label="Total Topics" cls="purple"/>
              <Stat icon={<File/>} value="8" label="Practice Tests" cls="blue"/>
              <Stat icon={<Chart/>} value="68%" label="Avg. Accuracy" cls="pink"/>
              <Stat icon={<Clock/>} value="24h" label="Study Time" cls="cyan"/>
            </div>
          </section>
        </aside>

        <section className="middle">
          <section className="panel study">
            <div className="section-head">
              <div><h3><Calendar/> My Study Plan</h3><p>Personalized plan based on your exam and target score</p></div>
              <button className="outline">View Full Plan <Right size={15}/></button>
            </div>

            <div className="progress">
              <div className="circle"><strong>42%</strong></div>
              <div className="progress-label"><b>Overall Progress</b><small>Keep going! You're doing great.</small></div>
              <Metric icon={<Clock/>} value="120" label="Total Hours"/>
              <Metric icon={<Check/>} value="68" label="Completed"/>
              <Metric icon={<Trophy/>} value="52" label="Remaining"/>
            </div>

            <div className="today-plan-section">

  <div className="section-header">
    <div>
      <h2>Today's Plan</h2>

      {todayPlan && (
        <p>
          Day {todayPlan.day.day_number} •{" "}
          {todayPlan.exam} • {todayPlan.paper}
        </p>
      )}
    </div>
  </div>

  {todayLoading ? (
    <div className="empty-state">
      Loading today's plan...
    </div>
  ) : !todayPlan ? (
    <div className="empty-state">
      <h3>No plan for today</h3>
      <p>
        Generate and save an exam preparation plan first.
      </p>
    </div>
  ) : (
    <div className="today-tasks">

      {todayPlan.day.tasks?.map((task: any) => (
        <div
          className="today-task"
          key={task.id}
        >
          <div className="task-type">
            {task.type}
          </div>

          <div className="task-content">
            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <div className="task-meta">
              <span>
                ⏱ {task.duration_minutes} min
              </span>

              {task.questions_count > 0 && (
                <span>
                  📝 {task.questions_count} questions
                </span>
              )}
            </div>
          </div>

           {task.status === "completed" ? (
  <span className="task-status completed">
    ✓ Completed
  </span>
) : (
  <button
    className="complete-task-btn"
    onClick={() => handleCompleteTask(task.id)}
  >
    Complete
  </button>
)}
        </div>
      ))}

    </div>
  )}

</div>
            <div className="topic-list">
              {topics.map((t,i)=><div className="topic" key={t[0]}>
                <div className={"topic-icon t"+i}><File/></div>
                <div className="topic-info"><b>{t[0]}</b><small>{t[1]} <i>•</i> {t[2]} <i>•</i> {t[3]}</small></div>
                <span className={"status "+t[5]}>{t[4]}</span>
                <button className="go"><Right size={17}/></button>
              </div>)}
            </div>
          </section>

          <section className="panel materials">
            <div className="section-head simple"><h3><File/> Recent Exam Materials</h3><button>View All →</button></div>
            <div className="material-grid">
              {materials.map(m=><div className="material" key={m[0]}>
                <div className={"pdf "+m[3]}>▧</div><b>{m[0]}</b><span>•••</span><small>{m[1]} {m[2]}</small>
              </div>)}
            </div>
          </section>
        </section>

        <aside className="rightcol">
          <section className="panel upcoming">
            <div className="section-head simple"><h3><Calendar/> Upcoming Exams</h3><button>View All →</button></div>
            {exams.map(e=><div className="exam" key={e.title}>
              <div className={"date "+e.color}><b>{e.date}</b><small>{e.month}</small></div>
              <div><b>{e.title}</b><small>{e.sub}</small><em><Clock size={13}/> {e.days}</em></div>
              <Right size={18}/>
            </div>)}
          </section>

          <section className="promo">
            <div><Target size={42}/><b>Small Steps Every Day</b><strong>Lead to Big Results!</strong><button>Keep Preparing <Right size={15}/></button></div>
            <div className="mount">⌁</div>
          </section>

          <section className="panel tips">
            <div className="section-head simple"><h3><Light/> Study Tips</h3><button>View All →</button></div>
            <div className="tipbox"><span>“</span><p>Focus on understanding concepts,<br/>not just memorizing. It helps you<br/>solve new problems easily.</p></div>
            <div className="dots">● ● ●</div>
          </section>
        </aside>
      </div>
    </main>
  </div>
}

function Field({label,children,showDropdown=false}:{label:string;children:React.ReactNode;showDropdown?:boolean}) {
  return <div className="field"><label>{label}</label><div className="select-wrap">{children}{showDropdown && <Down/>}</div></div>
}
function Stat({icon,value,label,cls}:{icon:React.ReactNode;value:string;label:string;cls:string}) {
  return <div className="stat"><span className={"stat-icon "+cls}>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>
}
function Metric({icon,value,label}:{icon:React.ReactNode;value:string;label:string}) {
  return <div className="metric"><span>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>
}

const css = `
*{box-sizing:border-box}body{margin:0}
.ep{min-height:100vh;background:#020a1e;color:#eef4ff;font-family:Inter,Arial,sans-serif;
background-image:radial-gradient(900px 500px at 55% -10%,#10285b55,transparent 65%)}
button,input,select{font:inherit}.ep button{cursor:pointer;color:inherit}
.select-wrap input{width:100%;height:44px;border-radius:10px;border:1px solid #194580;background:#0b2550;color:#e6eeff;padding:0 14px;outline:0}
.select-wrap input::placeholder{color:#91a8d2}
.topbar{height:72px;border-bottom:1px solid #102958;background:#041027;display:flex;align-items:center;padding:0 30px;gap:35px;position:relative}
.brand{display:flex;align-items:center;gap:12px;min-width:405px}.brandmark{font-size:53px;color:#d9c8ff;line-height:1;transform:rotate(45deg);text-shadow:0 0 15px #8a58ff}
.brand b{display:block;font-size:20px}.brand small{display:block;color:#8fa5d0;font-size:12px;margin-top:3px}
.search{height:43px;flex:1;max-width:550px;border:1px solid #17417c;border-radius:12px;background:#081c40;display:flex;align-items:center;padding:0 13px;gap:11px;color:#d9e7ff}
.search input{flex:1;border:0;outline:0;background:transparent;color:white}.search input::placeholder{color:#9db1d5}.search kbd{background:#102b59;border:1px solid #21477d;border-radius:5px;padding:3px 7px;color:#c9d8f3}
.topright{margin-left:auto;display:flex;align-items:center;gap:25px}.online{background:#073337;color:#22e6a0;padding:10px 17px;border-radius:25px;font-weight:700;font-size:13px}.online i{display:inline-block;width:10px;height:10px;background:#16e49b;border-radius:50%;margin-right:9px;box-shadow:0 0 10px #16e49b}
.bell{border:0;background:none;position:relative}.bell em{position:absolute;right:1px;top:0;width:7px;height:7px;background:#ff3751;border-radius:50%}
.profile{border:0;background:none;display:flex;align-items:center;gap:9px}.profile>span{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#2878e7;font-size:18px}.profile b{font-size:14px}.profile-menu{position:absolute;right:22px;top:64px;background:#081936;border:1px solid #21447e;padding:7px;border-radius:10px;z-index:10}.profile-menu div{padding:9px 14px}
main{max-width:1536px;margin:auto;padding:15px 21px 28px}
.hero{height:191px;border:1px solid #244ba5;border-radius:15px;overflow:hidden;position:relative;display:flex;align-items:center;padding:18px 34px;background:linear-gradient(105deg,#142275,#0d3389 52%,#15237a);box-shadow:inset 0 0 60px #4d54ff25}
.hero:after{content:"";position:absolute;width:620px;height:260px;left:40%;top:-100px;border-radius:50%;background:#2d58ff55;filter:blur(22px)}
.hero-icon{position:relative;z-index:2;width:110px;height:110px;border-radius:27px;display:grid;place-items:center;background:linear-gradient(145deg,#774cff,#4932df);box-shadow:0 0 40px #684bff99;color:#e8eaff}.hero-icon svg:last-child{position:absolute;right:17px;bottom:18px}
.hero-copy{margin-left:30px;position:relative;z-index:3}.hero-copy label{color:#27d0ff;font-weight:700;letter-spacing:2px;font-size:11px}.hero-copy h1{font-size:30px;margin:6px 0 6px}.hero-copy h1 span{color:#7783ff}.hero-copy p{font-size:14px;color:#e1e9ff;line-height:1.45;margin:0}.hero-chips{display:flex;gap:9px;margin-top:13px}.hero-chips span{padding:8px 13px;border-radius:18px;background:#103b91aa;border:1px solid #2d63bd;color:#e5edff;font-size:10px}.hero-art{position:absolute;right:8px;top:0;width:465px;height:100%;z-index:2;pointer-events:none}.dream{position:absolute;top:45px;left:18px;font-family:cursive;font-size:25px;line-height:1.05;transform:rotate(-6deg);color:#e0e7ff;text-shadow:0 0 10px #91aaff55}.book-scene{position:absolute;right:8px;bottom:0;width:285px;height:178px}.book-stack{position:absolute;right:20px;bottom:4px;width:210px;height:105px;filter:drop-shadow(0 8px 12px #0008)}.book{position:absolute;right:0;height:22px;border-radius:3px 5px 5px 3px;transform:skewX(-9deg) rotate(-1deg);box-shadow:inset 0 2px 2px #ffffff35,0 4px 5px #0006}.book:before{content:"";position:absolute;left:10px;top:4px;width:5px;height:14px;border-radius:2px;background:#ffffff35}.book:after{content:"";position:absolute;right:12px;top:5px;width:48px;height:2px;background:#ffffff45;box-shadow:0 5px 0 #ffffff30}.book-1{width:210px;bottom:0;background:linear-gradient(90deg,#3b4bc4,#7a8df5)}.book-2{width:188px;bottom:25px;right:7px;background:linear-gradient(90deg,#263a9f,#5c72dc)}.book-3{width:200px;bottom:50px;right:2px;background:linear-gradient(90deg,#172b78,#5267ca)}.book-4{width:165px;bottom:75px;right:22px;background:linear-gradient(90deg,#4053b7,#8393ee)}.pen-cup{position:absolute;right:0;bottom:15px;width:48px;height:62px;border-radius:7px 7px 13px 13px;background:linear-gradient(100deg,#12286a,#354db0);transform:skewY(-4deg);z-index:4;box-shadow:0 8px 14px #0007}.pen-cup:before{content:"";position:absolute;left:4px;top:-7px;width:40px;height:10px;border-radius:50%;background:#5366c5}.pen-cup i{position:absolute;bottom:48px;width:4px;height:67px;border-radius:4px;background:#8098ff;transform-origin:bottom}.pen-cup i:nth-child(1){left:10px;transform:rotate(-12deg)}.pen-cup i:nth-child(2){left:20px;height:75px;transform:rotate(5deg)}.pen-cup i:nth-child(3){left:29px;height:62px;transform:rotate(18deg)}.pen-cup b{position:absolute;left:14px;bottom:18px;width:19px;height:7px;background:#273c8c;border-radius:50%}.cap{position:absolute;right:75px;top:3px;width:105px;height:43px;z-index:5;filter:drop-shadow(0 5px 7px #0007)}.cap span{position:absolute;left:8px;top:4px;width:88px;height:20px;background:linear-gradient(180deg,#5578dc,#2e4db0);clip-path:polygon(0 45%,100% 0,88% 78%,12% 100%);transform:skewX(-10deg)}.cap b{position:absolute;left:47px;top:17px;width:20px;height:25px;background:linear-gradient(90deg,#29469f,#4f6bd0);clip-path:polygon(15% 0,85% 0,100% 100%,0 100%)}
.grid{display:grid;grid-template-columns:347px minmax(580px,1fr) 385px;gap:14px;margin-top:14px;align-items:start}.left,.middle,.rightcol{min-width:0}.panel{border:1px solid #173c77;border-radius:13px;background:linear-gradient(180deg,#071b3c,#06132c);box-shadow:0 8px 30px #0003}
.select-panel{padding:18px 19px 20px}.panel h3{margin:0;display:flex;align-items:center;gap:9px;font-size:14px}.panel h3 svg{color:#e2e9ff}.select-panel>p{font-size:12px;color:#91a8d2;margin:8px 0 18px}.field{margin-top:13px}.field label{display:block;font-size:12px;font-weight:600;margin-bottom:7px}.select-wrap{position:relative}.select-wrap select{width:100%;height:44px;border-radius:10px;border:1px solid #194580;background:#0b2550;color:#e6eeff;padding:0 38px 0 14px;appearance:none;outline:0}.select-wrap svg{position:absolute;right:12px;top:13px;pointer-events:none;color:#c2d1ed}.primary{width:100%;height:48px;margin-top:17px;border:0;border-radius:10px;background:linear-gradient(90deg,#7b35ff,#16aaff);display:flex;align-items:center;justify-content:center;gap:9px;font-size:12px;font-weight:700;box-shadow:0 7px 25px #4b4cff55}.quick{margin-top:14px;padding:18px}.quick h3{margin-bottom:14px}.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.stat{height:78px;border:1px solid #14366a;border-radius:10px;background:#092044;display:flex;align-items:center;gap:9px;padding:10px}.stat-icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center}.stat-icon.purple{color:#b28cff;background:#342574}.stat-icon.blue{color:#70baff;background:#123f74}.stat-icon.pink{color:#ff7aa8;background:#63264c}.stat-icon.cyan{color:#63ddff;background:#124c68}.stat b{display:block;font-size:17px}.stat small{font-size:9px;color:#90a7d2}
.study{padding:15px 18px 16px}.section-head{display:flex;justify-content:space-between;align-items:center}.section-head h3{margin:0}.section-head p{margin:5px 0 0;color:#829bc8;font-size:10px}.outline,.section-head button{border:1px solid #174783;border-radius:18px;background:#0a2a5b;color:#a9c8ff;padding:9px 14px;font-size:10px}.progress{margin-top:15px;border:1px solid #133667;border-radius:10px;background:#092044;padding:13px 16px;display:flex;align-items:center;gap:13px}.circle{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#368aff 42%,#12315d 0);position:relative}.circle:after{content:"";position:absolute;width:53px;height:53px;border-radius:50%;background:#092044}.circle strong{z-index:1;font-size:14px}.progress-label{width:190px}.progress-label b{display:block;font-size:13px}.progress-label small{color:#8198c2;font-size:9px}.metric{display:flex;align-items:center;gap:8px;margin-left:auto}.metric>span{color:#8a72ff}.metric b{display:block;font-size:15px}.metric small{display:block;color:#8ba2cb;font-size:9px}.today-head{display:flex;justify-content:space-between;margin:15px 4px 8px;font-size:11px}.today-head span{color:#7894c3;font-size:9px}.topic{height:61px;border:1px solid #14386f;border-radius:9px;background:#092044;margin-bottom:7px;display:flex;align-items:center;padding:8px 10px;gap:11px}.topic-icon{width:38px;height:38px;border-radius:9px;display:grid;place-items:center;color:#dbe8ff}.t0,.t1{background:#1a4c99}.t2{background:#56388e}.t3{background:#23508a}.topic-info{flex:1}.topic-info b{display:block;font-size:12px}.topic-info small{display:block;margin-top:5px;color:#92a8d1;font-size:9px}.topic-info i{font-style:normal;margin:0 5px}.status{padding:7px 11px;border-radius:16px;font-size:9px}.status.green{background:#064f43;color:#2ce6b0}.status.blue{background:#083b77;color:#5cb6ff}.status.gray{background:#18365f;color:#b9c7df}.go{border:0;width:35px;height:35px;border-radius:50%;background:#10376b;display:grid;place-items:center}.materials{margin-top:14px;padding:14px 15px}.simple h3{font-size:13px}.simple button{border:0;background:none;color:#45aaff}.material-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:11px}.material{height:101px;border:1px solid #15386d;border-radius:9px;background:#092044;padding:11px;position:relative}.material .pdf{width:25px;height:27px;border-radius:5px;display:grid;place-items:center;font-size:15px}.pdf.red{background:#ef3561}.pdf.blue{background:#197cf2}.pdf.green{background:#3dcf79}.material>b{display:block;margin-top:9px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.material>span{position:absolute;right:9px;top:9px;color:#a6b9d8}.material small{display:block;color:#849bc2;font-size:9px;margin-top:6px}
.generated-plan-section{
  margin-top:24px;
}

.generated-plan-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
  margin-bottom:18px;
}

.generated-plan-header h2{
  margin:0;
}

.generated-plan-header p{
  margin:6px 0 0;
  color:#8f9bb3;
}

.plan-summary{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.plan-summary span{
  padding:8px 12px;
  border-radius:10px;
  background:#111d36;
  border:1px solid #26385d;
  color:#cbd7ef;
  font-size:13px;
}

.exam-plan-days{
  display:flex;
  flex-direction:column;
  gap:14px;
}

.exam-day-card{
  padding:18px;
  border-radius:16px;
  background:#0d172b;
  border:1px solid #203354;
}

.exam-day-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:15px;
  margin-bottom:16px;
}

.day-label{
  font-size:12px;
  color:#7f9cff;
  font-weight:600;
  text-transform:uppercase;
}

.exam-day-header h3{
  margin:5px 0 0;
  color:#fff;
  font-size:17px;
}

.day-status{
  padding:6px 10px;
  border-radius:8px;
  background:#17233d;
  color:#91a4c7;
  font-size:12px;
}

.exam-day-tasks{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.exam-task{
  display:flex;
  gap:14px;
  padding:14px;
  border-radius:12px;
  background:#111d34;
  border:1px solid #1d2d4b;
}

.task-type{
  min-width:80px;
  height:28px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:7px;
  background:#182b50;
  color:#8faeff;
  font-size:11px;
  font-weight:600;
  text-transform:capitalize;
}

.task-content{
  flex:1;
}

.task-content h4{
  margin:0 0 5px;
  color:#fff;
  font-size:14px;
}

.task-content p{
  margin:0;
  color:#8f9bb3;
  font-size:13px;
  line-height:1.5;
}

.task-meta{
  display:flex;
  gap:15px;
  margin-top:9px;
  color:#7183a5;
  font-size:12px;
}

@media(max-width:700px){
  .generated-plan-header{
    flex-direction:column;
    align-items:flex-start;
  }

  .exam-day-header{
    flex-direction:column;
  }

  .exam-task{
    flex-direction:column;
  }

  .task-type{
    width:max-content;
  }
}
  .complete-task-btn {
  border: 1px solid #315fa8;
  background: #14284d;
  color: #9eb9ff;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.complete-task-btn:hover {
  background: #1b3768;
}

.task-status.completed {
  color: #6ee7a0;
  font-weight: 600;
}
.rightcol{display:flex;flex-direction:column;gap:14px}.upcoming{padding:16px 15px}.exam{height:78px;border-top:1px solid #153363;display:flex;align-items:center;gap:11px}.exam:first-of-type{border-top:0}.date{width:48px;height:52px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center}.date b{font-size:18px}.date small{font-size:9px}.date.blue{background:#1766d9}.date.teal{background:#149d9c}.date.orange{background:#ee8422}.date.pink{background:#dc3769}.exam>div:nth-child(2){flex:1}.exam>div:nth-child(2)>b{display:block;font-size:11px}.exam>div:nth-child(2)>small{display:block;color:#a9b9d5;font-size:9px;margin-top:4px}.exam em{display:flex;align-items:center;gap:3px;color:#7d98c4;font-size:8px;margin-top:4px;font-style:normal}.promo{height:141px;border:1px solid #5b40b7;border-radius:13px;overflow:hidden;position:relative;padding:18px 20px;background:radial-gradient(circle at 80% 30%,#6436d7,#101a6e 50%,#0a194b);display:flex}.promo>div:first-child{z-index:2;display:flex;flex-direction:column;align-items:flex-start}.promo svg{color:#b9a7ff;margin-bottom:4px}.promo b{font-size:12px}.promo strong{font-size:11px;margin-top:3px}.promo button{margin-top:12px;border:0;border-radius:20px;background:linear-gradient(90deg,#7c31ff,#18b4ff);padding:9px 15px;font-size:10px;font-weight:700}.mount{position:absolute;right:4px;bottom:-25px;font-size:130px;color:#4c4dd3aa;transform:rotate(-8deg)}.tips{padding:16px 15px;height:176px}.tipbox{margin-top:12px;border:1px solid #193a70;border-radius:9px;background:#0b2853;padding:12px 13px;display:flex;gap:10px}.tipbox span{font-size:30px;color:#5eb2ff}.tipbox p{font-size:10px;line-height:1.6;margin:0;color:#c3d2ed}.dots{text-align:center;color:#2fa9ff;font-size:8px;letter-spacing:4px;margin-top:8px}
@media(max-width:1250px){.grid{grid-template-columns:310px 1fr}.rightcol{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr 1fr}.hero-art{opacity:.65}.brand{min-width:300px}}
@media(max-width:900px){.topbar{padding:0 15px}.brand{min-width:auto}.brand small,.search,.online{display:none}.grid{grid-template-columns:1fr}.rightcol{grid-column:auto;display:flex}.hero-art{display:none}.hero{height:auto;min-height:200px}.material-grid{grid-template-columns:1fr 1fr}.metric{margin-left:8px}}
@media(max-width:600px){.hero{padding:20px}.hero-icon{width:75px;height:75px}.hero-copy{margin-left:15px}.hero-copy h1{font-size:24px}.hero-chips{flex-wrap:wrap}.progress{flex-wrap:wrap}.progress-label{width:auto}.topic{height:auto;min-height:64px}.status{display:none}.material-grid{grid-template-columns:1fr 1fr}.topright{gap:10px}.profile b,.profile svg{display:none}}

`;
