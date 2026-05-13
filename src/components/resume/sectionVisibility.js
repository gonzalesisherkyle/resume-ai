export const RESUME_SECTION_OPTIONS = [
  { key: 'summary', label: 'Professional Summary' },
  { key: 'technicalSkills', label: 'Technical Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'education', label: 'Education' },
  { key: 'certifications', label: 'Certifications' },
];

export const DEFAULT_SECTION_VISIBILITY = RESUME_SECTION_OPTIONS.reduce((visibility, section) => ({
  ...visibility,
  [section.key]: true,
}), {});

export const DEFAULT_RESUME_SETTINGS = {
  template: 'standard',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '11pt',
  paperSize: 'Letter',
};

export const getSectionVisibility = (settings = {}) => ({
  ...DEFAULT_SECTION_VISIBILITY,
  ...(settings.sectionVisibility || {}),
});

export const getResumeSettings = (settings = {}) => ({
  template: settings.template || DEFAULT_RESUME_SETTINGS.template,
  fontFamily: settings.fontFamily || DEFAULT_RESUME_SETTINGS.fontFamily,
  fontSize: settings.fontSize || DEFAULT_RESUME_SETTINGS.fontSize,
  paperSize: settings.paperSize || DEFAULT_RESUME_SETTINGS.paperSize,
  sectionVisibility: getSectionVisibility(settings),
});

export const isResumeSectionVisible = (version, sectionKey) => (
  getSectionVisibility(version?.settings)[sectionKey] !== false
);
