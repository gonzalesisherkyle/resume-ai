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
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title !mb-0 flex items-center gap-2">{icon} {title}</h2>
        <button onClick={onAdd} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="border border-gray-700/50 rounded-lg p-4 mb-4 group">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              {type === 'experience' ? `Experience ${idx + 1}` : `Project ${idx + 1}`}
            </span>
            <button onClick={() => onRemove(idx)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {type === 'experience' ? (
              <>
                <input list="job-titles" value={item.role || ''} onChange={e => onUpdate(idx, { role: e.target.value })} className="input-field" placeholder="Role / Title" />
                <input value={item.company || ''} onChange={e => onUpdate(idx, { company: e.target.value })} className="input-field" placeholder="Company" />
                <input value={item.startDate || ''} onChange={e => onUpdate(idx, { startDate: e.target.value })} className="input-field" placeholder="Start Date (Jan 2023)" />
                <input value={item.endDate || ''} onChange={e => onUpdate(idx, { endDate: e.target.value })} className="input-field" placeholder="End Date (Present)" />
                <input list="locations" value={item.location || ''} onChange={e => onUpdate(idx, { location: e.target.value })} className="input-field md:col-span-2" placeholder="Location" />
              </>
            ) : (
              <>
                <input value={item.name || ''} onChange={e => onUpdate(idx, { name: e.target.value })} className="input-field" placeholder="Project Name" />
                <input list="tech-skills" value={item.technologies || ''} onChange={e => onUpdate(idx, { technologies: e.target.value })} className="input-field" placeholder="React, Node.js, MongoDB" />
                <input value={item.liveUrl || ''} onChange={e => onUpdate(idx, { liveUrl: e.target.value })} className="input-field" placeholder="Live URL (optional)" />
                <input value={item.githubUrl || ''} onChange={e => onUpdate(idx, { githubUrl: e.target.value })} className="input-field" placeholder="GitHub URL (optional)" />
              </>
            )}
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Bullet Points</label>
              <button onClick={() => addBullet(idx)} className="text-xs text-brand-400 hover:text-brand-300">+ Add Bullet</button>
            </div>
            {(item.bullets || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex gap-2 items-start">
                <span className="text-gray-500 mt-2.5 text-sm">•</span>
                <input
                  value={bullet.text || ''}
                  onChange={e => updateBullet(idx, bIdx, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Developed RESTful API using Node.js..."
                />
                <button onClick={() => removeBullet(idx, bIdx)} className="p-2 text-gray-500 hover:text-red-400 transition-all mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
