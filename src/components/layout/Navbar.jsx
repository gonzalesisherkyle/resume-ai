import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/job-analyzer', label: 'Job Analyzer' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-surface-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-lg font-bold text-white">
              Resume<span className="text-brand-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-brand-600/20 text-brand-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-700/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-gray-400">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-600/10 transition-all"
                >
                  Logout
                </button>
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden pb-4 border-t border-gray-700/50 mt-2 pt-2 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'bg-brand-600/20 text-brand-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
