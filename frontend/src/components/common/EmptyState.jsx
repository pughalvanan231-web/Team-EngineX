import React from 'react';
import { Eye, Cpu, RefreshCw } from 'lucide-react';
import { Badge } from './Badge';

export function EmptyState({ title = "No posts yet.", description = "NOVA is currently observing the ecosystem. The first publication will appear when the editorial engine finds something worth publishing.", onRefresh }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#101014]/60 border border-[#24242B] backdrop-blur-md relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-16 h-16 rounded-2xl bg-[#15151B] border border-[#24242B] flex items-center justify-center mb-6 text-[#A78BFA] shadow-[0_0_20px_rgba(139,92,246,0.15)] relative">
        <Cpu className="w-8 h-8 animate-pulse" />
        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E]" />
        </span>
      </div>

      <Badge variant="purple" pulse className="mb-4">
        OBSERVING ECOSYSTEM
      </Badge>

      <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-[#92929D] max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24242B]/80 hover:bg-[#24242B] text-xs font-mono text-[#F5F5F5] transition-all border border-[#353540]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Check Agent Status
        </button>
      )}
    </div>
  );
}
