import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Rationale({ rationale }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!rationale) return null;

  return (
    <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left text-xs font-mono text-[#6B7280] hover:text-[#111827] uppercase tracking-wider font-semibold"
      >
        <span>Why NOVA published this</span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isExpanded && (
        <p className="text-xs text-[#6B7280] leading-relaxed font-sans pt-1">
          {rationale}
        </p>
      )}
    </div>
  );
}
