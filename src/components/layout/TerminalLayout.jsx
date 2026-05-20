import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TerminalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'dashboard.sh', path: '/dashboard' },
    { name: 'editor.md', path: '/editor' },
    { name: 'analyzer.py', path: '/analyzer' },
  ];

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] flex flex-col font-mono text-[var(--terminal-text)] relative overflow-hidden">
      <div className="scanline"></div>
      
      {/* Terminal Window Header */}
      <header className="terminal-header select-none flex-wrap h-auto py-1 md:py-2">
        <div className="flex gap-2 mr-4">
          <div className="terminal-dot bg-[#ff5f56]"></div>
          <div className="terminal-dot bg-[#ffbd2e]"></div>
          <div className="terminal-dot bg-[#27c93f]"></div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 text-[10px] md:text-xs text-[var(--terminal-muted)]">
          <span className="opacity-50 truncate max-w-[100px] md:max-w-none">~/projects/resume-forge</span>
          <span className="text-[var(--terminal-accent)] whitespace-nowrap">git:(main)</span>
        </div>

        <div className="flex-1 min-w-[10px]"></div>

        <div className="flex text-[10px] md:text-xs">
          <Link
            to="/dashboard"
            className={`px-3 md:px-4 py-1 border-r border-[var(--terminal-border)] transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-[var(--terminal-surface)] text-[var(--terminal-accent)] border-t-2 border-t-[var(--terminal-accent)]' 
                : 'hover:bg-[var(--terminal-surface)]'
            }`}
          >
            <span className="md:hidden">DB</span>
            <span className="hidden md:inline">dashboard.sh</span>
          </Link>
          <Link
            to="/job-analyzer"
            className={`px-3 md:px-4 py-1 border-r border-[var(--terminal-border)] transition-colors ${
              location.pathname === '/job-analyzer' 
                ? 'bg-[var(--terminal-surface)] text-[var(--terminal-accent)] border-t-2 border-t-[var(--terminal-accent)]' 
                : 'hover:bg-[var(--terminal-surface)]'
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
            className="px-3 md:px-4 py-1 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-colors uppercase border-l border-[var(--terminal-border)]"
          >
            <span className="md:hidden">EXIT</span>
            <span className="hidden md:inline">exit --force</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[var(--terminal-bg)] p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-6 bg-[var(--terminal-accent)] text-[var(--terminal-bg)] flex items-center px-4 text-[9px] md:text-[10px] font-bold uppercase select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="opacity-70 hidden sm:inline">STATUS:</span> READY
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="opacity-70">BRANCH:</span> MAIN
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">UTF-8</div>
          <div className="hidden md:block">LN 1, COL 1</div>
          <div className="bg-[var(--terminal-bg)] text-[var(--terminal-accent)] px-2">REACT_JSX</div>
        </div>
      </footer>
    </div>
  );
};

export default TerminalLayout;
