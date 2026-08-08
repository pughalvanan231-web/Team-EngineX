import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Activity, Database, Brain, Sparkles, Orbit } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/feed', label: 'Live Feed', icon: Radio },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/sources', label: 'Sources', icon: Database },
  { path: '/memory', label: 'Memory', icon: Brain },
];

export function Sidebar({ onOpenInitModal }) {
  const { agent } = useAgent();

  return (
    <aside className="w-64 bg-[#07070A] border-r border-[#24242B] flex flex-col h-screen fixed left-0 top-0 z-30 select-none hidden md:flex">
      {/* Top Header & Logo */}
      <div className="p-6 border-b border-[#24242B]/60">
        <div className="flex items-center gap-3">
          {/* Abstract Minimal AI Orbit Logo */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#101014] border border-[#8B5CF6]/40 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Orbit className="w-6 h-6 text-[#A78BFA] animate-spin-slow" />
            <div className="absolute inset-0 rounded-xl bg-[#8B5CF6]/10 animate-pulse pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-base text-[#F5F5F5] font-mono">NOVA</span>
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            </div>
            <p className="text-[11px] text-[#92929D] font-mono tracking-tight">Autonomous AI Creator</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-mono font-semibold text-[#92929D] uppercase tracking-wider">
          Control & Monitor
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'text-[#92929D] hover:text-[#F5F5F5] hover:bg-[#101014]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#A78BFA]' : 'text-[#92929D]'}`} />
                  <span>{item.label}</span>
                  {item.path === '/feed' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Agent Persona Status Card */}
      <div className="p-4 m-3 rounded-xl bg-[#101014] border border-[#24242B] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-[#92929D] tracking-wider font-semibold">
            Agent Profile
          </span>
          {onOpenInitModal && (
            <button
              onClick={onOpenInitModal}
              className="text-[10px] font-mono text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
            >
              Re-init
            </button>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#F5F5F5] font-mono">{agent?.name || 'NOVA'}</h4>
          <p className="text-[11px] text-[#92929D] line-clamp-1">{agent?.domain || 'AI Systems & Developer Intelligence'}</p>
        </div>

        <div className="pt-2 border-t border-[#24242B]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="text-xs font-mono text-[#22C55E] font-medium">Autonomous</span>
          </div>
          <span className="text-[10px] font-mono text-[#92929D]">v2.4 Live</span>
        </div>
      </div>
    </aside>
  );
}
