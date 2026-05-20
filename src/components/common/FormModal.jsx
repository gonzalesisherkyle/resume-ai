import { useState } from 'react';
import TerminalField from './TerminalField';

export default function FormModal({ fields, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue || '' }), {})
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
        {fields.map((field) => (
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
        ))}
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
