export default function ATSScoreCard({ score }) {
  if (!score || !score.overall) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-surface-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No score yet</h3>
        <p className="text-gray-400">Click "Score" to analyze your resume</p>
      </div>
    );
  }

  const getColor = (s) => s >= 70 ? 'text-green-400' : s >= 40 ? 'text-yellow-400' : 'text-red-400';
  const getBg = (s) => s >= 70 ? 'bg-green-400' : s >= 40 ? 'bg-yellow-400' : 'bg-red-400';

  const categories = [
    { key: 'keywordMatch', label: 'Keyword Match', weight: '30%' },
    { key: 'technicalDepth', label: 'Technical Depth', weight: '25%' },
    { key: 'impactMetrics', label: 'Impact & Metrics', weight: '20%' },
    { key: 'atsCompliance', label: 'ATS Compliance', weight: '15%' },
    { key: 'readability', label: 'Readability', weight: '10%' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Overall Score */}
      <div className="card text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="56" stroke={score.overall >= 70 ? '#4ade80' : score.overall >= 40 ? '#facc15' : '#f87171'} strokeWidth="8" fill="none" strokeDasharray={`${(score.overall / 100) * 352} 352`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getColor(score.overall)}`}>{score.overall}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white">ATS Score</h3>
        <p className="text-gray-400 text-sm mt-1">
          {score.overall >= 70 ? 'Great! Your resume is well-optimized.' : score.overall >= 40 ? 'Good start, but there\'s room for improvement.' : 'Needs significant improvement.'}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 className="section-title">Score Breakdown</h3>
        <div className="space-y-4">
          {categories.map(cat => {
            const catScore = score.categories?.[cat.key]?.score || 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-300">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{cat.weight}</span>
                    <span className={`text-sm font-semibold ${getColor(catScore)}`}>{catScore}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${getBg(catScore)}`} style={{ width: `${catScore}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weaknesses */}
      {score.weaknesses?.length > 0 && (
        <div className="card">
          <h3 className="section-title text-red-400">Weaknesses</h3>
          <ul className="space-y-2">
            {score.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className="text-red-400 mt-0.5">✕</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {score.suggestions?.length > 0 && (
        <div className="card">
          <h3 className="section-title text-brand-400">Suggestions</h3>
          <ul className="space-y-2">
            {score.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className="text-brand-400 mt-0.5">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
