import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
          <span className="text-xs text-[var(--terminal-muted)]">auth_service --register</span>
        </header>

        <div className="p-8">
          <div className="mb-8 font-mono">
            <div className="text-[var(--terminal-accent)] mb-2">$ user-add --interactive</div>
            <div className="text-[var(--terminal-text)] opacity-70 text-sm">Create a new system account.</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reg-name" className="terminal-label">Full_Name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-terminal"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="terminal-label">User_Identity (Email)</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-terminal"
                placeholder="jane@system.local"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="terminal-label">New_Access_Token (Password)</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-terminal"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-terminal btn-terminal-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-[var(--terminal-bg)]/30 border-t-[var(--terminal-bg)] rounded-full animate-spin" />}
              {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--terminal-border)] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--terminal-muted)]">
              <span>$ system --login</span>
              <Link to="/login" className="text-[var(--terminal-amber)] hover:underline">login.sh</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

