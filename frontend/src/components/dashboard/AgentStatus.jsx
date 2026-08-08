import React from 'react';
import { Cpu, Activity, Clock, Zap, Radar } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAgent } from '../../context/AgentContext';

export function AgentStatus() {
  const { stats } = useAgent();

  return (
    <div className="p-6 rounded-2xl bg-[#101014] border border-[#24242B] relative overflow-hidden shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#24242B]/80">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#A78BFA]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F5F5F5] tracking-tight">Autonomous Engine</h3>
              <p className="text-xs text-[#92929D] font-mono">Continuous intelligence observer</p>
            </div>
          </div>
        </div>

        {/* Animated pulse badge */}
        <div className="flex items-center gap-2">
          <Badge variant="green" pulse size="lg" className="shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            ● RUNNING
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#92929D] my-4 leading-relaxed max-w-2xl font-sans">
        Agent is independently discovering and evaluating AI technology developments across GitHub, ArXiv, Hugging Face, and industry releases.
      </p>

      {/* Cycle Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-[#07070A] border border-[#24242B] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#A78BFA]">
            <Radar className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#92929D] block">Current Cycle</span>
            <span className="text-xs font-semibold font-mono text-[#F5F5F5]">{stats?.currentPhase || 'Topic Discovery'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07070A] border border-[#24242B] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#22C55E]/10 text-[#22C55E]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#92929D] block">Last Activity</span>
            <span className="text-xs font-semibold font-mono text-[#F5F5F5]">{stats?.lastCycle || '2 minutes ago'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07070A] border border-[#24242B] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#92929D] block">Next Cycle</span>
            <span className="text-xs font-semibold font-mono text-[#A78BFA]">{stats?.nextCycle || '1h 58m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
