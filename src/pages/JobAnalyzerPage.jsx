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
      toast.success('Extraction successful');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in font-mono">
      <div className="mb-10">
        <div className="text-[var(--terminal-accent)] text-sm mb-1">$ extract --source-type=job_description</div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Entity_Extractor</h1>
        <p className="text-[var(--terminal-muted)] text-sm mt-2">Process raw text to identify core competencies, requirements, and target metrics.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Terminal */}
        <div className="terminal-window h-fit">
          <header className="terminal-header">
            <span className="text-[10px] uppercase font-bold">input_buffer</span>
          </header>
          <div className="p-6">
            <label className="terminal-label">Raw_Description_Data</label>
            <textarea
              value={jobText}
              onChange={e => setJobText(e.target.value)}
              className="input-terminal h-64 resize-none !p-4 !text-xs leading-relaxed"
              placeholder="PASTE_TEXT_HERE..."
            />
            <button
              onClick={analyze}
              disabled={loading}
              className="btn-terminal btn-terminal-primary w-full mt-6 py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--terminal-bg)]/30 border-t-[var(--terminal-bg)] rounded-full animate-spin" />
                  PROCESSING_STREAM...
                </>
              ) : (
                'RUN_EXTRACTION'
              )}
            </button>
          </div>
        </div>

        {/* Results / Log */}
        <div className="space-y-6">
          {!analysis && !loading && (
            <div className="terminal-card border-dashed flex flex-col items-center justify-center py-20 opacity-30">
              <div className="text-3xl mb-4">📡</div>
              <div className="text-xs uppercase tracking-widest">Awaiting_Input_Data</div>
            </div>
          )}

          {analysis && (
            <div className="animate-slide-up space-y-6">
              {/* Header Info */}
              <div className="terminal-card bg-[var(--terminal-header)]">
                <div className="text-[10px] text-[var(--terminal-accent)] uppercase mb-4 font-bold border-b border-[var(--terminal-border)] pb-2">Record_Header</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="terminal-label">Title</div>
                    <div className="text-white text-sm font-bold truncate">{analysis.title || 'UNKNOWN'}</div>
                  </div>
                  <div>
                    <div className="terminal-label">Experience</div>
                    <div className="text-white text-sm font-bold">{analysis.experience_years || '0'}Y_REQD</div>
                  </div>
                </div>
              </div>

              {/* Skills Matrix */}
              <div className="terminal-card">
                <div className="text-[10px] text-[var(--terminal-green)] uppercase mb-4 font-bold border-b border-[var(--terminal-border)] pb-2">Requirement_Matrix</div>
                <div className="space-y-4">
                  <div>
                    <div className="terminal-label text-[10px] mb-2">Hard_Requirements</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.required_skills?.map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 border border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[var(--terminal-green)]/5">
                          {skill.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="terminal-label text-[10px] mb-2">Preferred_Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.preferred_skills?.map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 border border-[var(--terminal-amber)] text-[var(--terminal-amber)] bg-[var(--terminal-amber)]/5">
                          {skill.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="terminal-card">
                <div className="text-[10px] text-[var(--terminal-muted)] uppercase mb-2 font-bold">Analysis_Summary</div>
                <p className="text-xs text-[var(--terminal-text)] leading-relaxed italic opacity-80">
                  "{analysis.summary}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

