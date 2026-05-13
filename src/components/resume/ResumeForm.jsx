import { useState, useEffect } from 'react';
import SectionEditor from './SectionEditor';
import { useModal } from '../../context/ModalContext';
import TerminalField from '../common/TerminalField';
import { RESUME_SECTION_OPTIONS, getSectionVisibility } from './sectionVisibility';

export default function ResumeForm({ version, onSave }) {
  const { confirm } = useModal();
  const [data, setData] = useState(version);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      setData(version);
      setDirty(false);
    });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const update = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const updateContact = (field, value) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    setDirty(true);
  };

  const updateSettings = (field, value) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, [field]: value } }));
    setDirty(true);
  };

  const updateSectionVisibility = (sectionKey, isVisible) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionVisibility: {
          ...getSectionVisibility(prev.settings),
          [sectionKey]: isVisible,
        },
      },
    }));
    setDirty(true);
  };

  const handleSave = () => { onSave(data); setDirty(false); };
  const sectionVisibility = getSectionVisibility(data.settings);

  // Skills helpers
  const addSkillCategory = () => {
    update('technicalSkills', [...(data.technicalSkills || []), { category: '', skills: '' }]);
  };
  const updateSkill = (idx, field, val) => {
    const skills = [...(data.technicalSkills || [])];
    skills[idx] = { ...skills[idx], [field]: val };
    update('technicalSkills', skills);
  };
  const removeSkill = (idx) => {
    update('technicalSkills', (data.technicalSkills || []).filter((_, i) => i !== idx));
  };

  // Experience helpers
  const addExperience = () => {
    update('experience', [...(data.experience || []), { company: '', role: '', startDate: '', endDate: 'Present', location: '', bullets: [{ text: '' }] }]);
  };
  const updateExperience = (idx, updates) => {
    const exp = [...(data.experience || [])];
    exp[idx] = { ...exp[idx], ...updates };
    update('experience', exp);
  };
  const removeExperience = (idx) => {
    update('experience', (data.experience || []).filter((_, i) => i !== idx));
  };

  // Project helpers
  const addProject = () => {
    update('projects', [...(data.projects || []), { name: '', technologies: '', bullets: [{ text: '' }] }]);
  };
  const updateProject = (idx, updates) => {
    const proj = [...(data.projects || [])];
    proj[idx] = { ...proj[idx], ...updates };
    update('projects', proj);
  };
  const removeProject = (idx) => {
    update('projects', (data.projects || []).filter((_, i) => i !== idx));
  };

  // Education helpers
  const addEducation = () => {
    update('education', [...(data.education || []), { institution: '', degree: '', field: '', endDate: '' }]);
  };
  const updateEducation = (idx, updates) => {
    const edu = [...(data.education || [])];
    edu[idx] = { ...edu[idx], ...updates };
    update('education', edu);
  };
  const removeEducation = (idx) => {
    update('education', (data.education || []).filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 font-mono pb-20">
      {/* Save bar */}
      {dirty && (
        <div className="sticky top-0 z-30 bg-[var(--terminal-bg)] border border-[var(--terminal-accent)] p-3 flex items-center justify-between shadow-[0_0_20px_rgba(0,255,255,0.1)] animate-pulse">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--terminal-accent)] rounded-full" />
            BUFFER_MODIFIED: [UNSAVED_CHANGES]
          </span>
          <button onClick={handleSave} className="text-[10px] font-bold text-[var(--terminal-bg)] bg-[var(--terminal-accent)] px-4 py-1 hover:opacity-90">
            COMMIT_CHANGES
          </button>
        </div>
      )}

      {/* Styling & Templates */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">RENDER_CONFIG</span>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TerminalField as="select" label="Paper_Size" value={data.settings?.paperSize || 'Letter'} onChange={e => updateSettings('paperSize', e.target.value)}>
                <option value="Letter">US_LETTER (8.5" x 11")</option>
                <option value="Legal">US_LEGAL (8.5" x 14")</option>
                <option value="Folio">US_FOLIO (8.5" x 13")</option>
                <option value="A4">A4_ISO (210 x 297 mm)</option>
                <option value="A5">A5_ISO (148 x 210 mm)</option>
                <option value="Executive">EXECUTIVE (7.25" x 10.5")</option>
            </TerminalField>
            <TerminalField as="select" label="Template_ID" value={data.settings?.template || 'standard'} onChange={e => updateSettings('template', e.target.value)}>
                <option value="standard">CLASSIC_STD</option>
                <option value="executive">EXEC_PRO</option>
                <option value="modern">MODERN_CLEAN</option>
                <option value="minimalist">MINIMAL_SLK</option>
                <option value="technical">TECH_STRUCT</option>
                <option value="creative">CREATIVE_VIBE</option>
                <option value="academic">ACADEMIC_FORMAL</option>
                <option value="compact">COMPACT_TIGHT</option>
            </TerminalField>
            <TerminalField as="select" label="Font_Family" value={data.settings?.fontFamily || 'Arial, Helvetica, sans-serif'} onChange={e => updateSettings('fontFamily', e.target.value)}>
                <option value="Arial, Helvetica, sans-serif">ARIAL_SANS</option>
                <option value="'Roboto', sans-serif">ROBOTO_SANS</option>
                <option value="'Inter', sans-serif">INTER_SANS</option>
                <option value="'Times New Roman', Times, serif">TIMES_SERIF</option>
                <option value="'Fira Code', monospace">FIRA_MONO</option>
                <option value="'Courier New', monospace">COURIER_MONO</option>
            </TerminalField>
            <TerminalField as="select" label="Base_Size" value={data.settings?.fontSize || '11pt'} onChange={e => updateSettings('fontSize', e.target.value)}>
                <option value="9pt">9.0_PT</option>
                <option value="10pt">10.0_PT</option>
                <option value="11pt">11.0_PT</option>
                <option value="12pt">12.0_PT</option>
            </TerminalField>
          </div>

          <div className="border-t border-[var(--terminal-border)] pt-5">
            <div className="terminal-label">Include_Sections</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RESUME_SECTION_OPTIONS.map(section => {
                const checked = sectionVisibility[section.key] !== false;

                return (
                  <label
                    key={section.key}
                    className={`flex min-w-0 cursor-pointer items-center justify-between gap-3 border px-3 py-2 transition-colors ${
                      checked
                        ? 'border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[var(--terminal-text)] hover:border-[var(--terminal-accent)]'
                        : 'border-[var(--terminal-border)] bg-[var(--terminal-surface)] text-[var(--terminal-muted)] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => updateSectionVisibility(section.key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold uppercase tracking-widest">{section.label}</span>
                      <span className={`block text-[9px] uppercase tracking-widest ${checked ? 'text-[var(--terminal-accent)]' : 'text-[var(--terminal-muted)]'}`}>
                        {checked ? 'INCLUDED' : 'EXCLUDED'}
                      </span>
                    </span>
                    <span
                      className={`relative h-5 w-10 flex-shrink-0 rounded-full border transition-colors ${
                        checked
                          ? 'border-[var(--terminal-accent)] bg-[rgba(0,243,255,0.18)]'
                          : 'border-[var(--terminal-border)] bg-[var(--terminal-bg)]'
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-all ${
                          checked
                            ? 'left-[22px] bg-[var(--terminal-accent)]'
                            : 'left-1 bg-[var(--terminal-muted)]'
                        }`}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">IDENTITY_BLOCK</span>
        </header>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TerminalField label="Full_Name" value={data.contact?.fullName || ''} onChange={e => updateContact('fullName', e.target.value)} placeholder="ENTITY_NAME" />
          <TerminalField label="Email_Address" value={data.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} placeholder="user@domain.com" type="email" />
          <TerminalField label="Comm_Link_Phone" value={data.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} placeholder="+X-XXX-XXX-XXXX" />
          <TerminalField label="Geographic_LOC" value={data.contact?.location || ''} onChange={e => updateContact('location', e.target.value)} placeholder="CITY, STATE/PROV" />
          <TerminalField label="LinkedIn_URI" value={data.contact?.linkedin || ''} onChange={e => updateContact('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
          <TerminalField label="GitHub_URI" value={data.contact?.github || ''} onChange={e => updateContact('github', e.target.value)} placeholder="github.com/..." />
          <TerminalField label="Portfolio_URI" value={data.contact?.portfolio || ''} onChange={e => updateContact('portfolio', e.target.value)} placeholder="portfolio.com/..." />
        </div>
      </div>

      {/* Target Role */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">TARGETING_METRICS</span>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TerminalField label="Objective_Role" value={data.targetRole || ''} onChange={e => update('targetRole', e.target.value)} placeholder="SR_ENGINEER" />
            <TerminalField as="select" label="Seniority_Tier" value={data.experienceLevel || ''} onChange={e => update('experienceLevel', e.target.value)}>
                <option value="">SELECT_TIER</option>
                <option value="junior">L1_JUNIOR</option>
                <option value="mid">L2_MID_LEVEL</option>
                <option value="senior">L3_SENIOR</option>
                <option value="staff">L4_STAFF</option>
                <option value="principal">L5_PRINCIPAL</option>
            </TerminalField>
          </div>
          <TerminalField as="textarea" label="Reference_Job_Description (RAW_DATA)" value={data.jobDescription || ''} onChange={e => update('jobDescription', e.target.value)} className="h-32" placeholder="PASTE_JD_FOR_AI_OPTIMIZATION..." />
        </div>
      </div>

      {/* Professional Summary */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">EXECUTIVE_SUMMARY_LOG</span>
        </header>
        <div className="p-6">
          <TerminalField as="textarea" value={data.summary || ''} onChange={e => update('summary', e.target.value)} className="h-24" placeholder="BRIEF_VALUE_PROPOSITION..." />
        </div>
      </div>

      {/* Technical Skills */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">CORE_COMPETENCIES</span>
          <button onClick={addSkillCategory} className="text-[10px] text-[var(--terminal-accent)] hover:underline font-bold">
            [ADD_CATEGORY]
          </button>
        </header>
        <div className="p-6 space-y-4">
          {(data.technicalSkills || []).map((cat, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 items-start group">
              <TerminalField fieldClassName="w-full md:w-40 flex-shrink-0" label="Category" value={cat.category} onChange={e => updateSkill(idx, 'category', e.target.value)} placeholder="LANGUAGES" />
              <div className="w-full md:flex-1 relative">
                <TerminalField label="Competencies" value={cat.skills} onChange={e => updateSkill(idx, 'skills', e.target.value)} placeholder="JS, TS, RUST..." />
                <button onClick={() => removeSkill(idx)} className="absolute -right-2 top-0 p-2 text-red-500 md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <button onClick={() => removeSkill(idx)} className="hidden md:block p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all mt-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <SectionEditor
        title="EXPERIENCE_CHRONOLOGY"
        items={data.experience || []}
        onAdd={addExperience}
        onUpdate={updateExperience}
        onRemove={removeExperience}
        type="experience"
      />

      {/* Projects */}
      <SectionEditor
        title="PROJECT_PORTFOLIO"
        items={data.projects || []}
        onAdd={addProject}
        onUpdate={updateProject}
        onRemove={removeProject}
        type="project"
      />

      {/* Education */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">ACADEMIC_RECORDS</span>
          <button onClick={addEducation} className="text-[10px] text-[var(--terminal-accent)] hover:underline font-bold">
            [ADD_RECORD]
          </button>
        </header>
        <div className="p-6 space-y-6">
          {(data.education || []).map((edu, idx) => (
            <div key={idx} className="border-l-2 border-[var(--terminal-border)] pl-4 group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-[var(--terminal-muted)] font-bold">EDU_RECORD_0{idx + 1}</span>
                <button 
                  onClick={async () => {
                    const ok = await confirm('Are you sure you want to purge this academic record?');
                    if (ok) removeEducation(idx);
                  }} 
                  className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  [PURGE]
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalField label="Institution" value={edu.institution} onChange={e => updateEducation(idx, { institution: e.target.value })} placeholder="University Name" />
                <TerminalField label="Degree_Type" value={edu.degree} onChange={e => updateEducation(idx, { degree: e.target.value })} placeholder="B.S." />
                <TerminalField label="Field_Of_Study" value={edu.field} onChange={e => updateEducation(idx, { field: e.target.value })} placeholder="Computer Science" />
                <TerminalField label="Completion_Date" value={edu.endDate} onChange={e => updateEducation(idx, { endDate: e.target.value })} placeholder="May 2023" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-terminal btn-terminal-primary px-10 py-3 text-sm">
          SAVE_ALL_BUFFERS
        </button>
      </div>

    </div>
  );
}

