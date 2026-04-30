import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] flex items-center justify-center px-4 font-mono">
      <div className="scanline"></div>
      
      <div className="w-full max-w-md terminal-window animate-fade-in relative z-10">
        <header className="terminal-header">
          <div className="flex gap-2 mr-4">
            <div className="terminal-dot bg-[#ff5f56]"></div>
            <div className="terminal-dot bg-[#ffbd2e]"></div>
            <div className="terminal-dot bg-[#27c93f]"></div>
          </div>
          <span className="text-xs text-[var(--terminal-muted)]">auth_service --login</span>
        </header>

        <div className="p-8">
          <div className="mb-8 font-mono">
            <div className="text-[var(--terminal-accent)] mb-2">$ sudo access --account</div>
            <div className="text-[var(--terminal-text)] opacity-70 text-sm">Please identify yourself to the system.</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="terminal-label">User_Identity (Email)</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-terminal"
                placeholder="root@system.local"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="terminal-label">Access_Token (Password)</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-terminal"
                placeholder="****************"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-terminal btn-terminal-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-[var(--terminal-bg)]/30 border-t-[var(--terminal-bg)] rounded-full animate-spin" />}
              {loading ? 'AUTHENTICATING...' : 'EXECUTE LOGIN'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--terminal-border)] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--terminal-muted)]">
              <span>$ new-user --create</span>
              <Link to="/register" className="text-[var(--terminal-amber)] hover:underline">register.sh</Link>
            </div>
            <div className="text-[10px] text-[var(--terminal-muted)] opacity-50 uppercase tracking-[0.2em]">
              Encrypted Session Layer 2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

