export default function SectionEditor({ title, icon, items, onAdd, onUpdate, onRemove, type }) {
  const addBullet = (idx) => {
    const bullets = [...(items[idx].bullets || []), { text: '' }];
    onUpdate(idx, { bullets });
  };
  const updateBullet = (itemIdx, bulletIdx, text) => {
    const bullets = [...(items[itemIdx].bullets || [])];
    bullets[bulletIdx] = { text };
    onUpdate(itemIdx, { bullets });
  };
  const removeBullet = (itemIdx, bulletIdx) => {
    const bullets = (items[itemIdx].bullets || []).filter((_, i) => i !== bulletIdx);
    onUpdate(itemIdx, { bullets });
  };

  return (
    <div className="terminal-card !p-0 overflow-hidden">
      <header className="terminal-header bg-[var(--terminal-header)]">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[var(--terminal-accent)] text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        <button onClick={onAdd} className="text-[10px] text-[var(--terminal-accent)] hover:underline flex items-center gap-1 font-bold">
          [ADD_ITEM]
        </button>
      </header>

      <div className="p-6 space-y-8">
        {items.map((item, idx) => (
          <div key={idx} className="relative border-l-2 border-[var(--terminal-border)] pl-6 group">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[var(--terminal-bg)] border-2 border-[var(--terminal-border)] rounded-full group-hover:border-[var(--terminal-accent)] transition-colors" />
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-[var(--terminal-muted)] uppercase tracking-tighter">
                {type === 'experience' ? `EXP_RECORD_0${idx + 1}` : `PROJ_DATA_0${idx + 1}`}
              </span>
              <button onClick={() => onRemove(idx)} className="text-[10px] text-red-500 hover:underline md:opacity-0 md:group-hover:opacity-100 transition-all">
                [PURGE_RECORD]
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {type === 'experience' ? (
                <>
                  <div>
                    <label className="terminal-label">Role_Title</label>
                    <input list="job-titles" value={item.role || ''} onChange={e => onUpdate(idx, { role: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Role / Title" />
                  </div>
                  <div>
                    <label className="terminal-label">Entity_Name</label>
                    <input value={item.company || ''} onChange={e => onUpdate(idx, { company: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Company" />
                  </div>
                  <div>
                    <label className="terminal-label">Start_Timestamp</label>
                    <input value={item.startDate || ''} onChange={e => onUpdate(idx, { startDate: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Jan 2023" />
                  </div>
                  <div>
                    <label className="terminal-label">End_Timestamp</label>
                    <input value={item.endDate || ''} onChange={e => onUpdate(idx, { endDate: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Present" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="terminal-label">Geographic_Tag</label>
                    <input list="locations" value={item.location || ''} onChange={e => onUpdate(idx, { location: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Location" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="terminal-label">Project_Identity</label>
                    <input value={item.name || ''} onChange={e => onUpdate(idx, { name: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Project Name" />
                  </div>
                  <div>
                    <label className="terminal-label">Technology_Stack</label>
                    <input list="tech-skills" value={item.technologies || ''} onChange={e => onUpdate(idx, { technologies: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div>
                    <label className="terminal-label">Live_Deployment_URL</label>
                    <input value={item.liveUrl || ''} onChange={e => onUpdate(idx, { liveUrl: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="terminal-label">Source_Code_Repository</label>
                    <input value={item.githubUrl || ''} onChange={e => onUpdate(idx, { githubUrl: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="github.com/..." />
                  </div>
                </>
              )}
            </div>

            {/* Bullets */}
            <div className="space-y-2 bg-[var(--terminal-surface)] p-3 md:p-4 border border-[var(--terminal-border)] rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase font-bold text-[var(--terminal-muted)] tracking-widest">Description_Log_Entries</label>
                <button onClick={() => addBullet(idx)} className="text-[10px] text-[var(--terminal-accent)] hover:underline">+ ADD_ENTRY</button>
              </div>
              {(item.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex gap-2 items-start group/bullet">
                  <span className="text-[var(--terminal-accent)] mt-2 text-xs font-bold flex-shrink-0">{'>'}</span>
                  <input
                    value={bullet.text || ''}
                    onChange={e => updateBullet(idx, bIdx, e.target.value)}
                    className="bg-transparent border-none focus:ring-0 flex-1 text-[11px] text-[var(--terminal-text)] py-1 placeholder-[var(--terminal-border)] min-w-0"
                    placeholder="Enter description entry..."
                  />
                  <button onClick={() => removeBullet(idx, bIdx)} className="p-1 text-red-500 md:opacity-0 md:group-hover/bullet:opacity-100 transition-all flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-[var(--terminal-muted)] text-xs italic">
            [NO_RECORDS_INITIALIZED]
          </div>
        )}
      </div>
    </div>
  );
}

