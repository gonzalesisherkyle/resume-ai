import { useModal } from '../../context/ModalContext';
import TerminalField from '../common/TerminalField';

export default function SectionEditor({ title, items, onAdd, onUpdate, onRemove, type }) {
  const { confirm } = useModal();
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
              <button 
                onClick={async () => {
                  const ok = await confirm(`Are you sure you want to purge this ${type === 'experience' ? 'experience record' : 'project data'}?`);
                  if (ok) onRemove(idx);
                }} 
                className="text-[10px] text-red-500 hover:underline md:opacity-0 md:group-hover:opacity-100 transition-all"
              >
                [PURGE_RECORD]
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {type === 'experience' ? (
                <>
                  <TerminalField label="Role_Title" value={item.role || ''} onChange={e => onUpdate(idx, { role: e.target.value })} placeholder="Role / Title" />
                  <TerminalField label="Entity_Name" value={item.company || ''} onChange={e => onUpdate(idx, { company: e.target.value })} placeholder="Company" />
                  <TerminalField label="Start_Timestamp" value={item.startDate || ''} onChange={e => onUpdate(idx, { startDate: e.target.value })} placeholder="Jan 2023" />
                  <TerminalField label="End_Timestamp" value={item.endDate || ''} onChange={e => onUpdate(idx, { endDate: e.target.value })} placeholder="Present" />
                  <TerminalField fieldClassName="md:col-span-2" label="Geographic_Tag" value={item.location || ''} onChange={e => onUpdate(idx, { location: e.target.value })} placeholder="Location" />
                </>
              ) : (
                <>
                  <TerminalField label="Project_Identity" value={item.name || ''} onChange={e => onUpdate(idx, { name: e.target.value })} placeholder="Project Name" />
                  <TerminalField label="Technology_Stack" value={item.technologies || ''} onChange={e => onUpdate(idx, { technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
                  <TerminalField label="Live_Deployment_URL" value={item.liveUrl || ''} onChange={e => onUpdate(idx, { liveUrl: e.target.value })} placeholder="https://..." />
                  <TerminalField label="Source_Code_Repository" value={item.githubUrl || ''} onChange={e => onUpdate(idx, { githubUrl: e.target.value })} placeholder="github.com/..." />
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
                <div key={bIdx} className="grid grid-cols-[1rem_minmax(0,1fr)_1.75rem] gap-2 items-start group/bullet">
                  <span className="text-[var(--terminal-accent)] pt-[0.4rem] text-xs font-bold">{'>'}</span>
                  <TerminalField
                    value={bullet.text || ''}
                    onChange={e => updateBullet(idx, bIdx, e.target.value)}
                    className="!px-3"
                    placeholder="Enter description entry..."
                  />
                  <button onClick={() => removeBullet(idx, bIdx)} className="mt-1 p-1 text-red-500 md:opacity-0 md:group-hover/bullet:opacity-100 transition-all">
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

