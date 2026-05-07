import React from 'react';

export default function Modal({ isOpen, title, children, onClose, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md terminal-window animate-slide-up shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[var(--terminal-accent)]/30">
        <header className="terminal-header flex justify-between items-center bg-[var(--terminal-header)]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] uppercase font-bold text-[var(--terminal-accent)] ml-2 tracking-widest">
              {title || 'SYSTEM_DIALOG'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--terminal-muted)] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 font-mono">
          <div className="text-sm text-[var(--terminal-text)] leading-relaxed">
            {children}
          </div>
          
          {footer && (
            <div className="mt-8 flex justify-end gap-3 border-t border-[var(--terminal-border)] pt-4">
              {footer}
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-16px] right-[-16px] w-8 h-8 bg-[var(--terminal-accent)] rotate-45 opacity-10" />
        </div>
      </div>
    </div>
  );
}
