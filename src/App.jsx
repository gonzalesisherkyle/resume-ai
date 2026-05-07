import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import TerminalLayout from './components/layout/TerminalLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import JobAnalyzerPage from './pages/JobAnalyzerPage';
import ScoreViewPage from './pages/ScoreViewPage';
import PublicResumePage from './pages/PublicResumePage';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--terminal-bg)] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 border-b border-[var(--terminal-accent)] animate-pulse" />
          <div className="text-[var(--terminal-accent)] text-sm uppercase tracking-widest">Initialising_System...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes - No Layout or Custom Auth Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/share/:shareId" element={<PublicResumePage />} />

      {/* Protected Routes - With TerminalLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <TerminalLayout>
              <DashboardPage />
            </TerminalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id"
        element={
          <ProtectedRoute>
            <TerminalLayout>
              <ResumeEditorPage />
            </TerminalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-analyzer"
        element={
          <ProtectedRoute>
            <TerminalLayout>
              <JobAnalyzerPage />
            </TerminalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/score/:id"
        element={
          <ProtectedRoute>
            <TerminalLayout>
              <ScoreViewPage />
            </TerminalLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
