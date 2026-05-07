import { useState, useEffect } from 'react';
import SectionEditor from './SectionEditor';
import { useModal } from '../../context/ModalContext';

export default function ResumeForm({ version, onSave }) {
  const { confirm } = useModal();
  const [data, setData] = useState(version);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setData(version); setDirty(false); }, [version]);

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

  const handleSave = () => { onSave(data); setDirty(false); };

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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="terminal-label">Paper_Size</label>
            <select value={data.settings?.paperSize || 'Letter'} onChange={e => updateSettings('paperSize', e.target.value)} className="input-terminal !py-1.5 !text-xs">
              <option value="Letter">US_LETTER (8.5" x 11")</option>
              <option value="Legal">US_LEGAL (8.5" x 14")</option>
              <option value="Folio">US_FOLIO (8.5" x 13")</option>
              <option value="A4">A4_ISO (210 x 297 mm)</option>
              <option value="A5">A5_ISO (148 x 210 mm)</option>
              <option value="Executive">EXECUTIVE (7.25" x 10.5")</option>
            </select>
          </div>
          <div>
            <label className="terminal-label">Template_ID</label>
            <select value={data.settings?.template || 'standard'} onChange={e => updateSettings('template', e.target.value)} className="input-terminal !py-1.5 !text-xs">
              <option value="standard">CLASSIC_STD</option>
              <option value="executive">EXEC_PRO</option>
              <option value="modern">MODERN_CLEAN</option>
              <option value="minimalist">MINIMAL_SLK</option>
              <option value="technical">TECH_STRUCT</option>
              <option value="creative">CREATIVE_VIBE</option>
              <option value="academic">ACADEMIC_FORMAL</option>
              <option value="compact">COMPACT_TIGHT</option>
            </select>
          </div>
          <div>
            <label className="terminal-label">Font_Family</label>
            <select value={data.settings?.fontFamily || 'Arial, Helvetica, sans-serif'} onChange={e => updateSettings('fontFamily', e.target.value)} className="input-terminal !py-1.5 !text-xs">
              <option value="Arial, Helvetica, sans-serif">ARIAL_SANS</option>
              <option value="'Roboto', sans-serif">ROBOTO_SANS</option>
              <option value="'Inter', sans-serif">INTER_SANS</option>
              <option value="'Times New Roman', Times, serif">TIMES_SERIF</option>
              <option value="'Fira Code', monospace">FIRA_MONO</option>
              <option value="'Courier New', monospace">COURIER_MONO</option>
            </select>
          </div>
          <div>
            <label className="terminal-label">Base_Size</label>
            <select value={data.settings?.fontSize || '11pt'} onChange={e => updateSettings('fontSize', e.target.value)} className="input-terminal !py-1.5 !text-xs">
              <option value="9pt">9.0_PT</option>
              <option value="10pt">10.0_PT</option>
              <option value="11pt">11.0_PT</option>
              <option value="12pt">12.0_PT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">IDENTITY_BLOCK</span>
        </header>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="terminal-label">Full_Name</label>
            <input value={data.contact?.fullName || ''} onChange={e => updateContact('fullName', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="ENTITY_NAME" />
          </div>
          <div>
            <label className="terminal-label">Email_Address</label>
            <input value={data.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="user@domain.com" type="email" />
          </div>
          <div>
            <label className="terminal-label">Comm_Link_Phone</label>
            <input value={data.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="+X-XXX-XXX-XXXX" />
          </div>
          <div>
            <label className="terminal-label">Geographic_LOC</label>
            <input list="locations" value={data.contact?.location || ''} onChange={e => updateContact('location', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="CITY, STATE/PROV" />
          </div>
          <div>
            <label className="terminal-label">LinkedIn_URI</label>
            <input value={data.contact?.linkedin || ''} onChange={e => updateContact('linkedin', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="linkedin.com/in/..." />
          </div>
          <div>
            <label className="terminal-label">GitHub_URI</label>
            <input value={data.contact?.github || ''} onChange={e => updateContact('github', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="github.com/..." />
          </div>
          <div>
            <label className="terminal-label">Portfolio_URI</label>
            <input value={data.contact?.portfolio || ''} onChange={e => updateContact('portfolio', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="portfolio.com/..." />
          </div>
        </div>
      </div>

      {/* Target Role */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">TARGETING_METRICS</span>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="terminal-label">Objective_Role</label>
              <input list="job-titles" value={data.targetRole || ''} onChange={e => update('targetRole', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="SR_ENGINEER" />
            </div>
            <div>
              <label className="terminal-label">Seniority_Tier</label>
              <select value={data.experienceLevel || ''} onChange={e => update('experienceLevel', e.target.value)} className="input-terminal !py-1.5 !text-xs">
                <option value="">SELECT_TIER</option>
                <option value="junior">L1_JUNIOR</option>
                <option value="mid">L2_MID_LEVEL</option>
                <option value="senior">L3_SENIOR</option>
                <option value="staff">L4_STAFF</option>
                <option value="principal">L5_PRINCIPAL</option>
              </select>
            </div>
          </div>
          <div>
            <label className="terminal-label">Reference_Job_Description (RAW_DATA)</label>
            <textarea value={data.jobDescription || ''} onChange={e => update('jobDescription', e.target.value)} className="input-terminal h-32 !p-4 !text-xs leading-relaxed" placeholder="PASTE_JD_FOR_AI_OPTIMIZATION..." />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="terminal-card !p-0">
        <header className="terminal-header bg-[var(--terminal-header)]">
          <span className="text-[10px] text-[var(--terminal-accent)] font-bold uppercase tracking-widest">EXECUTIVE_SUMMARY_LOG</span>
        </header>
        <div className="p-6">
          <textarea value={data.summary || ''} onChange={e => update('summary', e.target.value)} className="input-terminal h-24 !p-4 !text-xs leading-relaxed" placeholder="BRIEF_VALUE_PROPOSITION..." />
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
              <div className="w-full md:w-40 flex-shrink-0">
                <label className="terminal-label">Category</label>
                <input list="skill-categories" value={cat.category} onChange={e => updateSkill(idx, 'category', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="LANGUAGES" />
              </div>
              <div className="w-full md:flex-1 relative">
                <label className="terminal-label">Competencies</label>
                <input list="tech-skills" value={cat.skills} onChange={e => updateSkill(idx, 'skills', e.target.value)} className="input-terminal !py-1.5 !text-xs" placeholder="JS, TS, RUST..." />
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
                <div>
                  <label className="terminal-label">Institution</label>
                  <input value={edu.institution} onChange={e => updateEducation(idx, { institution: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="University Name" />
                </div>
                <div>
                  <label className="terminal-label">Degree_Type</label>
                  <input list="degrees" value={edu.degree} onChange={e => updateEducation(idx, { degree: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="B.S." />
                </div>
                <div>
                  <label className="terminal-label">Field_Of_Study</label>
                  <input list="fields" value={edu.field} onChange={e => updateEducation(idx, { field: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="Computer Science" />
                </div>
                <div>
                  <label className="terminal-label">Completion_Date</label>
                  <input value={edu.endDate} onChange={e => updateEducation(idx, { endDate: e.target.value })} className="input-terminal !py-1.5 !text-xs" placeholder="May 2023" />
                </div>
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

      {/* Datalists */}
      <datalist id="locations"><option value="Remote" /><option value="Hybrid" /><option value="San Francisco, CA" /><option value="New York, NY" /></datalist>
      <datalist id="job-titles"><option value="Software Engineer" /><option value="Frontend Developer" /><option value="Backend Developer" /><option value="Full Stack Developer" /></datalist>
      <datalist id="skill-categories"><option value="Languages" /><option value="Frontend" /><option value="Backend" /><option value="Databases" /><option value="Cloud & DevOps" /></datalist>
      <datalist id="tech-skills"><option value="JavaScript, TypeScript, React, HTML, CSS" /><option value="Node.js, Express, MongoDB, PostgreSQL" /></datalist>
      <datalist id="degrees"><option value="Bachelor of Science" /><option value="Master of Science" /><option value="Ph.D." /></datalist>
      <datalist id="fields"><option value="Computer Science" /><option value="Software Engineering" /><option value="Data Science" /></datalist>
    </div>
  );
}

