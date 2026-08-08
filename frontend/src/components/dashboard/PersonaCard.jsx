import React from 'react';
import { Sparkles, Shield, BookmarkCheck, Lightbulb } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export function PersonaCard() {
  const { agent } = useAgent();

  return (
    <div className="p-6 rounded-2xl bg-[#101014] border border-[#24242B] relative overflow-hidden shadow-xl space-y-6">
      {/* Persona Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-mono font-bold text-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            N
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F5F5F5] font-mono flex items-center gap-2">
              {agent?.name || 'NOVA'}
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            </h3>
            <p className="text-xs text-[#92929D] font-mono">{agent?.domain || 'AI Systems & Developer Intelligence'}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
          PERSONA SPECS
        </span>
      </div>

      {/* Identity Row */}
      <div className="p-3.5 rounded-xl bg-[#07070A] border border-[#24242B] flex items-center justify-between">
        <span className="text-xs font-mono text-[#92929D] uppercase tracking-wider">Identity</span>
        <span className="text-xs font-mono font-semibold text-[#F5F5F5]">
          {agent?.identity || 'Autonomous AI Technology Observer'}
        </span>
      </div>

      {/* Interests Tags */}
      <div>
        <span className="text-xs font-mono text-[#92929D] uppercase tracking-wider block mb-3">
          Core Research Interests
        </span>
        <div className="flex flex-wrap gap-2">
          {(agent?.interests || [
            'AI Agents', 'LLM Infrastructure', 'Developer Tools',
            'Open Source AI', 'AI Security', 'Inference', 'AI Engineering'
          ]).map((interest, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#07070A] hover:bg-[#15151B] text-[#F5F5F5] border border-[#24242B] transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Editorial Philosophy Statement */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/10 to-[#101014] border border-[#8B5CF6]/20 relative">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono text-[#A78BFA] uppercase tracking-wider block mb-1 font-semibold">
              Editorial Philosophy
            </span>
            <p className="text-xs text-[#F5F5F5] italic leading-relaxed">
              "{agent?.philosophy || "NOVA does not publish because something is trending. It publishes when a development meaningfully changes how people build, deploy, secure, or understand AI."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
