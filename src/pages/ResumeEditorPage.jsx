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
  const [sharing, setSharing] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview, score
  const [showChat, setShowChat] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      const res = await api.get(`/resume/${id}`);
      setResume(res.data.data);
      setTitleDraft(res.data.data.title || '');
    } catch {
      toast.error('Resume not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void Promise.resolve().then(fetchResume);
  }, [fetchResume]);

  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 768; // md is 768px
      const shouldLock = showChat && isMobile;

      document.body.style.overflow = shouldLock ? 'hidden' : '';
      const mainContainer = document.querySelector('main');
      if (mainContainer) {
        mainContainer.style.overflow = shouldLock ? 'hidden' : '';
      }
    };

    handleScrollLock();

    window.addEventListener('resize', handleScrollLock);
    return () => {
      window.removeEventListener('resize', handleScrollLock);
      document.body.style.overflow = '';
      const mainContainer = document.querySelector('main');
      if (mainContainer) {
        mainContainer.style.overflow = '';
      }
    };
  }, [showChat]);

  const activeVersion = resume?.versions?.[resume.activeVersionIndex] || resume?.versions?.[0];

  const saveResume = useCallback(async (versionData) => {
    setSaving(true);
    try {
      const res = await api.put(`/resume/${id}`, { version: versionData });
      setResume(res.data.data);
      toast.success('Saved!', { duration: 1500 });
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [id]);

  const saveTitle = async (event) => {
    if (event?.currentTarget?.dataset.skipSave === 'true') {
      delete event.currentTarget.dataset.skipSave;
      return;
    }

    const nextTitle = titleDraft.trim() || 'Untitled Resume';
    if (!resume || nextTitle === resume.title) {
      setTitleDraft(resume?.title || '');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/resume/${id}`, { title: nextTitle });
      setResume(res.data.data);
      setTitleDraft(res.data.data.title || nextTitle);
      toast.success('Title saved', { duration: 1500 });
    } catch {
      setTitleDraft(resume.title || '');
      toast.error('Title save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.currentTarget.dataset.skipSave = 'true';
      setTitleDraft(resume?.title || '');
      event.currentTarget.blur();
    }
  };

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
    } catch {
      toast.error('Scoring failed');
    } finally {
      setScoring(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);
    try {
      const res = await api.post(`/resume/${id}/export`, { format }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_v${resume.activeVersionIndex + 1}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} READY`, { id: toastId });
    } catch {
      toast.error('EXPORT_FAILED', { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const copyShareUrl = async (shareId) => {
    if (!shareId) {
      toast.error('Public link is not ready yet');
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/share/${shareId}`;

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast.success('Public link copied');
    } catch {
      toast.error('COPY_FAILED');
    }
  };

  const handleShareToggle = async (isPublic) => {
    setSharing(true);
    try {
      const res = await api.patch(`/resume/${id}/share`, { isPublic });
      setResume(prev => prev ? { ...prev, ...res.data.data } : prev);

      if (isPublic) {
        await copyShareUrl(res.data.data.shareId);
      } else {
        toast.success('Public link disabled');
      }
    } catch {
      toast.error('SHARE_UPDATE_FAILED');
    } finally {
      setSharing(false);
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-[var(--terminal-muted)] hover:text-[var(--terminal-accent)] transition-colors"
            title="Return to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="text-[var(--terminal-accent)] text-xs mb-1">$ workspace --active</div>
            <h1 className="flex items-center gap-2">
              <input
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={saveTitle}
                onKeyDown={handleTitleKeyDown}
                className="min-w-0 w-full max-w-[22rem] bg-transparent border-b border-transparent px-0 py-0.5 text-xl font-bold text-white uppercase tracking-tight outline-none transition-colors hover:border-[var(--terminal-border)] focus:border-[var(--terminal-accent)]"
                aria-label="Resume title"
              />
              {saving && <span className="text-[10px] text-[var(--terminal-amber)] animate-pulse font-normal">[SAVING...]</span>}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleScore} disabled={scoring} className="btn-terminal text-xs">
            {scoring ? 'SCANNING...' : 'SCAN_ATS'}
          </button>
          <button onClick={handleGenerateAI} disabled={generating} className="btn-terminal text-xs">
            {generating ? 'THINKING...' : 'AI_OPTIMIZE'}
          </button>
          <div className="relative group">
            <button disabled={exporting} className="btn-terminal text-xs">
              {exporting ? 'EXPORTING...' : 'EXPORT ▾'}
            </button>
            {!exporting && (
              <div className="absolute right-0 mt-1 bg-[var(--terminal-surface)] border border-[var(--terminal-border)] rounded-none shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[100px]">
                <button onClick={() => handleExport('pdf')} className="block w-full text-left px-4 py-2 text-[10px] text-[var(--terminal-text)] hover:bg-[var(--terminal-bg)] hover:text-[var(--terminal-accent)]">PDF_FORMAT</button>
                <button onClick={() => handleExport('docx')} className="block w-full text-left px-4 py-2 text-[10px] text-[var(--terminal-text)] hover:bg-[var(--terminal-bg)] hover:text-[var(--terminal-accent)]">DOCX_FORMAT</button>
              </div>
            )}
          </div>
          {resume?.isPublic && (
            <div className="px-3 py-2 border border-[var(--terminal-border)] text-[10px] text-[var(--terminal-accent)] uppercase tracking-widest">
              {resume.viewCount || 0}_VIEWS
            </div>
          )}
          <button
            onClick={() => resume?.isPublic ? copyShareUrl(resume.shareId) : handleShareToggle(true)}
            disabled={sharing}
            className="btn-terminal text-xs"
          >
            {sharing ? 'SYNCING...' : resume?.isPublic ? 'COPY_LINK' : 'SHARE'}
          </button>
          {resume?.isPublic && (
            <button
              onClick={() => handleShareToggle(false)}
              disabled={sharing}
              className="btn-terminal text-xs"
            >
              UNSHARE
            </button>
          )}
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1 min-w-0 transition-all">
          {/* Internal Tabs */}
          <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-[var(--terminal-border)] overflow-x-auto no-scrollbar">
            {['edit', 'preview', 'score'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-2 md:px-1 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab
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
              <div className="bg-black/45 border border-white/5 rounded-xl p-4 md:p-8 overflow-auto max-h-[70vh] md:max-h-[800px] shadow-inner">
                <ResumePreview version={activeVersion} />
              </div>
            )}
            {activeTab === 'score' && activeVersion && (
              <ATSScoreCard score={activeVersion.atsScore} />
            )}
          </div>
        </div>
      </div>

      {/* Floating Chatbot Widget */}
      <div className="fixed bottom-10 right-6 z-50 font-mono">
        {/* Chatbot Toggle Button (Circle) */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[var(--terminal-accent)] focus:ring-offset-2 focus:ring-offset-[var(--terminal-bg)] relative group ${
            showChat
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400'
              : 'bg-[var(--terminal-surface)] hover:bg-[var(--terminal-header)] border border-[var(--terminal-accent)] text-[var(--terminal-accent)] shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_25px_rgba(0,243,255,0.3)]'
          }`}
          aria-label="Toggle AI Assistant"
        >
          {showChat ? (
            <svg className="w-6 h-6 animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full rounded-full bg-[var(--terminal-accent)]/15 animate-ping opacity-75"></div>
              <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          )}
        </button>

        {/* Chat Widget Panel */}
        {showChat && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 md:absolute md:inset-auto md:bottom-20 md:right-0 md:bg-transparent md:p-0 md:block md:w-96 md:h-[550px] md:max-h-[calc(100vh-140px)] animate-slide-up"
            onClick={() => setShowChat(false)}
          >
            <div
              className="w-full max-w-lg md:max-w-none h-[500px] md:h-full terminal-window flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-[var(--terminal-border)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="terminal-header flex justify-between items-center bg-[var(--terminal-header)] border-b border-[var(--terminal-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[var(--terminal-accent)] rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--terminal-accent)]">AI_ASSISTANT_TERMINAL</span>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-[var(--terminal-muted)] hover:text-white transition-colors text-xs p-1"
                  aria-label="Close Chat"
                >
                  [CLOSE]
                </button>
              </header>
              <div className="flex-1 min-h-0 overflow-hidden bg-[var(--terminal-bg)]">
                <AIChatAssistant resumeId={id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

