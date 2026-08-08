import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Search, Menu, ChevronDown, Cpu, Sparkles, Sun, Moon } from 'lucide-react';

export function Header({ activeSession, healthStatus, onResetSession }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark') || 
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="w-full bg-[var(--card-bg)] border-b border-[var(--border-color)] sticky top-0 z-50 py-3.5 px-4 sm:px-8 text-[var(--text-headings)] transition-colors duration-250">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group transition-transform hover:opacity-95"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[#5E6C55]">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-sans text-sm font-bold tracking-wider text-[var(--text-headings)] block">
              ENGINE.AI
            </span>
            <span className="text-[10px] text-[#5E6C55] uppercase tracking-widest block font-mono">
              Adaptive Technical Interview
            </span>
          </div>
        </Link>

        {/* Center Nav Items with clean enterprise borders */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--border-color)]">
          <Link
            to="/candidates"
            className={`px-3 py-1 rounded transition-all ${
              location.pathname.startsWith('/candidates') 
                ? 'bg-[var(--border-color)] text-[var(--text-headings)] font-bold' 
                : 'text-[var(--text-headings)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            Candidates
          </Link>

          <Link
            to="/overview"
            className={`px-3 py-1 rounded transition-all ${
              location.pathname === '/overview' 
                ? 'bg-[var(--border-color)] text-[var(--text-headings)] font-bold' 
                : 'text-[var(--text-headings)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            Curriculum
          </Link>

          <Link
            to="/interview"
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/interview') 
                ? 'bg-[var(--border-color)] text-[var(--text-headings)] font-bold' 
                : 'text-[var(--text-headings)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            {activeSession && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />}
            Live Interview
          </Link>

          <Link
            to="/history"
            className={`px-3 py-1 rounded transition-all ${
              location.pathname === '/history' 
                ? 'bg-[var(--border-color)] text-[var(--text-headings)] font-bold' 
                : 'text-[var(--text-headings)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            Skill Analytics
          </Link>
        </nav>

        {/* Right Status Dot, Theme Switcher & Resume Indicator */}
        <div className="flex items-center gap-3 text-xs font-medium">
          {activeSession && !location.pathname.startsWith('/interview') && (
            <Link
              to={`/interview/${activeSession.interview_id || activeSession.sessionId}`}
              className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] text-white font-bold hover:bg-[#D94E09] transition-all flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current text-white" />
              <span>Resume Session</span>
            </Link>
          )}

          {/* Theme Toggler Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-lg bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-headings)] hover:bg-[var(--hover-bg)] transition-all"
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--border-color)] text-[11px] font-mono text-[#059669] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            SYSTEM READY
          </div>
        </div>

      </div>
    </header>
  );
}
