import { useState, useEffect } from 'react';
import SectionEditor from './SectionEditor';
import { useModal } from '../../context/ModalContext';
import TerminalField from '../common/TerminalField';
import { RESUME_SECTION_OPTIONS, getSectionVisibility } from './sectionVisibility';

const EXPERIENCE_FIELDS = [
  { key: 'role', label: 'Role_Title', placeholder: 'Role / Title' },
  { key: 'company', label: 'Entity_Name', placeholder: 'Company' },
  { key: 'startDate', label: 'Start_Timestamp', placeholder: 'Jan 2023' },
  { key: 'endDate', label: 'End_Timestamp', placeholder: 'Present', defaultValue: 'Present' },
  { key: 'location', label: 'Geographic_Tag', placeholder: 'Location', fullWidth: true },
  { key: 'bullets', label: 'Description_Log_Entries', placeholder: 'Enter description entry...', type: 'bullets', fullWidth: true },
];

const PROJECT_FIELDS = [
  { key: 'name', label: 'Project_Identity', placeholder: 'Project Name' },
  { key: 'technologies', label: 'Technology_Stack', placeholder: 'React, Node.js, MongoDB' },
  { key: 'liveUrl', label: 'Live_Deployment_URL', placeholder: 'https://...' },
  { key: 'githubUrl', label: 'Source_Code_Repository', placeholder: 'github.com/...' },
  { key: 'bullets', label: 'Description_Log_Entries', placeholder: 'Enter description entry...', type: 'bullets', fullWidth: true },
];

