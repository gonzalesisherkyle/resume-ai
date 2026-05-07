import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import ResumePreview from '../components/resume/ResumePreview';

const publicResumeRequests = new Map();

const loadPublicResume = (shareId) => {
  if (!publicResumeRequests.has(shareId)) {
    const request = api.get(`/resume/public/${shareId}`)
      .then(res => res.data.data)
      .finally(() => {
        publicResumeRequests.delete(shareId);
      });

    publicResumeRequests.set(shareId, request);
  }

  return publicResumeRequests.get(shareId);
};

export default function PublicResumePage() {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchPublicResume = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await loadPublicResume(shareId);
        if (!cancelled) setResume(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'This public resume is unavailable.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPublicResume();

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--terminal-bg)] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 border-b border-[var(--terminal-accent)] animate-pulse" />
          <div className="text-[var(--terminal-muted)] text-xs uppercase tracking-widest">FETCHING_PUBLIC_RECORD...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--terminal-bg)] flex items-center justify-center p-4 font-mono">
        <div className="terminal-window max-w-md w-full">
          <header className="terminal-header">
            <span className="text-[10px] uppercase font-bold text-[var(--terminal-red)]">PUBLIC_LINK_ERROR</span>
          </header>
          <div className="p-6">
            <p className="text-sm text-[var(--terminal-text)] mb-6">{error}</p>
            <Link to="/login" className="btn-terminal text-xs">RETURN_TO_LOGIN</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-text)] font-mono">
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <header className="mb-6 pb-5 border-b border-[var(--terminal-border)] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[var(--terminal-accent)] text-xs mb-2">$ public_resume --read-only</div>
            <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider break-words">
              {resume?.title || 'Shared Resume'}
            </h1>
            <div className="text-[10px] text-[var(--terminal-muted)] mt-2 uppercase tracking-widest">
              Views: {resume?.viewCount || 0}
            </div>
          </div>

          <Link to="/login" className="btn-terminal text-xs self-start md:self-auto">
            BUILD_RESUME
          </Link>
        </header>

        <div className="overflow-auto pb-8">
          {resume?.version && <ResumePreview version={resume.version} />}
        </div>
      </main>
    </div>
  );
}
