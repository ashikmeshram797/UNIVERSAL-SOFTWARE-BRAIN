 import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import SignupPage from "./pages/SignupPage";
import FaceRegistration from "./pages/FaceRegistration";
import Dashboard from "./pages/Dashboard";
import FaceScanPage from "./pages/FaceScanePage";
import AIAgents from "./pages/AIAgents";
import AIChat from "./pages/AIChat";
import AltronAssistant from "./components/AltronAssistant";
import AIWorkspace from "./pages/AIWorkspace";
import WebWorkspace from "./pages/WebWorkspace";
import HealthcareWorkspace from "./pages/HealthcareWorkspace";
import EducationWorkspace from "./pages/EducationWorkspace";
import ContentWriter from "./pages/ContentWriter";
import StudyAssistant from "./pages/education/StudyAssistant";
import QuizGenerator from "./pages/education/QuizGenerator";
import NotesAnalyzer from "./pages/education/NotesAnalyzer";
import LessonPlanner from "./pages/education/LessonPlanner";
import ExamPreparation from "./pages/education/ExamPreparation";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <AltronAssistant />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/face-registration" element={<FaceRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/face-scan" element={<FaceScanPage />} />
        <Route path="/ai-agents" element={<AIAgents />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/ai-workspace" element={<AIWorkspace />} />
        <Route path="/ai-workspace/web" element={<WebWorkspace />} />
        <Route path="/ai-workspace/healthcare" element={<HealthcareWorkspace />} />
        <Route path="/ai-workspace/education" element={<EducationWorkspace />} />
        <Route path="/ai-workspace/education/study-assistant" element={<StudyAssistant />} />
        <Route path="/ai-workspace/education/quiz-generator" element={<QuizGenerator />} />
        <Route path="/ai-workspace/education/notes-pdf-analyzer" element={<NotesAnalyzer />} />
        <Route path="/ai-workspace/education/lesson-planner" element={<LessonPlanner />} />
        <Route path="/ai-workspace/education/exam-preparation" element={<ExamPreparation />} />
        <Route path="/ai-workspace/content-writer" element={<ContentWriter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;