import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ChevronDown, ChevronUp, AlertCircle, BarChart3 } from 'lucide-react';
import { Badge } from '../common/Badge';

export function DecisionCard({ item }) {
  const [showCriteria, setShowCriteria] = useState(true);

  const criteriaList = [
    { label: 'Technical Significance', score: item.criteria?.technicalSignificance || 3 },
    { label: 'Recency', score: item.criteria?.recency || 8 },
    { label: 'Source Quality', score: item.criteria?.sourceQuality || 7 },
    { label: 'Novelty', score: item.criteria?.novelty || 4 },
    { label: 'Persona Relevance', score: item.criteria?.personaRelevance || 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-[#101014] border border-[#EF4444]/20 hover:border-[#EF4444]/40 transition-all space-y-4 shadow-xl relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="error" size="sm">
                REJECTED
              </Badge>
              <span className="text-xs font-mono text-[#92929D]">{item.date}</span>
            </div>
            <h4 className="text-base font-semibold text-[#F5F5F5] font-mono mt-1">
              "{item.topic}"
            </h4>
          </div>
        </div>

        <div className="shrink-0 text-right bg-[#07070A] p-2.5 rounded-xl border border-[#24242B]">
          <span className="text-[10px] font-mono uppercase text-[#92929D] block">Score</span>
          <span className="text-sm font-bold font-mono text-[#EF4444]">{item.score} / 10</span>
        </div>
      </div>

      {/* Why Rejected Section */}
      <div className="p-4 rounded-xl bg-[#07070A] border border-[#24242B] space-y-1">
        <span className="text-xs font-mono text-[#EF4444] uppercase tracking-wider font-semibold block">
          WHY REJECTED
        </span>
        <p className="text-xs text-[#92929D] leading-relaxed font-sans">
          {item.reason}
        </p>
      </div>

      {/* Criteria Breakdown */}
      <div className="pt-2 border-t border-[#24242B]/60">
        <button
          onClick={() => setShowCriteria(!showCriteria)}
          className="flex items-center justify-between w-full text-xs font-mono text-[#92929D] hover:text-[#F5F5F5] transition-colors py-1"
        >
          <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Editorial Criteria Scores
          </span>
          {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCriteria && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
            {criteriaList.map((crit, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#07070A] border border-[#24242B] flex items-center justify-between">
                <span className="text-xs font-mono text-[#92929D]">{crit.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-[#24242B] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${crit.score >= 6 ? 'bg-[#22C55E]' : crit.score >= 4 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                      style={{ width: `${(crit.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#F5F5F5]">{crit.score}/10</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
