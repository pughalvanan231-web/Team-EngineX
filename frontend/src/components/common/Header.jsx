import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Search, Menu, ChevronDown, Cpu, Sparkles } from 'lucide-react';

export function Header({ activeSession, healthStatus, onResetSession }) {
  const location = useLocation();

  return (
    <header className="w-full bg-[#949C92]/90 backdrop-blur-2xl sticky top-0 z-50 py-3.5 px-4 sm:px-8 text-white border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group transition-transform hover:scale-105"
        >
          <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xl flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-white drop-shadow-sm">
            Engine.AI
          </span>
        </Link>

        {/* Center Nav Items with Ultra-Glassy Capsule Container */}
        <nav className="hidden lg:flex items-center gap-3 text-xs font-semibold px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-2xl shadow-inner text-white/90">
          <Link
            to="/candidates"
            className={`px-3 py-1 rounded-full transition-all ${
              location.pathname.startsWith('/candidates') 
                ? 'bg-white text-slate-900 font-bold shadow-md' 
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Candidates
          </Link>
          <span className="text-white/30 text-[8px]">•</span>

          <Link
            to="/overview"
            className={`px-3 py-1 rounded-full transition-all ${
              location.pathname === '/overview' 
                ? 'bg-white text-slate-900 font-bold shadow-md' 
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Curriculum
          </Link>
          <span className="text-white/30 text-[8px]">•</span>

          <Link
            to="/interview"
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/interview') 
                ? 'bg-white text-slate-900 font-bold shadow-md' 
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            {activeSession && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            Live Interview
          </Link>
          <span className="text-white/30 text-[8px]">•</span>

          <Link
            to="/history"
            className={`px-3 py-1 rounded-full transition-all ${
              location.pathname === '/history' 
                ? 'bg-white text-slate-900 font-bold shadow-md' 
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Skill Analytics
          </Link>
        </nav>

        {/* Right Glassy Action Buttons */}
        <div className="flex items-center gap-3 text-xs font-medium">
          {activeSession && !location.pathname.startsWith('/interview') && (
            <Link
              to={`/interview/${activeSession.interview_id || activeSession.sessionId}`}
              className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current text-slate-900" />
              <span>Resume Session</span>
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-xl cursor-pointer hover:bg-white/25 transition-all text-white/90 shadow-sm">
            <span>EN</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>

          <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all text-white/90 shadow-sm">
            <Search className="w-4 h-4" />
          </div>

          <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all text-white/90 shadow-sm">
            <Menu className="w-4 h-4" />
          </div>
        </div>

      </div>
    </header>
  );
}
