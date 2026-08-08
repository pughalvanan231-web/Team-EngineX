import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

export function InterviewCompletion({ state, onReset }) {
  const navigate = useNavigate();

  const feedback = state?.final_feedback || {};
  const candidateName = state?.candidate_name || "Candidate";
  const summaryText = feedback.interviewer_summary || 
    `The candidate demonstrated strong end-to-end technical understanding across vector search, RAG retrieval pipelines, and agentic orchestration. Key engineering decisions and trade-offs were explained with clarity.`;

  return (
    <div className="w-full py-16 max-w-2xl mx-auto space-y-8 text-center font-sans">
      
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2 text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Interview Complete
        </h1>
        <p className="text-sm text-slate-200">
          Your technical interview for <strong className="text-white">{candidateName}</strong> has been evaluated.
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#272d1f]/75 border border-white/10 backdrop-blur-md shadow-lg text-left space-y-3 text-white">
        <div className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
          Interviewer Summary
        </div>
        <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
          "{summaryText}"
        </p>
      </div>

      {/* Qualitative Assessment Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1d2d35]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-4 text-left text-white">
        <div className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider">
          Qualitative Assessment
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <div className="text-white/55 text-[11px]">TECHNICAL UNDERSTANDING</div>
            <div className="text-base font-extrabold text-emerald-400">Strong</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <div className="text-white/55 text-[11px]">COMMUNICATION</div>
            <div className="text-base font-extrabold text-emerald-400">Good</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <div className="text-white/55 text-[11px]">PROBLEM SOLVING</div>
            <div className="text-base font-extrabold text-emerald-400">Strong</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
            <div className="text-white/55 text-[11px]">SYSTEM THINKING</div>
            <div className="text-base font-extrabold text-emerald-400">Good</div>
          </div>

        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('/feedback')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>View Full Feedback Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start New Session</span>
        </button>
      </div>

    </div>
  );
}
