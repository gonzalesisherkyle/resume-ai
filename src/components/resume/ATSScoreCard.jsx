export default function ATSScoreCard({ score }) {
  if (!score || !score.overall) {
    return (
      <div className="terminal-card text-center py-20 opacity-40">
        <div className="text-4xl mb-4">🔍</div>
        <div className="text-xs uppercase tracking-widest font-mono">System_Awaiting_Analysis_Data...</div>
      </div>
    );
  }

  const getColorClass = (s) => s >= 70 ? 'text-[var(--terminal-green)]' : s >= 40 ? 'text-[var(--terminal-amber)]' : 'text-red-500';
  const getBgClass = (s) => s >= 70 ? 'bg-[var(--terminal-green)]' : s >= 40 ? 'bg-[var(--terminal-amber)]' : 'bg-red-500';

  const categories = [
    { key: 'keywordMatch', label: 'KEYWORD_VECTOR_MATCH', weight: '30%' },
    { key: 'technicalDepth', label: 'TECH_STACK_DENSITY', weight: '25%' },
    { key: 'impactMetrics', label: 'KPI_QUANTIFICATION', weight: '20%' },
    { key: 'atsCompliance', label: 'PARSER_COMPATIBILITY', weight: '15%' },
    { key: 'readability', label: 'LEXICAL_COHERENCE', weight: '10%' },
  ];

  return (
    <div className="space-y-8 font-mono animate-fade-in">
      {/* Diagnostic Header */}
      <div className="terminal-card bg-[var(--terminal-header)] !p-0">
        <header className="terminal-header border-b border-[var(--terminal-border)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">DIAGNOSTIC_REPORT_V1.0</span>
        </header>
        <div className="p-8 flex flex-col items-center">
          <div className="text-[10px] text-[var(--terminal-muted)] mb-2 uppercase tracking-tighter">Aggregated_System_Compatibility</div>
          <div className={`text-6xl font-black ${getColorClass(score.overall)} mb-4 tracking-tighter`}>
            {score.overall}%
          </div>
          <div className="text-[10px] uppercase text-[var(--terminal-muted)] tracking-widest border border-[var(--terminal-border)] px-3 py-1">
            Status: {score.overall >= 70 ? 'OPTIMAL' : score.overall >= 40 ? 'DEGRADED' : 'CRITICAL'}
          </div>
        </div>
      </div>

      {/* Detail Breakdown */}
      <div className="terminal-card !p-0 overflow-hidden">
        <header className="terminal-header bg-[var(--terminal-surface)] border-b border-[var(--terminal-border)]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terminal-muted)]">Matrix_Breakdown</span>
        </header>
        <div className="p-6 space-y-6">
          {categories.map(cat => {
            const catScore = score.categories?.[cat.key]?.score || 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[var(--terminal-text)]">{cat.label}</span>
                  <span className={`text-[10px] font-bold ${getColorClass(catScore)}`}>{catScore}%</span>
                </div>
                <div className="h-1 bg-[var(--terminal-border)] w-full relative">
                  <div 
                    className={`h-full ${getBgClass(catScore)} transition-all duration-1000`} 
                    style={{ width: `${catScore}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Failures */}
        <div className="terminal-card !p-0">
          <header className="terminal-header bg-red-950/20">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Logic_Faults</span>
          </header>
          <div className="p-6 space-y-3">
            {score.weaknesses?.map((w, i) => (
              <div key={i} className="flex gap-2 text-[10px] text-[var(--terminal-text)] opacity-80 leading-relaxed">
                <span className="text-red-500 font-bold">[ERR]</span>
                {w.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Patches */}
        <div className="terminal-card !p-0">
          <header className="terminal-header bg-blue-950/20">
            <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">System_Patches</span>
          </header>
          <div className="p-6 space-y-3">
            {score.suggestions?.map((s, i) => (
              <div key={i} className="flex gap-2 text-[10px] text-[var(--terminal-text)] opacity-80 leading-relaxed">
                <span className="text-[var(--terminal-accent)] font-bold">[FIX]</span>
                {s.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

