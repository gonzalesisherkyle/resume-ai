import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    setCreating(true);
    try {
      const res = await api.post('/resume', { title: `Resume ${resumes.length + 1}` });
      toast.success('Resume created!');
      navigate(`/resume/${res.data.data._id}`);
    } catch (err) {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Resumes</h1>
          <p className="text-gray-400 mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} created</p>
        </div>
        <button onClick={createResume} disabled={creating} className="btn-primary flex items-center gap-2">
          {creating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          )}
          New Resume
        </button>
      </div>

      {/* Empty State */}
      {resumes.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
          <p className="text-gray-400 mb-6">Create your first ATS-optimized resume</p>
          <button onClick={createResume} className="btn-primary">Create Your First Resume</button>
        </div>
      )}

      {/* Resume Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map(resume => {
          const activeVersion = resume.versions?.[resume.activeVersionIndex] || resume.versions?.[0];
          const score = activeVersion?.atsScore?.overall || 0;
          return (
            <div key={resume._id} className="card hover:border-brand-500/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors truncate flex-1">{resume.title}</h3>
                <button onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-600/10 transition-all opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              {activeVersion?.contact?.fullName && (
                <p className="text-sm text-gray-400 mb-2">{activeVersion.contact.fullName}</p>
              )}
              {activeVersion?.targetRole && (
                <p className="text-xs text-brand-400 mb-3">Target: {activeVersion.targetRole}</p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${score >= 70 ? 'bg-green-400' : score >= 40 ? 'bg-yellow-400' : 'bg-gray-500'}`} />
                  <span className="text-xs text-gray-400">ATS Score: {score || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{resume.versions?.length || 1} version{(resume.versions?.length || 1) !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <Link to={`/resume/${resume._id}`} className="btn-secondary w-full mt-4 text-center block text-sm !py-2">
                Edit Resume
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
