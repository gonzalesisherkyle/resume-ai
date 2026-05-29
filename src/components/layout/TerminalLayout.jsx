import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TerminalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isEditor = location.pathname.startsWith('/resume/');
  const resumeId = isEditor ? location.pathname.split('/').pop() : null;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-[var(--terminal-bg)] flex flex-col font-mono text-[var(--terminal-text)] relative overflow-hidden">
      <div className="scanline"></div>
      
      {/* Terminal Window Header */}
      <header className="terminal-header select-none flex-wrap h-auto py-1 md:py-2">
        <div className="flex gap-2 mr-4">
          <div className="terminal-dot bg-[#ff5f56] hover:scale-110"></div>
          <div className="terminal-dot bg-[#ffbd2e] hover:scale-110"></div>
          <div className="terminal-dot bg-[#27c93f] hover:scale-110"></div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 text-[10px] md:text-xs text-[var(--terminal-muted)]">
          <span className="opacity-50 truncate max-w-[100px] md:max-w-none">~/projects/resume-forge</span>
          <span className="text-[var(--terminal-accent)] whitespace-nowrap font-bold">git:(main)</span>
        </div>

        <div className="flex-1 min-w-[10px]"></div>

        <div className="flex text-[10px] md:text-xs">
          <Link
            to="/dashboard"
            className={`px-3 md:px-4 py-1 border-r border-[var(--terminal-border)] transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-[var(--terminal-surface)] text-[var(--terminal-accent)] border-t border-t-[var(--terminal-accent)] font-semibold' 
                : 'hover:bg-[var(--terminal-surface)]/50'
            }`}
          >
            <span className="md:hidden">DB</span>
            <span className="hidden md:inline">dashboard.sh</span>
          </Link>
          
          {isEditor && (
            <Link
              to={`/resume/${resumeId}`}
              className={`px-3 md:px-4 py-1 border-r border-[var(--terminal-border)] transition-colors ${
                location.pathname.startsWith('/resume/') 
                  ? 'bg-[var(--terminal-surface)] text-[var(--terminal-accent)] border-t border-t-[var(--terminal-accent)] font-semibold' 
                  : 'hover:bg-[var(--terminal-surface)]/50'
              }`}
            >
              <span className="md:hidden">ED</span>
              <span className="hidden md:inline">editor.md</span>
            </Link>
          )}

          <Link
            to="/job-analyzer"
            className={`px-3 md:px-4 py-1 border-r border-[var(--terminal-border)] transition-colors ${
              location.pathname === '/job-analyzer' 
                ? 'bg-[var(--terminal-surface)] text-[var(--terminal-accent)] border-t border-t-[var(--terminal-accent)] font-semibold' 
                : 'hover:bg-[var(--terminal-surface)]/50'
            }`}
          >
            <span className="md:hidden">AZ</span>
            <span className="hidden md:inline">analyzer.py</span>
          </Link>
          
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3 md:px-4 py-1 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-colors uppercase border-l border-[var(--terminal-border)] font-bold text-[9px] md:text-xs"
          >
            <span className="md:hidden">EXIT</span>
            <span className="hidden md:inline">exit --force</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer Style */}
        <aside className="w-60 border-r border-[var(--terminal-border)] bg-black/20 hidden lg:flex flex-col select-none flex-shrink-0 animate-fade-in">
          <div className="px-4 py-2.5 text-[var(--terminal-muted)] text-[10px] uppercase tracking-widest border-b border-[var(--terminal-border)] font-bold font-mono">
            Workspace_Files
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
            {isEditor ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-[var(--terminal-accent)] font-bold tracking-wider text-[10px] uppercase">
                  <span className="opacity-70 text-[8px]">▼</span> active_resume
                </div>
                <div className="pl-3.5 space-y-1 text-slate-400">
                  <button onClick={() => scrollToSection('render-config')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-[var(--terminal-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    render_config.ini
                  </button>
                  <button onClick={() => scrollToSection('identity-block')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-[var(--terminal-amber)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    personal_info.json
                  </button>
                  <button onClick={() => scrollToSection('targeting-metrics')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    target_role.env
                  </button>
                  <button onClick={() => scrollToSection('summary-log')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    summary.log
                  </button>
                  <button onClick={() => scrollToSection('core-competencies')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-[var(--terminal-green)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    skills.config
                  </button>
                  <button onClick={() => scrollToSection('experience-chronology')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    experience.yaml
                  </button>
                  <button onClick={() => scrollToSection('project-portfolio')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    projects.yaml
                  </button>
                  <button onClick={() => scrollToSection('academic-records')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                    education.toml
                  </button>
                  <button onClick={() => scrollToSection('certification-registry')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    certifications.json
                  </button>
                  <button onClick={() => scrollToSection('character-references')} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    references.toml
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-[var(--terminal-accent)] font-bold tracking-wider text-[10px] uppercase">
                  <span className="opacity-70 text-[8px]">▼</span> global_scope
                </div>
                <div className="pl-3.5 space-y-1 text-slate-400">
                  <button onClick={() => navigate('/dashboard')} className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-none transition-all ${location.pathname === '/dashboard' ? 'bg-brand-500/10 text-brand-400 font-semibold' : 'hover:bg-white/5 hover:text-white'}`}>
                    <svg className="w-3.5 h-3.5 text-[var(--terminal-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    dashboard.sh
                  </button>
                  <button onClick={() => navigate('/job-analyzer')} className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-none transition-all ${location.pathname === '/job-analyzer' ? 'bg-brand-500/10 text-brand-400 font-semibold' : 'hover:bg-white/5 hover:text-white'}`}>
                    <svg className="w-3.5 h-3.5 text-[var(--terminal-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    analyzer.py
                  </button>
                  <button onClick={() => {
                    const el = document.querySelector('.mt-12');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-white/5 hover:text-white rounded-none transition-all">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    system_logs.log
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[var(--terminal-bg)] p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-6 bg-[var(--terminal-accent)] text-slate-950 flex items-center px-4 text-[9px] md:text-[10px] font-bold uppercase select-none relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="opacity-75 hidden sm:inline">STATUS:</span> ONLINE
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="opacity-75">BRANCH:</span> MAIN
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">UTF-8</div>
          <div className="hidden md:block">LN 1, COL 1</div>
          <div className="bg-slate-950 text-[var(--terminal-accent)] px-2 py-0.5 rounded-none text-[8px]">REACT_JSX</div>
        </div>
      </footer>
    </div>
  );
};

export default TerminalLayout;
