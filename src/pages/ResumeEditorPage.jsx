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
      toast.error(err.response?.data?.error || 'AI generation failed. Check your OpenAI API key.');
    } finally {
      setGenerating(false);
    }
  };

  const handleScore = async () => {
    setScoring(true);
    try {
      const res = await api.post(`/resume/${id}/score`);
      const updated = await api.get(`/resume/${id}`);
      setResume(updated.data.data);
      toast.success(`ATS Score: ${res.data.data.overall}/100`);
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
      a.download = `Resume.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported!`);
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleClone = async () => {
    try {
      const res = await api.post(`/resume/${id}/clone`);
      setResume(res.data.data);
      toast.success('Version cloned!');
    } catch (err) {
      toast.error('Clone failed');
    }
  };

  const handleTailor = async () => {
    if (!activeVersion?.jobDescription) return toast.error('Add a job description first');
    setGenerating(true);
    try {
      const res = await api.post(`/resume/${id}/tailor`, { jobDescription: activeVersion.jobDescription });
      setResume(res.data.data);
      toast.success('Resume tailored to job!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Tailoring failed');
    } finally {
      setGenerating(false);
    }
  };

  const switchVersion = async (idx) => {
    try {
      const res = await api.put(`/resume/${id}`, { activeVersionIndex: idx });
      setResume(res.data.data);
    } catch (err) {
      toast.error('Failed to switch version');
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-white">{resume?.title}</h1>
          {saving && <span className="text-xs text-brand-400 animate-pulse">Saving...</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Version selector */}
          {resume?.versions?.length > 1 && (
            <select
              value={resume.activeVersionIndex}
              onChange={(e) => switchVersion(Number(e.target.value))}
              className="bg-surface-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
            >
              {resume.versions.map((v, i) => (
                <option key={i} value={i}>{v.versionName}</option>
              ))}
            </select>
          )}
          <button onClick={handleClone} className="btn-secondary text-sm !py-2">Clone</button>
          <button onClick={handleScore} disabled={scoring} className="btn-secondary text-sm !py-2 flex items-center gap-1.5">
            {scoring && <div className="w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />}
            Score
          </button>
          <button onClick={handleGenerateAI} disabled={generating} className="btn-primary text-sm !py-2 flex items-center gap-1.5">
            {generating && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            AI Generate
          </button>
          <button onClick={handleTailor} disabled={generating} className="btn-primary text-sm !py-2 bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5">
            Tailor
          </button>
          <div className="relative group">
            <button disabled={exporting} className="btn-secondary text-sm !py-2">
              {exporting ? 'Exporting...' : 'Export ▾'}
            </button>
            <div className="absolute right-0 mt-1 bg-surface-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
              <button onClick={() => handleExport('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-surface-700 rounded-t-lg">PDF</button>
              <button onClick={() => handleExport('docx')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-surface-700 rounded-b-lg">DOCX</button>
            </div>
          </div>
          <button onClick={() => setShowChat(!showChat)} className={`btn-secondary text-sm !py-2 ${showChat ? '!border-brand-500 !text-brand-400' : ''}`}>
            💬 Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-800/50 p-1 rounded-lg w-fit">
        {['edit', 'preview', 'score'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-6">
        <div className={`flex-1 min-w-0 ${showChat ? 'lg:mr-80' : ''}`}>
          {activeTab === 'edit' && activeVersion && (
            <ResumeForm version={activeVersion} onSave={saveResume} />
          )}
          {activeTab === 'preview' && activeVersion && (
            <ResumePreview version={activeVersion} />
          )}
          {activeTab === 'score' && activeVersion && (
            <ATSScoreCard score={activeVersion.atsScore} />
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 border-l border-gray-700/50 bg-surface-800/95 backdrop-blur-md z-40">
            <AIChatAssistant resumeId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
