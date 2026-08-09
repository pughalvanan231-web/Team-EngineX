import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

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
    <header className="sticky top-4 z-50 max-w-4xl mx-auto px-4 w-full">
      <nav className="flex items-center justify-between p-1 bg-[#171717] border border-[#0A0A0A] rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        {/* Planet Icon Logo */}
        <Link 
          to="/" 
          className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#171717] shrink-0 hover:scale-105 active:scale-95 transition-all ml-1"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="8" />
            <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(-15 12 12)" />
          </svg>
        </Link>

        {/* Center links */}
        <div className="flex items-center gap-7">
          <Link
            to="/curriculum#dashboard"
            className={`text-sm font-light transition-colors ${
              location.hash === '#dashboard' || (location.pathname === '/curriculum' && !location.hash) ? 'text-[#FFFFFF] font-medium' : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
            }`}
          >
            Candidates
          </Link>
          <Link
            to="/curriculum#syllabus"
            className={`text-sm font-light transition-colors ${
              location.hash === '#syllabus' ? 'text-[#FFFFFF] font-medium' : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
            }`}
          >
            Curriculum
          </Link>
          <Link
            to="/interview"
            className={`text-sm font-light transition-colors ${
              location.pathname.startsWith('/interview') ? 'text-[#FFFFFF] font-medium' : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
            }`}
          >
            Live Interview
          </Link>
          <Link
            to="/history"
            className={`text-sm font-light transition-colors ${
              location.pathname === '/history' ? 'text-[#FFFFFF] font-medium' : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
            }`}
          >
            Skill Analytics
          </Link>
        </div>

        {/* Right side white button & theme switcher */}
        <div className="flex items-center gap-2 pr-1">
          {activeSession && !location.pathname.startsWith('/interview') && (
            <Link
              to={`/interview/${activeSession.interview_id || activeSession.sessionId}`}
              className="bg-[#EA580C] text-[#FFFFFF] text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#D94E09] transition-all mr-1"
            >
              Resume
            </Link>
          )}

          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-full bg-[#262626] border border-[#3A3A3A] flex items-center justify-center text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#323232] transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <Link
            to="/curriculum"
            className="bg-[#FFFFFF] text-[#171717] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#F0F0EE] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            ihyaet@gmail.com
          </Link>
        </div>
      </nav>
    </header>
  );
}
