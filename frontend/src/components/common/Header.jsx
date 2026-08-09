import React, { useState, useEffect } from 'react';
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

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getLinkClass = (isActive) => {
    return `text-sm font-light transition-colors ${
      isActive
        ? (isDark ? 'text-[#FFFFFF] font-medium' : 'text-[#171717] font-medium')
        : (isDark ? 'text-[#A3A3A3] hover:text-[#FFFFFF]' : 'text-[#737373] hover:text-[#171717]')
    }`;
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 max-w-4xl mx-auto px-4 w-full">
      <nav className={`flex items-center justify-between p-1 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors duration-250 ${
        isDark ? 'bg-[#171717] border border-[#0A0A0A]' : 'bg-[#FFFFFF]/95 border border-[#E2E8F0]'
      }`}>
        {/* Planet Icon Logo */}
        <Link
          to="/"
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all ml-1 ${
            isDark ? 'bg-[#FFFFFF] text-[#171717]' : 'bg-[#171717] text-[#FFFFFF]'
          }`}
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
            className={getLinkClass(location.hash === '#dashboard' || (location.pathname === '/curriculum' && !location.hash))}
          >
            Candidates
          </Link>
          <Link
            to="/curriculum#syllabus"
            className={getLinkClass(location.hash === '#syllabus')}
          >
            Curriculum
          </Link>
          <Link
            to="/interview"
            className={getLinkClass(location.pathname.startsWith('/interview'))}
          >
            Live Interview
          </Link>
          <Link
            to="/history"
            className={getLinkClass(location.pathname === '/history')}
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
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-[#262626] border border-[#3A3A3A] text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#323232]' 
                : 'bg-[#F5F5F4] border border-[#E7E5E4] text-[#737373] hover:text-[#171717] hover:bg-[#E7E5E4]'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <Link
            to="/curriculum"
            className={`text-sm font-medium px-5 py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all ${
              isDark 
                ? 'bg-[#FFFFFF] text-[#171717] hover:bg-[#F0F0EE]' 
                : 'bg-[#171717] text-[#FFFFFF] hover:bg-[#262626]'
            }`}
          >
            AbTalks
          </Link>
        </div>
      </nav>
    </header>
  );
}
