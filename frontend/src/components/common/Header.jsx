import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, Activity, FileText, CheckCircle2 } from 'lucide-react';

export function Header({ activeSession, healthStatus, onResetSession }) {
  const location = useLocation();

  return (
    <header className="w-full border-b border-agent-border bg-agent-bg/85 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <div className="w-7 h-7 rounded-md bg-agent-surface border border-agent-border flex items-center justify-center text-agent-accent group-hover:border-agent-accent/50 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-sm text-agent-text tracking-tight">
            Interview<span className="text-agent-accent">Agent</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              location.pathname === '/' 
                ? 'bg-agent-elevated text-agent-text border border-agent-border' 
                : 'text-agent-secondary hover:text-agent-text hover:bg-agent-surface'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/prep"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              location.pathname === '/prep' 
                ? 'bg-agent-elevated text-agent-text border border-agent-border' 
                : 'text-agent-secondary hover:text-agent-text hover:bg-agent-surface'
            }`}
          >
            Preparation
          </Link>
          <Link
            to="/interview"
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              location.pathname === '/interview' 
                ? 'bg-agent-accent/10 text-agent-accentLight border border-agent-accent/30 font-medium' 
                : 'text-agent-secondary hover:text-agent-text hover:bg-agent-surface'
            }`}
          >
            {activeSession && <span className="w-1.5 h-1.5 rounded-full bg-agent-accent animate-pulse" />}
            Live Interview
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              location.pathname === '/history' 
                ? 'bg-agent-elevated text-agent-text border border-agent-border' 
                : 'text-agent-secondary hover:text-agent-text hover:bg-agent-surface'
            }`}
          >
            History
          </Link>
        </nav>

        {/* System & Session Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {activeSession && location.pathname !== '/interview' && (
            <Link
              to="/interview"
              className="px-2.5 py-1 rounded bg-agent-accent/15 border border-agent-accent/30 text-agent-accentLight hover:bg-agent-accent/25 transition-colors flex items-center gap-1.5 text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-agent-accent animate-ping" />
              Resume Session
            </Link>
          )}

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-agent-surface border border-agent-border text-agent-secondary text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-agent-text font-medium">Engine v1.0</span>
          </div>
        </div>

      </div>
    </header>
  );
}
