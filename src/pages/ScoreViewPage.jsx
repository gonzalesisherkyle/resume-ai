import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ATSScoreCard from '../components/resume/ATSScoreCard';
import toast from 'react-hot-toast';

export default function ScoreViewPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => { fetchResume(); }, [id]);

  const fetchResume = async () => {
    try {
      const res = await api.get(`/resume/${id}`);
      setResume(res.data.data);
    } catch (err) {
      toast.error('Resume not found');
    } finally {
      setLoading(false);
    }
  };

  const rescore = async () => {
    setScoring(true);
    try {
      await api.post(`/resume/${id}/score`);
      const res = await api.get(`/resume/${id}`);
      setResume(res.data.data);
      toast.success('Rescored!');
    } catch (err) {
      toast.error('Scoring failed');
    } finally {
      setScoring(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const version = resume?.versions?.[resume.activeVersionIndex] || resume?.versions?.[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{resume?.title} — Score</h1>
          <p className="text-gray-400 text-sm mt-1">ATS compliance analysis</p>
        </div>
        <div className="flex gap-2">
          <button onClick={rescore} disabled={scoring} className="btn-primary text-sm flex items-center gap-2">
            {scoring && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Rescore
          </button>
          <Link to={`/resume/${id}`} className="btn-secondary text-sm">Edit Resume</Link>
        </div>
      </div>

      <ATSScoreCard score={version?.atsScore} />
    </div>
  );
}
