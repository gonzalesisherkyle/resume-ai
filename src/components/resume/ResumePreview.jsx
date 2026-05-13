import { getResumeSettings, isResumeSectionVisible } from './sectionVisibility';

export default function ResumePreview({ version }) {
  const c = version.contact || {};
  const contactParts = [c.email, c.phone, c.linkedin, c.github, c.portfolio, c.location].filter(Boolean);
  
  const settings = getResumeSettings(version.settings);

  const isExecutive = settings.template === 'executive';
  const isModern = settings.template === 'modern';
  const isMinimalist = settings.template === 'minimalist';
  const isTechnical = settings.template === 'technical';
  const isCreative = settings.template === 'creative';
  const isAcademic = settings.template === 'academic';
  const isCompact = settings.template === 'compact';
  const showSummary = isResumeSectionVisible(version, 'summary');
  const showTechnicalSkills = isResumeSectionVisible(version, 'technicalSkills');
  const showExperience = isResumeSectionVisible(version, 'experience');
  const showProjects = isResumeSectionVisible(version, 'projects');
  const showEducation = isResumeSectionVisible(version, 'education');
  const showCertifications = isResumeSectionVisible(version, 'certifications');

  const getHeaderClass = () => {
    if (isExecutive) return 'text-[12pt] border-b-2 border-black text-center';
    if (isModern) return 'text-[11pt] border-b border-gray-300 text-gray-800 tracking-wider';
    if (isMinimalist) return 'text-[11pt] text-gray-900 tracking-widest';
    if (isTechnical) return 'text-[11pt] border-b border-gray-400 text-gray-800 font-mono bg-gray-100/50 px-1';
    if (isCreative) return 'text-[12pt] border-l-4 border-teal-600 pl-2 text-teal-800 tracking-wide';
    if (isAcademic) return 'text-[11pt] border-t border-b border-gray-400 text-center py-[2px] font-serif';
    if (isCompact) return 'text-[10pt] border-b border-black font-bold tracking-tight';
    return 'text-[12pt] border-b border-black';
  };

  return (
    <div 
      className={`bg-white text-black rounded-lg shadow-2xl mx-auto ${isCompact ? 'p-4 leading-[1.2]' : 'p-8 leading-[1.4]'} ${
        settings.paperSize === 'A4' ? 'max-w-[794px]' : 
        settings.paperSize === 'A5' ? 'max-w-[559px]' : 
        settings.paperSize === 'Executive' ? 'max-w-[696px]' : 
        'max-w-[816px]'
      }`}
      style={{ fontFamily: settings.fontFamily, fontSize: settings.fontSize }}
    >
      {/* Name */}
      <h1 className={`font-bold mb-1 ${isExecutive ? 'text-center text-[22pt] uppercase' : isModern ? 'text-left text-[20pt] text-gray-800' : isMinimalist ? 'text-center text-[20pt] font-light tracking-wide' : isTechnical ? 'text-left text-[18pt] font-mono border-b-2 border-gray-800 pb-1' : isCreative ? 'text-left text-[24pt] text-teal-700 tracking-tight' : isAcademic ? 'text-center text-[18pt] font-serif' : isCompact ? 'text-left text-[16pt]' : 'text-center text-[18pt]'}`}>
        {c.fullName || 'Your Name'}
      </h1>
      {contactParts.length > 0 && (
        <p className={`text-[0.9em] ${isCompact ? 'mb-2' : 'mb-4'} ${isExecutive ? 'text-center text-gray-700' : isModern ? 'text-left text-gray-500' : isMinimalist ? 'text-center text-gray-400' : isTechnical ? 'text-left text-gray-600 font-mono text-[0.8em]' : isCreative ? 'text-left text-teal-600 font-medium' : isAcademic ? 'text-center text-gray-600 font-serif' : isCompact ? 'text-left text-gray-700 text-[0.8em]' : 'text-center text-gray-600'}`}>
          {[
            c.email && <a key="email" href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>,
            c.phone && <span key="phone">{c.phone}</span>,
            c.linkedin && <a key="linkedin" href={c.linkedin.startsWith('http') ? c.linkedin : `https://${c.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{c.linkedin}</a>,
            c.github && <a key="github" href={c.github.startsWith('http') ? c.github : `https://${c.github}`} target="_blank" rel="noreferrer" className="hover:underline">{c.github}</a>,
            c.portfolio && <a key="portfolio" href={c.portfolio.startsWith('http') ? c.portfolio : `https://${c.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">{c.portfolio}</a>,
            c.location && <span key="location">{c.location}</span>
          ].filter(Boolean).reduce((prev, curr, i) => [prev, i > 0 && (isModern || isMinimalist || isCreative ? ' • ' : ' | '), curr])}
        </p>
      )}

      {/* Summary */}
      {showSummary && version.summary && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Professional Summary
          </h2>
          <p className="mb-2">{version.summary}</p>
        </>
      )}

      {/* Technical Skills */}
      {showTechnicalSkills && version.technicalSkills?.length > 0 && version.technicalSkills.some(s => s.skills) && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Technical Skills
          </h2>
          {version.technicalSkills.map((cat, i) => cat.category && cat.skills ? (
            <p key={i} className="mb-1"><strong>{cat.category}:</strong> {cat.skills}</p>
          ) : null)}
        </>
      )}

      {/* Experience */}
      {showExperience && version.experience?.length > 0 && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Professional Experience
          </h2>
          {version.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[1em]">{exp.role}</span>
                <span className="italic text-[0.9em]">{exp.startDate}{exp.startDate && ' – '}{exp.endDate || 'Present'}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-[0.95em]">{exp.company}</span>
                <span className="text-[0.9em]">{exp.location}</span>
              </div>
              {exp.bullets?.length > 0 && (
                <ul className="list-disc pl-5 mt-1 space-y-[2px]">
                  {exp.bullets.map((b, j) => b.text ? <li key={j} className="text-[0.95em]">{b.text}</li> : null)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Projects */}
      {showProjects && version.projects?.length > 0 && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Projects
          </h2>
          {version.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline font-bold text-[1em]">
                <span>{proj.name}</span>
                <div className="flex gap-2 text-[0.85em] font-normal">
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">GitHub</a>}
                  {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Live Demo</a>}
                </div>
              </div>
              {proj.technologies && <div className="italic text-[0.9em] text-gray-700 mb-1">{proj.technologies}</div>}
              {proj.bullets?.length > 0 && (
                <ul className="list-disc pl-5 mt-1 space-y-[2px]">
                  {proj.bullets.map((b, j) => b.text ? <li key={j} className="text-[0.95em]">{b.text}</li> : null)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {showEducation && version.education?.length > 0 && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Education
          </h2>
          {version.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[1em]">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                <span className="italic text-[0.9em]">{edu.endDate}</span>
              </div>
              <div className="italic text-[0.95em]">{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {showCertifications && version.certifications?.length > 0 && version.certifications.some(c => c.name) && (
        <>
          <h2 className={`font-bold uppercase pb-[2px] mt-4 mb-2 ${getHeaderClass()}`}>
            Certifications
          </h2>
          {version.certifications.map((cert, i) => cert.name ? (
            <p key={i} className="text-[0.95em] mb-1">{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}</p>
          ) : null)}
        </>
      )}
    </div>
  );
}
