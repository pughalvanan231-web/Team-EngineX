import React from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, RefreshCw } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAgent } from '../../context/AgentContext';

const PAGE_META = {
  '/': { title: 'Overview', subtitle: 'Autonomous intelligence dashboard' },
  '/feed': { title: 'Live Feed', subtitle: 'Real-time editorial publications' },
  '/activity': { title: 'Autonomous Activity', subtitle: 'Chronological research execution log' },
  '/sources': { title: 'Intelligence Sources', subtitle: 'Monitored repositories, papers & blogs' },
  '/memory': { title: 'Agent Memory', subtitle: 'Continuity index & editorial decision archive' },
};

export function Header() {
  const location = useLocation();
  const { stats, refreshData, loading } = useAgent();

  const currentMeta = PAGE_META[location.pathname] || {
    title: 'Dashboard',
    subtitle: 'Autonomous intelligence monitor'
  };

  return (
    <header className="h-16 border-b border-[#24242B] bg-[#07070A]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Page Title & Subtitle */}
      <div>
        <h1 className="text-base font-semibold text-[#F5F5F5] tracking-tight flex items-center gap-2">
          {currentMeta.title}
        </h1>
        <p className="text-xs text-[#92929D] font-mono hidden sm:block">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Right: Cycle Times & Autonomous Badge */}
      <div className="flex items-center gap-4">
        {/* Cycle Telemetry */}
        <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 rounded-lg bg-[#101014] border border-[#24242B] text-xs font-mono text-[#92929D]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Last cycle: <span className="text-[#F5F5F5]">{stats?.lastCycle || '2m ago'}</span></span>
          </div>
          <span className="text-[#24242B]">|</span>
          <div>
            <span>Next cycle: <span className="text-[#A78BFA] font-medium">{stats?.nextCycle || 'in 1h 58m'}</span></span>
          </div>
        </div>

        {/* Manual Silent Refresh Button */}
        <button
          onClick={refreshData}
          disabled={loading}
          title="Refresh telemetry"
          className="p-2 rounded-lg bg-[#101014] hover:bg-[#24242B] border border-[#24242B] text-[#92929D] hover:text-[#F5F5F5] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#8B5CF6]' : ''}`} />
        </button>

        {/* Persistent Status Indicator */}
        <Badge variant="purple" pulse size="md">
          ● AUTONOMOUS
        </Badge>
      </div>
    </header>
  );
}
