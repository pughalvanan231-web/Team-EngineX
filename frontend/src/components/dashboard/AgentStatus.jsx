import React from 'react';
import { useAgent } from '../../context/AgentContext';

export function AgentStatus() {
  const { stats } = useAgent();

  return (
    <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#111827]">Autonomous Engine</h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F0FDF4] border border-[#16A34A]/20">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-mono font-medium text-[#16A34A]">Running</span>
        </div>
      </div>

      <p className="text-sm text-[#6B7280]">
        NOVA is currently operating independently.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E5E7EB]">
        <div>
          <span className="text-xs text-[#6B7280] block">Last activity</span>
          <span className="text-sm font-semibold text-[#111827] font-mono">{stats?.lastCycle || '2 minutes ago'}</span>
        </div>
        <div>
          <span className="text-xs text-[#6B7280] block">Next cycle</span>
          <span className="text-sm font-semibold text-[#6D5DFB] font-mono">{stats?.nextCycle || '1 hour 58 minutes'}</span>
        </div>
      </div>
    </div>
  );
}
