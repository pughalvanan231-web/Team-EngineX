import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, UserCheck, Award, Zap, ShieldAlert } from 'lucide-react';

export function CandidateSetup({ candidates = [], selectedCandidate, onSelectCandidate, onStart, loading }) {
  if (!selectedCandidate && candidates.length > 0) {
    onSelectCandidate(candidates[0]);
  }

  const current = selectedCandidate || candidates[0];

  return (
    <div className="py-8 space-y-8 max-w-3xl mx-auto">
      {/* Title & Tagline */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F3F0FF] border border-[#6D5DFB]/20 text-xs font-mono text-[#6D5DFB]">
          <span>AI Cohort Assessment Platform</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight font-mono">
          Interview Agent
        </h1>
        <p className="text-base text-[#737373] max-w-xl leading-relaxed">
          Personalized technical interviews based on your AI Cohort journey.
        </p>
      </div>

      <hr className="border-[#E5E5E5]" />

      {/* Candidate Selector Header */}
      <div className="space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111] block">
          Select Candidate Profile
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {candidates.map((cand) => {
            const isSelected = current?.candidate_id === cand.candidate_id;
            return (
              <button
                key={cand.candidate_id}
                onClick={() => onSelectCandidate(cand)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[#6D5DFB] bg-[#F3F0FF]/40 shadow-sm'
                    : 'border-[#E5E5E5] bg-[#FFFFFF] hover:border-[#D4D4D4]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E5E5] overflow-hidden flex items-center justify-center font-mono font-bold text-xs text-[#111111]">
                    {cand.name.substring(0, 2).toUpperCase()}
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-[#6D5DFB]" />}
                </div>
                <h4 className="text-sm font-bold text-[#111111] leading-tight">{cand.name}</h4>
                <p className="text-xs text-[#737373] mt-0.5 line-clamp-1">{cand.role}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Candidate Learning Journey Details */}
      {current && (
        <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <div>
              <h3 className="text-lg font-bold text-[#111111] font-mono">{current.name}</h3>
              <p className="text-xs text-[#737373]">{current.role}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#737373] block">Baseline Difficulty</span>
              <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#F8F8FA] border border-[#E5E5E5] text-[#111111]">
                {current.learning_signals?.baseline_difficulty || 'Intermediate'}
              </span>
            </div>
          </div>

          {/* Completed Missions */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[#111111]">
              <Award className="w-4 h-4 text-[#16A34A]" />
              <span>Completed Cohort Missions ({current.completed_missions?.length || 0})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {current.completed_missions?.map((m) => (
                <div key={m.mission_id} className="p-2.5 rounded bg-[#F8F8FA] border border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#111111] block">{m.title}</span>
                    <span className="text-[#737373] font-mono">Day {m.day} Curriculum</span>
                  </div>
                  <span className="font-mono font-bold text-[#16A34A]">{m.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Signals & Skipped Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase text-[#111111] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#6D5DFB]" />
                Known Strengths
              </span>
              <div className="flex flex-wrap gap-1.5">
                {current.learning_signals?.strong_areas?.map((area, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-[#F3F0FF] text-[#6D5DFB] border border-[#6D5DFB]/20 font-mono">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase text-[#111111] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
                Skipped Curriculum Days
              </span>
              <div className="flex flex-wrap gap-1.5">
                {current.skipped_days?.map((day) => (
                  <span key={day} className="text-xs px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20 font-mono">
                    Day {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Start Interview Action Button */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => onStart(current.candidate_id)}
              disabled={loading}
              className="w-full py-3 px-6 rounded-md bg-[#6D5DFB] hover:bg-[#5B4CF0] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 font-mono shadow-sm"
            >
              <span>{loading ? 'Initializing Interview Engine...' : 'Start Technical Interview'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
