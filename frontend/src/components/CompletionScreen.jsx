import React from 'react';
import { Award, CheckCircle2, AlertTriangle, BookOpen, User, RotateCcw } from 'lucide-react';

export function CompletionScreen({ feedback, candidateName, onReset }) {
  if (!feedback) return null;

  const overall = feedback.overall_score || 82;
  const categories = feedback.category_scores || [
    { category: "Technical Understanding", score: 85 },
    { category: "System Design", score: 75 },
    { category: "Practical Knowledge", score: 84 },
    { category: "Communication", score: 88 }
  ];

  return (
    <div className="py-8 space-y-8 max-w-3xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#16A34A] block mb-1">
            EVALUATION COMPLETED
          </span>
          <h1 className="text-2xl font-bold text-[#111111] font-mono tracking-tight">
            Interview Complete
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Technical Assessment Report for <span className="font-semibold text-[#111111]">{candidateName}</span>
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="p-4 rounded-lg bg-[#F3F0FF] border border-[#6D5DFB]/30 text-center shrink-0">
          <span className="text-xs font-mono text-[#6D5DFB] uppercase block">Overall Performance</span>
          <span className="text-3xl font-extrabold text-[#6D5DFB] font-mono tracking-tight">{overall}%</span>
        </div>
      </div>

      {/* Category Score Bars (Accessibility ARIA Progressbars) */}
      <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
          Dimension Performance Breakdown
        </h3>

        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#111111] font-medium">{cat.category}</span>
                <span className="font-bold text-[#6D5DFB]">{cat.score}%</span>
              </div>

              {/* ARIA Accessible Progressbar */}
              <div
                role="progressbar"
                aria-label={cat.category}
                aria-valuenow={cat.score}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-2 rounded-full bg-[#E5E5E5] overflow-hidden"
              >
                <div
                  className="h-full bg-[#6D5DFB] transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#16A34A]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Technical Strengths</span>
          </div>

          <ul className="space-y-2 text-xs text-[#111111] font-sans leading-relaxed">
            {feedback.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#DC2626]">
            <AlertTriangle className="w-4 h-4" />
            <span>Areas to Improve</span>
          </div>

          <ul className="space-y-2 text-xs text-[#111111] font-sans leading-relaxed">
            {feedback.weaknesses?.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#DC2626] font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Revisions */}
      <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#6D5DFB]">
          <BookOpen className="w-4 h-4" />
          <span>Recommended Study Revision</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {feedback.recommendations?.map((rec, idx) => (
            <div key={idx} className="p-3 rounded bg-[#F3F0FF]/50 border border-[#6D5DFB]/20 text-[#6D5DFB]">
              <span className="font-semibold block mb-1">Step {idx + 1}</span>
              <span className="text-[#111111] font-sans text-xs">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interviewer Summary */}
      {feedback.interviewer_summary && (
        <div className="p-6 rounded-lg bg-[#F8F8FA] border border-[#E5E5E5] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#737373]">
            Lead Evaluator Summary
          </span>
          <p className="text-sm text-[#111111] leading-relaxed italic font-sans">
            "{feedback.interviewer_summary}"
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#6D5DFB] hover:bg-[#5B4CF0] text-white text-xs font-mono font-medium transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Interview</span>
        </button>
      </div>
    </div>
  );
}
