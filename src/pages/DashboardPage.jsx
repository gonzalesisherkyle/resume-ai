import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useModal } from '../context/ModalContext';

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { confirm } = useModal();

  const fetchResumes = useCallback(async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.data || []);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchResumes);
  }, [fetchResumes]);

  const createResume = async () => {
    setCreating(true);
    try {
      const res = await api.post('/resume', { title: `resume_${resumes.length + 1}.json` });
      toast.success('System record created!');
      navigate(`/resume/${res.data.data._id}`);
    } catch {
      toast.error('Failed to initialize new record');
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id) => {
    const ok = await confirm('Are you sure you want to delete this record? This action cannot be undone.');
    if (!ok) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Record purged');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getShareUrl = (shareId) => `${window.location.origin}/share/${shareId}`;

  const copyShareLink = async (shareId) => {
    if (!shareId) {
      toast.error('Public link is not ready yet');
      return;
    }

    const shareUrl = getShareUrl(shareId);

    try {
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
      toast.error('Copy failed');
    }
  };

  const updateResumeShareState = (id, shareData) => {
    setResumes(prev => prev.map(resume => (
      resume._id === id ? { ...resume, ...shareData } : resume
    )));
  };

  const enableSharing = async (resume) => {
    try {
      const res = await api.patch(`/resume/${resume._id}/share`, { isPublic: true });
      updateResumeShareState(resume._id, res.data.data);
      await copyShareLink(res.data.data.shareId);
    } catch {
      toast.error('Failed to publish resume');
    }
  };

  const disableSharing = async (resume) => {
    const ok = await confirm('Disable this public resume link? Existing visitors will no longer be able to view it.');
    if (!ok) return;

    try {
      const res = await api.patch(`/resume/${resume._id}/share`, { isPublic: false });
      updateResumeShareState(resume._id, res.data.data);
      toast.success('Public link disabled');
    } catch {
      toast.error('Failed to disable sharing');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-12 h-1 border-b border-[var(--terminal-accent)] animate-pulse" />
        <div className="text-[var(--terminal-muted)] text-xs font-mono">LISTING_RECORDS...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in font-mono">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[var(--terminal-accent)] text-sm mb-1">$ ls -la ~/resumes</div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Storage_Directory</h1>
          <div className="text-[var(--terminal-muted)] text-xs mt-1">
            Total records: {resumes.length} | Free space: UNLIMITED
          </div>
        </div>
        <button 
          onClick={createResume} 
          disabled={creating} 
          className="btn-terminal btn-terminal-primary flex items-center gap-2 py-2"
        >
          {creating ? 'INITIALIZING...' : '+ NEW_RECORD.sh'}
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="terminal-card border-dashed flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[var(--terminal-muted)] mb-4 font-mono">
            [DIRECTORY_EMPTY]
          </div>
          <div className="text-sm opacity-50 mb-6">No resume records found in local storage.</div>
          <button onClick={createResume} className="btn-terminal">initialize_first_resume --force</button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header Style */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] uppercase tracking-widest text-[var(--terminal-muted)] border-b border-[var(--terminal-border)]">
            <div className="col-span-4">Name</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-1 text-center">Versions</div>
            <div className="col-span-2 text-center">Views</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {resumes.map(resume => {
            const activeVersion = resume.versions?.[resume.activeVersionIndex] || resume.versions?.[0];
            const score = activeVersion?.atsScore?.overall || 0;
            
            return (
              <div 
                key={resume._id} 
                className="terminal-card !p-0 group hover:bg-[var(--terminal-header)] transition-all"
              >
                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center px-4 md:px-6 py-4">
                  <div className="w-full md:col-span-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--terminal-amber)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <div className="overflow-hidden min-w-0">
                      <div className="text-white font-bold group-hover:text-[var(--terminal-accent)] transition-colors truncate">
                        {resume.title.endsWith('.json') ? resume.title : `${resume.title.replace(/\s+/g, '_').toLowerCase()}.json`}
                      </div>
                      <div className="text-[10px] text-[var(--terminal-muted)] truncate">
                        ID: {resume._id.substring(0, 12)}...
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:contents w-full justify-between items-center md:justify-center gap-y-4 border-t border-[var(--terminal-border)] md:border-none pt-4 md:pt-0">
                    <div className="md:col-span-2 flex flex-col items-start md:items-center">
                      <div className={`text-sm font-bold ${score >= 70 ? 'text-[var(--terminal-green)]' : score >= 40 ? 'text-[var(--terminal-amber)]' : 'text-red-500'}`}>
                        {score || '00'}%
                      </div>
                      <div className="text-[8px] text-[var(--terminal-muted)] uppercase">ATS_CORE</div>
                    </div>

                    <div className="md:col-span-1 flex flex-col items-start md:items-center">
                      <div className="text-sm font-bold text-white">
                        {resume.versions?.length || 1}
                      </div>
                      <div className="text-[8px] text-[var(--terminal-muted)] uppercase">SNAPSHOTS</div>
                    </div>

                    <div className="md:col-span-2 flex flex-col items-start md:items-center">
                      <div className={`text-sm font-bold ${resume.isPublic ? 'text-[var(--terminal-accent)]' : 'text-white'}`}>
                        {resume.viewCount || 0}
                      </div>
                      <div className="text-[8px] text-[var(--terminal-muted)] uppercase">
                        {resume.isPublic ? 'PUBLIC_VIEWS' : 'PRIVATE'}
                      </div>
                    </div>

                    <div className="md:col-span-3 flex flex-wrap items-center justify-end gap-2 self-end md:self-center">
                      <Link 
                        to={`/resume/${resume._id}`} 
                        className="btn-terminal !py-1 !px-3 text-[10px]"
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => resume.isPublic ? copyShareLink(resume.shareId) : enableSharing(resume)}
                        className="btn-terminal !py-1 !px-3 text-[10px]"
                        title={resume.isPublic ? 'Copy public link' : 'Publish public resume'}
                      >
                        {resume.isPublic ? 'COPY' : 'SHARE'}
                      </button>
                      {resume.isPublic && (
                        <button
                          onClick={() => disableSharing(resume)}
                          className="p-1.5 text-[var(--terminal-muted)] hover:text-[var(--terminal-amber)] transition-colors"
                          title="Disable public link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.148.194-2.25.55-3.276m3.024-3.024A9.956 9.956 0 0112 1c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.702 5.574M15 9a3 3 0 00-4.243-2.743M9.879 9.879A3 3 0 0012 15a3 3 0 002.121-.879M3 3l18 18" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={() => deleteResume(resume._id)} 
                        className="p-1.5 text-[var(--terminal-muted)] hover:text-[var(--terminal-red)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 p-4 border border-[var(--terminal-border)] bg-[var(--terminal-surface)] rounded text-[10px] text-[var(--terminal-muted)] leading-relaxed">
        <div className="text-[var(--terminal-accent)] mb-1 uppercase font-bold tracking-widest">System_Log:</div>
        <div>[INFO] Storage encrypted using AES-256.</div>
        <div>[INFO] Connected to primary node (us-east-1).</div>
        <div>[INFO] Real-time collaboration: ENABLED.</div>
      </div>
    </div>
  );
}

