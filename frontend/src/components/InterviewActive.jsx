import React, { useState } from 'react';
import { Send, ArrowRight, CornerDownRight, CheckCircle2, Clock, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export function InterviewActive({ state, onSubmitAnswer, onFinishEarly, loading, candidate }) {
  const [answerText, setAnswerText] = useState('');

  if (!state || !state.current_question) return null;

  const q = state.current_question;
  const qNum = state.question_number || 1;
  const maxQ = 10;
  const progressPct = Math.min(100, Math.round((qNum / maxQ) * 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim() || loading) return;
    onSubmitAnswer(answerText.trim());
    setAnswerText('');
  };

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F3F0FF] text-[#6D5DFB] flex items-center justify-center font-mono font-bold text-xs">
            {state.candidate_name?.substring(0, 2).toUpperCase() || 'CA'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111111]">{state.candidate_name}</h2>
            <p className="text-xs text-[#737373]">Interview ID: {state.interview_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[#F8F8FA] border border-[#E5E5E5] text-[#111111] font-medium">
            Stage: {state.interview_stage || 'Technical Assessment'}
          </span>
          <button
            onClick={onFinishEarly}
            disabled={loading || state.answers?.length < 4}
            className="px-3 py-1 rounded bg-[#F8F8FA] hover:bg-[#E5E5E5] border border-[#E5E5E5] text-[#737373] hover:text-[#111111] transition-colors disabled:opacity-50"
            title="Finish interview and generate evaluation report"
          >
            Finish & Evaluate
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Left Telemetry, Center Active Q&A, Right Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Telemetry & Progress (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Progress Card */}
          <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#737373]">Question Progress</span>
              <span className="font-bold text-[#111111]">{qNum} of {maxQ}</span>
            </div>
            
            <div className="w-full h-1.5 rounded-full bg-[#E5E5E5] overflow-hidden">
              <div
                className="h-full bg-[#6D5DFB] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="pt-2 border-t border-[#E5E5E5] space-y-2 text-xs font-mono">
              <div>
                <span className="text-[#737373] block text-[10px] uppercase">Current Topic</span>
                <span className="font-semibold text-[#111111] block line-clamp-1">{q.topic}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373]">Difficulty</span>
                <span className="font-semibold uppercase text-[#6D5DFB] bg-[#F3F0FF] px-2 py-0.5 rounded text-[10px] border border-[#6D5DFB]/20">
                  {q.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373]">Days Covered</span>
                <span className="font-semibold text-[#111111]">{state.curriculum_days_covered?.length || 1} / 4+</span>
              </div>
            </div>
          </div>

          {/* Candidate Context Card */}
          {candidate && (
            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-3 text-xs">
              <span className="font-mono uppercase font-semibold text-[#111111] text-[10px] block">
                Candidate Journey Signals
              </span>
              <div className="space-y-1">
                <span className="text-[#737373] block">Completed Missions</span>
                <div className="flex flex-wrap gap-1">
                  {candidate.completed_missions?.map(m => (
                    <span key={m.mission_id} className="px-1.5 py-0.5 rounded bg-[#F8F8FA] border border-[#E5E5E5] font-mono text-[10px]">
                      Day {m.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel: Active Question & Candidate Answer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Question Box */}
          <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] space-y-4 shadow-sm relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#6D5DFB] uppercase">
                  INTERVIEWER
                </span>
                <span className="text-xs text-[#737373]">·</span>
                <span className="text-xs font-mono text-[#737373]">Question {qNum}</span>
              </div>

              {q.is_follow_up && (
                <span className="text-xs font-mono text-[#6D5DFB] bg-[#F3F0FF] px-2 py-0.5 rounded border border-[#6D5DFB]/30 flex items-center gap-1 font-semibold">
                  <CornerDownRight className="w-3 h-3" />
                  Follow-up Probing
                </span>
              )}
            </div>

            {/* Dynamic Follow-Up Label */}
            {q.followup_label && (
              <div className="p-2.5 rounded bg-[#F3F0FF] border border-[#6D5DFB]/20 text-xs font-mono text-[#6D5DFB] font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>"{q.followup_label}"</span>
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-normal text-[#111111] leading-relaxed font-sans">
              "{q.question}"
            </h3>
          </div>

          {/* Candidate Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#737373] mb-1.5 uppercase font-semibold">
                Your Technical Answer
              </label>
              <textarea
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={loading}
                placeholder="Type your technical response here. Explain mechanisms, architectural decisions, and trade-offs..."
                className="w-full p-4 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-sm text-[#111111] leading-relaxed focus:outline-none focus:border-[#6D5DFB] font-sans resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#737373] font-mono">
                Press Submit when ready. The interviewer evaluates reasoning & trade-offs.
              </span>
              <button
                type="submit"
                disabled={!answerText.trim() || loading}
                className="py-2.5 px-5 rounded-md bg-[#6D5DFB] hover:bg-[#5B4CF0] text-white text-xs font-mono font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{loading ? 'Evaluating & Reasoning...' : 'Submit Answer'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Conversation Stream (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <span className="text-xs font-mono uppercase font-semibold text-[#111111] tracking-wider block">
            Interview Stream History
          </span>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {state.answers && state.answers.length > 0 ? (
              state.answers.map((item, idx) => (
                <div key={idx} className="p-3 rounded bg-[#F8F8FA] border border-[#E5E5E5] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#737373]">
                    <span className="font-semibold text-[#111111]">Q{item.question_number} ({item.topic})</span>
                    <span>{item.timestamp?.substring(11, 16)}</span>
                  </div>
                  <p className="text-[#111111] italic font-sans text-xs">"{item.question}"</p>
                  <p className="text-[#525252] border-t border-[#E5E5E5] pt-1.5 leading-relaxed font-sans line-clamp-3">
                    <span className="font-semibold text-[#111111]">Answer: </span>
                    {item.answer}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs font-mono text-[#737373] bg-[#FFFFFF] border border-[#E5E5E5] rounded">
                No previous turns yet. Active question is Question 1.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
