import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ResumeForm from '../components/resume/ResumeForm';
import ResumePreview from '../components/resume/ResumePreview';
import ATSScoreCard from '../components/resume/ATSScoreCard';
import AIChatAssistant from '../components/chat/AIChatAssistant';

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview, score
  const [showChat, setShowChat] = useState(false);

  useEffect(() => { fetchResume(); }, [id]);

  const fetchResume = async () => {
    try {
      const res = await api.get(`/resume/${id}`);
      setResume(res.data.data);
    } catch (err) {
      toast.error('Resume not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const activeVersion = resume?.versions?.[resume.activeVersionIndex] || resume?.versions?.[0];

  const saveResume = useCallback(async (versionData) => {
    setSaving(true);
    try {
      const res = await api.put(`/resume/${id}`, { version: versionData });
      setResume(res.data.data);
      toast.success('Saved!', { duration: 1500 });
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [id]);

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/resume/${id}/generate-ai`, {
        jobDescription: activeVersion?.jobDescription || '',
      });
      setResume(res.data.data);
      toast.success('AI content generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleScore = async () => {
    setScoring(true);
    try {
      await api.post(`/resume/${id}/score`);
      const updated = await api.get(`/resume/${id}`);
      setResume(updated.data.data);
      toast.success('ATS Scan Complete');
      setActiveTab('score');
    } catch (err) {
      toast.error('Scoring failed');
    } finally {
      setScoring(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const res = await api.post(`/resume/${id}/export`, { format }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_v${resume.activeVersionIndex + 1}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} EXPORTED`);
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="w-12 h-1 border-b border-[var(--terminal-accent)] animate-pulse" />
      <div className="text-[var(--terminal-muted)] text-xs font-mono">LOADING_EDITOR_ASSETS...</div>
    </div>
  );

  return (
    <div className="animate-fade-in font-mono">
      {/* Editor Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--terminal-border)]">
        <div>
          <div className="text-[var(--terminal-accent)] text-xs mb-1">$ workspace --active</div>
          <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
            {resume?.title}
            {saving && <span className="text-[10px] text-[var(--terminal-amber)] animate-pulse font-normal">[SAVING...]</span>}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleScore} disabled={scoring} className="btn-terminal text-xs">
            {scoring ? 'SCANNING...' : 'SCAN_ATS'}
          </button>
          <button onClick={handleGenerateAI} disabled={generating} className="btn-terminal text-xs">
            {generating ? 'THINKING...' : 'AI_OPTIMIZE'}
          </button>
          <div className="relative group">
            <button className="btn-terminal text-xs">EXPORT ▾</button>
            <div className="absolute right-0 mt-1 bg-[var(--terminal-surface)] border border-[var(--terminal-border)] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[100px]">
              <button onClick={() => handleExport('pdf')} className="block w-full text-left px-4 py-2 text-[10px] text-[var(--terminal-text)] hover:bg-[var(--terminal-bg)] hover:text-[var(--terminal-accent)]">PDF_FORMAT</button>
              <button onClick={() => handleExport('docx')} className="block w-full text-left px-4 py-2 text-[10px] text-[var(--terminal-text)] hover:bg-[var(--terminal-bg)] hover:text-[var(--terminal-accent)]">DOCX_FORMAT</button>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(!showChat)} 
            className={`btn-terminal text-xs ${showChat ? '!border-[var(--terminal-accent)] !text-[var(--terminal-accent)]' : ''}`}
          >
            CHAT_HELPER
          </button>
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className={`flex-1 min-w-0 transition-all ${showChat ? 'xl:mr-80' : ''}`}>
          {/* Internal Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[var(--terminal-border)]">
            {['edit', 'preview', 'score'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab 
                    ? 'text-[var(--terminal-accent)]' 
                    : 'text-[var(--terminal-muted)] hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--terminal-accent)]" />
                )}
              </button>
            ))}
          </div>

          <div className="terminal-window !bg-[var(--terminal-bg)] !border-none">
            {activeTab === 'edit' && activeVersion && (
              <ResumeForm version={activeVersion} onSave={saveResume} />
            )}
            {activeTab === 'preview' && activeVersion && (
              <div className="bg-white rounded p-4 overflow-auto max-h-[800px]">
                <ResumePreview version={activeVersion} />
              </div>
            )}
            {activeTab === 'score' && activeVersion && (
              <ATSScoreCard score={activeVersion.atsScore} />
            )}
          </div>
        </div>

        {/* Floating Chat Sidebar (Internal) */}
        {showChat && (
          <div className="xl:fixed xl:right-8 xl:top-32 xl:bottom-12 w-full xl:w-80 terminal-window z-30">
            <header className="terminal-header">
              <span className="text-[10px] uppercase font-bold text-[var(--terminal-accent)]">AI_ASSISTANT_TERMINAL</span>
            </header>
            <div className="h-[500px] xl:h-full overflow-hidden">
              <AIChatAssistant resumeId={id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

