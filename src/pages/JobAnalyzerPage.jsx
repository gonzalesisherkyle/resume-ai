import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function JobAnalyzerPage() {
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!jobText.trim() || jobText.trim().length < 20) {
      return toast.error('Please enter a job description (at least 20 characters)');
    }
    setLoading(true);
    try {
      const res = await api.post('/job/analyze', { jobDescription: jobText });
      setAnalysis(res.data.data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Check your OpenAI API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-2">Job Description Analyzer</h1>
      <p className="text-gray-400 mb-8">Paste a job description to extract required skills and keywords for resume optimization.</p>

      {/* Input */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
        <textarea
          value={jobText}
          onChange={e => setJobText(e.target.value)}
          className="textarea-field h-48"
          placeholder="Paste the full job description here..."
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="btn-primary mt-4 flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Analyzing...' : 'Analyze Job Description'}
        </button>
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-6 animate-slide-up">
          {/* Overview */}
          <div className="card">
            <h2 className="section-title">Role Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-gray-500 block">Title</span>
                <span className="text-sm font-medium text-white">{analysis.title || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Company</span>
                <span className="text-sm font-medium text-white">{analysis.company || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Level</span>
                <span className="text-sm font-medium text-white">{analysis.level || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Experience</span>
                <span className="text-sm font-medium text-white">{analysis.experience_years || '—'} years</span>
              </div>
            </div>
            {analysis.summary && (
              <p className="text-sm text-gray-300 mt-4 pt-4 border-t border-gray-700/50">{analysis.summary}</p>
            )}
          </div>

          {/* Required Skills */}
          {analysis.required_skills?.length > 0 && (
            <div className="card">
              <h2 className="section-title text-red-400">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.required_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-600/15 border border-red-600/30 text-red-300 rounded-lg text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Skills */}
          {analysis.preferred_skills?.length > 0 && (
            <div className="card">
              <h2 className="section-title text-yellow-400">Preferred Skills</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.preferred_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-yellow-600/15 border border-yellow-600/30 text-yellow-300 rounded-lg text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Key Concepts */}
          {analysis.key_concepts?.length > 0 && (
            <div className="card">
              <h2 className="section-title text-brand-400">Key Concepts</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.key_concepts.map((concept, i) => (
                  <span key={i} className="px-3 py-1.5 bg-brand-600/15 border border-brand-600/30 text-brand-300 rounded-lg text-sm font-medium">{concept}</span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {analysis.responsibilities?.length > 0 && (
            <div className="card">
              <h2 className="section-title">Key Responsibilities</h2>
              <ul className="space-y-2">
                {analysis.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-brand-400 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
