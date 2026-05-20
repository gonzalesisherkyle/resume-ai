import { useState } from 'react';
import TerminalField from './TerminalField';

export default function FormModal({ fields, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, f) => {
      if (f.type === 'bullets') {
        acc[f.key] = [{ text: '' }];
      } else {
        acc[f.key] = f.defaultValue || '';
      }
      return acc;
    }, {})
  );

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          if (field.type === 'bullets') {
            const bullets = formData[field.key] || [];
            return (
              <div key={field.key} className="md:col-span-2 space-y-2 bg-[var(--terminal-surface)] p-3 md:p-4 border border-[var(--terminal-border)] rounded">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--terminal-muted)] tracking-widest">{field.label}</label>
                  <button
                    type="button"
                    onClick={() => updateField(field.key, [...bullets, { text: '' }])}
                    className="text-[10px] text-[var(--terminal-accent)] hover:underline"
                  >
                    + ADD_ENTRY
                  </button>
                </div>
                {bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="grid grid-cols-[1rem_minmax(0,1fr)_1.75rem] gap-2 items-start group/bullet">
                    <span className="text-[var(--terminal-accent)] pt-[0.4rem] text-xs font-bold">{'>'}</span>
                    <TerminalField
                      value={bullet.text || ''}
                      onChange={(e) => {
                        const nextBullets = [...bullets];
                        nextBullets[bIdx] = { text: e.target.value };
                        updateField(field.key, nextBullets);
                      }}
                      className="!px-3"
                      placeholder={field.placeholder || "Enter description entry..."}
                    />
                    <button
                      type="button"
                      onClick={() => updateField(field.key, bullets.filter((_, i) => i !== bIdx))}
                      className="mt-1 p-1 text-red-500 hover:opacity-100 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <TerminalField
              key={field.key}
              fieldClassName={field.fullWidth ? 'md:col-span-2' : ''}
              as={field.as || 'input'}
              label={field.label}
              value={formData[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder || ''}
              type={field.type || 'text'}
            />
          );
        })}
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--terminal-border)] pt-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-terminal text-[10px]"
        >
          ABORT
        </button>
        <button
          type="submit"
          className="btn-terminal btn-terminal-primary text-[10px]"
        >
          CONFIRM_ADD
        </button>
      </div>
    </form>
  );
}
