import { useState, useEffect } from 'react';
import SectionEditor from './SectionEditor';

export default function ResumeForm({ version, onSave }) {
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
    <div className="space-y-6">
      {/* Save bar */}
      {dirty && (
        <div className="sticky top-16 z-30 bg-surface-800/95 backdrop-blur-md border border-brand-500/30 rounded-lg p-3 flex items-center justify-between animate-slide-up">
          <span className="text-sm text-brand-400">Unsaved changes</span>
          <button onClick={handleSave} className="btn-primary text-sm !py-1.5 !px-4">Save Changes</button>
        </div>
      )}

      {/* Styling & Templates */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
          Styling & Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Paper Size</label>
            <select value={data.settings?.paperSize || 'Letter'} onChange={e => updateSettings('paperSize', e.target.value)} className="input-field">
              <option value="Letter">US Letter (8.5x11")</option>
              <option value="Legal">Legal (8.5x14")</option>
              <option value="Folio">Long Bond / Folio (8.5x13")</option>
              <option value="A4">A4 (Standard)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Template</label>
            <select value={data.settings?.template || 'standard'} onChange={e => updateSettings('template', e.target.value)} className="input-field">
              <option value="standard">Standard (Classic)</option>
              <option value="executive">Executive (Centered)</option>
              <option value="modern">Modern (Clean)</option>
              <option value="minimalist">Minimalist (Sleek)</option>
              <option value="technical">Technical (Structured)</option>
              <option value="creative">Creative (Vibrant)</option>
              <option value="academic">Academic (Formal)</option>
              <option value="compact">Compact (Tight Fit)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Font Family</label>
            <select value={data.settings?.fontFamily || 'Arial, Helvetica, sans-serif'} onChange={e => updateSettings('fontFamily', e.target.value)} className="input-field">
              <option value="Arial, Helvetica, sans-serif">Arial (Sans-Serif)</option>
              <option value="'Roboto', sans-serif">Roboto (Sans-Serif)</option>
              <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
              <option value="'Open Sans', sans-serif">Open Sans (Sans-Serif)</option>
              <option value="'Oswald', sans-serif">Oswald (Sans-Serif)</option>
              <option value="'Times New Roman', Times, serif">Times New Roman (Serif)</option>
              <option value="'Georgia', serif">Georgia (Serif)</option>
              <option value="'Lora', serif">Lora (Serif)</option>
              <option value="'Merriweather', serif">Merriweather (Serif)</option>
              <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
              <option value="'Garamond', serif">Garamond (Serif)</option>
              <option value="'Calibri', sans-serif">Calibri (Sans-Serif)</option>
              <option value="'Ubuntu', sans-serif">Ubuntu (Sans-Serif)</option>
              <option value="'Verdana', sans-serif">Verdana (Sans-Serif)</option>
              <option value="'Tahoma', sans-serif">Tahoma (Sans-Serif)</option>
              <option value="'Trebuchet MS', sans-serif">Trebuchet MS (Sans-Serif)</option>
              <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
              <option value="'Courier New', monospace">Courier New (Monospace)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Font Size</label>
            <select value={data.settings?.fontSize || '11pt'} onChange={e => updateSettings('fontSize', e.target.value)} className="input-field">
              <option value="7pt">Tiny (7pt)</option>
              <option value="7.5pt">Very Tiny (7.5pt)</option>
              <option value="8pt">Micro (8pt)</option>
              <option value="8.5pt">Very Small (8.5pt)</option>
              <option value="9pt">Extra Small (9pt)</option>
              <option value="9.5pt">Small (9.5pt)</option>
              <option value="10pt">Small-Medium (10pt)</option>
              <option value="10.5pt">Medium (10.5pt)</option>
              <option value="11pt">Standard (11pt)</option>
              <option value="11.5pt">Standard-Large (11.5pt)</option>
              <option value="12pt">Large (12pt)</option>
              <option value="12.5pt">Extra Large (12.5pt)</option>
              <option value="13pt">Heading Size (13pt)</option>
              <option value="14pt">Giant (14pt)</option>
              <option value="15pt">Extra Giant (15pt)</option>
              <option value="16pt">Massive (16pt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Full Name</label>
            <input value={data.contact?.fullName || ''} onChange={e => updateContact('fullName', e.target.value)} className="input-field" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input value={data.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} className="input-field" placeholder="jane@example.com" type="email" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone</label>
            <input value={data.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} className="input-field" placeholder="(555) 123-4567" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Location</label>
            <input list="locations" value={data.contact?.location || ''} onChange={e => updateContact('location', e.target.value)} className="input-field" placeholder="San Francisco, CA" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
            <input value={data.contact?.linkedin || ''} onChange={e => updateContact('linkedin', e.target.value)} className="input-field" placeholder="linkedin.com/in/janesmith" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">GitHub</label>
            <input value={data.contact?.github || ''} onChange={e => updateContact('github', e.target.value)} className="input-field" placeholder="github.com/janesmith" />
          </div>
        </div>
      </div>

      {/* Target Role & Job Description */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Target Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Target Role</label>
            <input list="job-titles" value={data.targetRole || ''} onChange={e => update('targetRole', e.target.value)} className="input-field" placeholder="Senior Full-Stack Developer" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Experience Level</label>
            <select value={data.experienceLevel || ''} onChange={e => update('experienceLevel', e.target.value)} className="input-field">
              <option value="">Select level</option>
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid (3-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
              <option value="staff">Staff / Lead</option>
              <option value="principal">Principal / Architect</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Job Description (for AI tailoring & scoring)</label>
          <textarea value={data.jobDescription || ''} onChange={e => update('jobDescription', e.target.value)} className="textarea-field h-28" placeholder="Paste the target job description here..." />
        </div>
      </div>

      {/* Professional Summary */}
      <div className="card">
        <h2 className="section-title">Professional Summary</h2>
        <textarea value={data.summary || ''} onChange={e => update('summary', e.target.value)} className="textarea-field h-24" placeholder="2-3 sentences highlighting your expertise and value..." />
      </div>

      {/* Technical Skills */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title !mb-0">Technical Skills</h2>
          <button onClick={addSkillCategory} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Category
          </button>
        </div>
        <div className="space-y-3">
          {(data.technicalSkills || []).map((cat, idx) => (
            <div key={idx} className="flex gap-3 items-start group">
              <input list="skill-categories" value={cat.category} onChange={e => updateSkill(idx, 'category', e.target.value)} className="input-field !w-40 flex-shrink-0" placeholder="Languages" />
              <input list="tech-skills" value={cat.skills} onChange={e => updateSkill(idx, 'skills', e.target.value)} className="input-field flex-1" placeholder="JavaScript, Python, TypeScript" />
              <button onClick={() => removeSkill(idx)} className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <SectionEditor
        title="Professional Experience"
        icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        items={data.experience || []}
        onAdd={addExperience}
        onUpdate={updateExperience}
        onRemove={removeExperience}
        type="experience"
      />

      {/* Projects */}
      <SectionEditor
        title="Projects"
        icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
        items={data.projects || []}
        onAdd={addProject}
        onUpdate={updateProject}
        onRemove={removeProject}
        type="project"
      />

      {/* Education */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title !mb-0">Education</h2>
          <button onClick={addEducation} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        </div>
        {(data.education || []).map((edu, idx) => (
          <div key={idx} className="border border-gray-700/50 rounded-lg p-4 mb-3 group">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Education {idx + 1}</span>
              <button onClick={() => removeEducation(idx)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={edu.institution} onChange={e => updateEducation(idx, { institution: e.target.value })} className="input-field" placeholder="University Name" />
              <input list="degrees" value={edu.degree} onChange={e => updateEducation(idx, { degree: e.target.value })} className="input-field" placeholder="B.S." />
              <input list="fields" value={edu.field} onChange={e => updateEducation(idx, { field: e.target.value })} className="input-field" placeholder="Computer Science" />
              <input value={edu.endDate} onChange={e => updateEducation(idx, { endDate: e.target.value })} className="input-field" placeholder="May 2023" />
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} className="btn-primary px-8">Save Resume</button>
      </div>

      {/* Datalists for Autosuggest */}
      <datalist id="locations">
        <option value="Remote" />
        <option value="Hybrid" />
        <option value="San Francisco, CA" />
        <option value="New York, NY" />
        <option value="London, UK" />
      </datalist>
      <datalist id="job-titles">
        <option value="Software Engineer" />
        <option value="Frontend Developer" />
        <option value="Backend Developer" />
        <option value="Full Stack Developer" />
        <option value="Data Scientist" />
        <option value="Product Manager" />
        <option value="DevOps Engineer" />
      </datalist>
      <datalist id="skill-categories">
        <option value="Languages" />
        <option value="Frontend" />
        <option value="Backend" />
        <option value="Databases" />
        <option value="Cloud & DevOps" />
        <option value="Tools" />
      </datalist>
      <datalist id="tech-skills">
        <option value="JavaScript, TypeScript, React, HTML, CSS" />
        <option value="Node.js, Express, MongoDB, PostgreSQL" />
        <option value="Python, Django, Flask" />
        <option value="AWS, Docker, Kubernetes, CI/CD" />
      </datalist>
      <datalist id="degrees">
        <option value="Bachelor of Science" />
        <option value="Bachelor of Arts" />
        <option value="Master of Science" />
        <option value="Ph.D." />
        <option value="Associate Degree" />
        <option value="Bootcamp Certificate" />
      </datalist>
      <datalist id="fields">
        <option value="Computer Science" />
        <option value="Software Engineering" />
        <option value="Information Technology" />
        <option value="Data Science" />
        <option value="Mathematics" />
      </datalist>
      <datalist id="issuers">
        <option value="AWS" />
        <option value="Google Cloud" />
        <option value="Microsoft" />
        <option value="CompTIA" />
        <option value="Cisco" />
        <option value="Coursera" />
      </datalist>
    </div>
  );
}
