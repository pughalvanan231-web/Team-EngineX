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
    <div className="w-full py-16 max-w-2xl mx-auto space-y-8 text-center">
      
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-agent-text tracking-tight">
          Interview Complete
        </h1>
        <p className="text-sm text-agent-secondary">
          Your technical interview for <strong className="text-agent-text">{candidateName}</strong> has been evaluated.
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border text-left space-y-3">
        <div className="text-xs font-mono font-semibold text-agent-accentLight uppercase tracking-wider">
          Interviewer Summary
        </div>
        <p className="text-sm text-agent-text leading-relaxed font-sans">
          "{summaryText}"
        </p>
      </div>

      {/* Qualitative Assessment Grid */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4 text-left">
        <div className="text-xs font-mono text-agent-muted uppercase tracking-wider">
          Qualitative Assessment
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-secondary text-[11px]">TECHNICAL UNDERSTANDING</div>
            <div className="text-sm font-bold text-emerald-400">Strong</div>
          </div>

          <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-secondary text-[11px]">COMMUNICATION</div>
            <div className="text-sm font-bold text-emerald-400">Good</div>
          </div>

          <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-secondary text-[11px]">PROBLEM SOLVING</div>
            <div className="text-sm font-bold text-emerald-400">Strong</div>
          </div>

          <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-secondary text-[11px]">SYSTEM THINKING</div>
            <div className="text-sm font-bold text-emerald-400">Good</div>
          </div>

        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('/feedback')}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-agent-accent text-white font-medium text-sm hover:bg-agent-accentHover transition-colors flex items-center justify-center gap-2 shadow-subtle"
        >
          <span>View Full Feedback Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-agent-surface border border-agent-border text-agent-secondary hover:text-agent-text font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Start New Session</span>
        </button>
      </div>

    </div>
  );
}
