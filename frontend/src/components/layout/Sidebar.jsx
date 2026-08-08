import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Activity, Brain, Database } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/feed', label: 'Feed', icon: Radio },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/memory', label: 'Memory', icon: Brain },
  { path: '/sources', label: 'Sources', icon: Database },
];

export function Sidebar({ onOpenInitModal }) {
  const { agent } = useAgent();

  return (
    <aside className="w-60 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col h-screen fixed left-0 top-0 z-30 select-none hidden md:flex">
      {/* Top Header */}
      <div className="p-5 border-b border-[#E5E7EB]">
        <h1 className="font-bold text-base text-[#111827] tracking-tight font-mono">NOVA</h1>
        <p className="text-xs text-[#6B7280]">Autonomous Creator</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F3F0FF] text-[#6D5DFB]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F8FA]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-[#E5E7EB] space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-mono font-medium text-[#16A34A]">Autonomous</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-[#111827]">{agent?.name || 'NOVA'}</h4>
            <p className="text-xs text-[#6B7280]">{agent?.domain || 'AI Technology'}</p>
          </div>
          {onOpenInitModal && (
            <button
              onClick={onOpenInitModal}
              className="text-[11px] font-mono text-[#6D5DFB] hover:underline"
            >
              Init
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
