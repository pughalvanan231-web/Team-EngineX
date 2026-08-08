import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Award, FileText, RefreshCw } from 'lucide-react';

export function InterviewCompletion({ state, onReset }) {
  const navigate = useNavigate();

  const feedback = state?.final_feedback || {};
  const candidateName = state?.candidate_name || "Candidate";
  const summaryText = feedback.interviewer_summary || 
    `The candidate demonstrated strong end-to-end technical understanding across vector search, RAG retrieval pipelines, and agentic orchestration. Key engineering decisions and trade-offs were explained with clarity.`;

  return (
    <div className="w-full py-16 max-w-2xl mx-auto space-y-8 text-center font-sans">
      
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Interview Complete
        </h1>
        <p className="text-sm text-slate-600">
          Your technical interview for <strong className="text-slate-900">{candidateName}</strong> has been evaluated.
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card text-left space-y-3">
        <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
          Interviewer Summary
        </div>
        <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-normal">
          "{summaryText}"
        </p>
      </div>

      {/* Qualitative Assessment Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4 text-left">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Qualitative Assessment
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="text-slate-500 text-[11px]">TECHNICAL UNDERSTANDING</div>
            <div className="text-base font-extrabold text-emerald-700">Strong</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="text-slate-500 text-[11px]">COMMUNICATION</div>
            <div className="text-base font-extrabold text-emerald-700">Good</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="text-slate-500 text-[11px]">PROBLEM SOLVING</div>
            <div className="text-base font-extrabold text-emerald-700">Strong</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="text-slate-500 text-[11px]">SYSTEM THINKING</div>
            <div className="text-base font-extrabold text-emerald-700">Good</div>
          </div>

        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('/feedback')}
          className="w-full sm:w-auto btn-pill-primary text-sm px-8 py-3.5 shadow-md"
        >
          <span>View Full Feedback Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto btn-pill-ghost text-sm px-8 py-3.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start New Session</span>
        </button>
      </div>

    </div>
  );
}