const CERTIFICATION_FIELDS = [
  { key: 'name', label: 'Certification_Name', placeholder: 'AWS Certified Developer' },
  { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services' },
  { key: 'date', label: 'Issue_Date', placeholder: 'May 2026' },
  { key: 'url', label: 'Credential_URL', placeholder: 'https://...' },
];

const EDUCATION_FIELDS = [
  { key: 'institution', label: 'Institution', placeholder: 'University Name' },
  { key: 'degree', label: 'Degree_Type', placeholder: 'B.S.' },
  { key: 'field', label: 'Field_Of_Study', placeholder: 'Computer Science' },
  { key: 'endDate', label: 'Completion_Date', placeholder: 'May 2023' },
];

const CHARACTER_REFERENCE_FIELDS = [
  { key: 'fullName', label: 'Full_Name', placeholder: 'Juan Dela Cruz' },
  { key: 'position', label: 'Position', placeholder: 'Senior Manager' },
  { key: 'company', label: 'Company', placeholder: 'Acme Corp' },
  { key: 'email', label: 'Email_Address', placeholder: 'juan@company.com', type: 'email' },
  { key: 'phone', label: 'Contact_Number', placeholder: '+63-XXX-XXX-XXXX' },
];

export default function ResumeForm({ version, onSave }) {
  const { confirm, formModal } = useModal();
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

  // Experience helpers (modal-based add)
  const addExperience = async () => {
    const result = await formModal('ADD_EXPERIENCE_RECORD', EXPERIENCE_FIELDS);
    if (!result) return;
    update('experience', [...(data.experience || []), result]);
  };
  const updateExperience = (idx, updates) => {
    const exp = [...(data.experience || [])];
    exp[idx] = { ...exp[idx], ...updates };
    update('experience', exp);
  };
  const removeExperience = (idx) => {
    update('experience', (data.experience || []).filter((_, i) => i !== idx));
  };

  // Project helpers (modal-based add)
  const addProject = async () => {
    const result = await formModal('ADD_PROJECT_DATA', PROJECT_FIELDS);
    if (!result) return;
    update('projects', [...(data.projects || []), result]);
  };
  const updateProject = (idx, updates) => {
    const proj = [...(data.projects || [])];
    proj[idx] = { ...proj[idx], ...updates };
    update('projects', proj);
  };
  const removeProject = (idx) => {
    update('projects', (data.projects || []).filter((_, i) => i !== idx));
  };

  // Education helpers (modal-based add)
  const addEducation = async () => {
    const result = await formModal('ADD_ACADEMIC_RECORD', EDUCATION_FIELDS);
    if (!result) return;
    update('education', [...(data.education || []), result]);
  };
  const updateEducation = (idx, updates) => {
    const edu = [...(data.education || [])];
    edu[idx] = { ...edu[idx], ...updates };
    update('education', edu);
  };
  const removeEducation = (idx) => {
    update('education', (data.education || []).filter((_, i) => i !== idx));
  };

  // Certification helpers (modal-based add)
  const addCertification = async () => {
    const result = await formModal('ADD_CERTIFICATION_RECORD', CERTIFICATION_FIELDS);
    if (!result) return;
    update('certifications', [...(data.certifications || []), result]);
  };
  const updateCertification = (idx, updates) => {
    const certs = [...(data.certifications || [])];
    certs[idx] = { ...certs[idx], ...updates };
    update('certifications', certs);
  };
  const removeCertification = (idx) => {
    update('certifications', (data.certifications || []).filter((_, i) => i !== idx));
  };

  // Character Reference helpers (modal-based add)
  const addCharacterReference = async () => {
    const result = await formModal('ADD_CHARACTER_REFERENCE', CHARACTER_REFERENCE_FIELDS);
    if (!result) return;
    update('characterReferences', [...(data.characterReferences || []), result]);
  };
  const updateCharacterReference = (idx, updates) => {
    const refs = [...(data.characterReferences || [])];
    refs[idx] = { ...refs[idx], ...updates };
    update('characterReferences', refs);
  };
  const removeCharacterReference = (idx) => {
    update('characterReferences', (data.characterReferences || []).filter((_, i) => i !== idx));
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
        <div className="p-6 space-y-6">
          {(data.technicalSkills || []).map((cat, idx) => (
            <div key={idx} className="border-b border-[var(--terminal-border)] pb-6 last:border-b-0 last:pb-0 md:border-none md:pb-0 group">
              {/* Mobile Header (hidden on desktop) */}
              <div className="flex justify-between items-center mb-3 md:hidden">
                <span className="text-[10px] text-[var(--terminal-muted)] font-bold">SKILL_GROUP_0{idx + 1}</span>
                <button 
                  onClick={() => removeSkill(idx)} 
                  className="text-[10px] text-red-500 hover:underline"
                >
                  [REMOVE_GROUP]
                </button>
              </div>

              {/* Form inputs row */}
              <div className="flex gap-4 items-stretch">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4">
                  <TerminalField label="Category" value={cat.category} onChange={e => updateSkill(idx, 'category', e.target.value)} placeholder="LANGUAGES" />
                  <TerminalField label="Competencies" value={cat.skills} onChange={e => updateSkill(idx, 'skills', e.target.value)} placeholder="JS, TS, RUST..." />
                </div>
                {/* Desktop delete button (hidden on mobile) */}
                <div className="hidden md:flex flex-col items-center justify-center w-8 flex-shrink-0">
                  <label className="terminal-label opacity-0 select-none pointer-events-none">_</label>
                  <div className="flex-1 flex items-center justify-center">
                    <button 
                      onClick={() => removeSkill(idx)} 
                      className="p-2 text-red-500 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-all"
                      title="Remove category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
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

      {/* Certifications */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">CERTIFICATION_REGISTRY</span>
          <button onClick={addCertification} className="text-[10px] text-[var(--terminal-accent)] hover:underline font-bold">
            [ADD_CERT]
          </button>
        </header>
        <div className="p-6 space-y-6">
          {(data.certifications || []).map((cert, idx) => (
            <div key={idx} className="border-l-2 border-[var(--terminal-border)] pl-4 group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-[var(--terminal-muted)] font-bold">CERT_RECORD_0{idx + 1}</span>
                <button
                  onClick={async () => {
                    const ok = await confirm('Are you sure you want to purge this certification record?');
                    if (ok) removeCertification(idx);
                  }}
                  className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  [PURGE]
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalField label="Certification_Name" value={cert.name || ''} onChange={e => updateCertification(idx, { name: e.target.value })} placeholder="AWS Certified Developer" />
                <TerminalField label="Issuer" value={cert.issuer || ''} onChange={e => updateCertification(idx, { issuer: e.target.value })} placeholder="Amazon Web Services" />
                <TerminalField label="Issue_Date" value={cert.date || ''} onChange={e => updateCertification(idx, { date: e.target.value })} placeholder="May 2026" />
                <TerminalField label="Credential_URL" value={cert.url || ''} onChange={e => updateCertification(idx, { url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          ))}
          {(data.certifications || []).length === 0 && (
            <div className="text-center py-8 text-[var(--terminal-muted)] text-xs italic">
              [NO_CERTIFICATIONS_REGISTERED]
            </div>
          )}
        </div>
      </div>

      {/* Character References */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">CHARACTER_REFERENCES</span>
          <button onClick={addCharacterReference} className="text-[10px] text-[var(--terminal-accent)] hover:underline font-bold">
            [ADD_REFERENCE]
          </button>
        </header>
        <div className="p-6 space-y-6">
          {(data.characterReferences || []).map((ref, idx) => (
            <div key={idx} className="border-l-2 border-[var(--terminal-border)] pl-4 group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-[var(--terminal-muted)] font-bold">REF_RECORD_0{idx + 1}</span>
                <button
                  onClick={async () => {
                    const ok = await confirm('Are you sure you want to purge this character reference?');
                    if (ok) removeCharacterReference(idx);
                  }}
                  className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  [PURGE]
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalField label="Full_Name" value={ref.fullName || ''} onChange={e => updateCharacterReference(idx, { fullName: e.target.value })} placeholder="Juan Dela Cruz" />
                <TerminalField label="Position" value={ref.position || ''} onChange={e => updateCharacterReference(idx, { position: e.target.value })} placeholder="Senior Manager" />
                <TerminalField label="Company" value={ref.company || ''} onChange={e => updateCharacterReference(idx, { company: e.target.value })} placeholder="Acme Corp" />
                <TerminalField label="Email_Address" value={ref.email || ''} onChange={e => updateCharacterReference(idx, { email: e.target.value })} placeholder="juan@company.com" type="email" />
                <TerminalField label="Contact_Number" value={ref.phone || ''} onChange={e => updateCharacterReference(idx, { phone: e.target.value })} placeholder="+63-XXX-XXX-XXXX" />
              </div>
            </div>
          ))}
          {(data.characterReferences || []).length === 0 && (
            <div className="text-center py-8 text-[var(--terminal-muted)] text-xs italic">
              [NO_REFERENCES_REGISTERED]
            </div>
          )}
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
