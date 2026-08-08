import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Rationale({ rationale }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!rationale) return null;

  return (
    <div className="rounded-xl bg-[#07070A] border border-[#8B5CF6]/20 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#15151B]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-xs font-mono font-semibold text-[#A78BFA] uppercase tracking-wider">
            WHY NOVA PUBLISHED THIS
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#92929D]">
          <span>{isExpanded ? 'Hide Rationale' : 'Expand Rationale'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 pt-1 text-xs text-[#F5F5F5] leading-relaxed font-sans border-t border-[#24242B]/50 bg-[#8B5CF6]/5"
          >
            {rationale}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
