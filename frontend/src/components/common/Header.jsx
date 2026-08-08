import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Sparkles, Activity, ShieldCheck, Play } from 'lucide-react';

export function Header({ activeSession, healthStatus, onResetSession }) {
  const location = useLocation();

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-base text-slate-900 tracking-tight">
            Interview<span className="text-indigo-600 font-extrabold">Agent</span>
          </span>
        </Link>

        {/* Navigation links - Pill Style */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-medium">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/' 
                ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/prep"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/prep' 
                ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preparation
          </Link>
          <Link
            to="/interview"
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              location.pathname === '/interview' 
                ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeSession && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            Live Interview
          </Link>
          <Link
            to="/history"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/history' 
                ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            History
          </Link>
        </nav>

        {/* Status Indicators & Session */}
        <div className="flex items-center gap-3 text-xs">
          {activeSession && location.pathname !== '/interview' && (
            <Link
              to="/interview"
              className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-100 transition-all flex items-center gap-1.5 text-xs shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Resume Session</span>
            </Link>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Engine Online</span>
          </div>
        </div>

      </div>
    </header>
  );
}
