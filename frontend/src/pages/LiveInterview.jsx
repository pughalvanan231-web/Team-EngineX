import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Send, Trash2, CheckCircle2, ChevronRight, CornerDownLeft, Sparkles, AlertCircle, LayoutGrid, Info, Shield, Play } from 'lucide-react';

export function LiveInterview({ state, onSubmitAnswer, onFinishEarly, loading, candidate }) {
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const transcriptEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.questions_asked, state?.answers, loading]);

  if (!state) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-sm font-mono text-slate-500">No active interview session found.</div>
        <button
          onClick={() => navigate('/prep')}
          className="btn-pill-primary text-xs px-6 py-2"
        >
          Return to Preparation
        </button>
      </div>
    );
  }

  // Handle completion state redirection
  if (state.status === 'completed') {
    navigate('/complete');
  }

  const currentQ = state.current_question || {};
  const qNum = state.question_number || 1;
  const questionsList = state.questions_asked || (currentQ.question ? [currentQ] : []);
  const answersList = state.answers || [];
  const topicsCovered = state.topics_covered || [];
  const daysCovered = state.curriculum_days_covered || [];

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (!answerText.trim() || loading) return;
    onSubmitAnswer(answerText.trim());
    setAnswerText('');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleFormSubmit(e);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden bg-slate-50/50">
      
      {/* 1. INTERVIEW HEADER */}
      <div className="w-full border-b border-slate-200/80 bg-white px-4 py-3 flex items-center justify-between font-mono text-xs shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Technical Interview</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">
            Candidate: <strong className="text-slate-900">{state.candidate_name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Question {qNum}</span>
            <span className="text-slate-400">/ 8+ Target</span>
          </div>

          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <span
                key={num}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  num < qNum
                    ? 'bg-indigo-600'
                    : num === qNum
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Mobile Context Drawer Toggle */}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="md:hidden px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
          >
            Context
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (~220px) */}
        <aside className="hidden lg:flex flex-col w-60 border-r border-slate-200/80 bg-white p-4 space-y-6 overflow-y-auto shrink-0 font-mono text-xs">
          
          {/* AI Interviewer Badge */}
          <div className="p-4 rounded-2xl bg-[#F2F7F4] border border-emerald-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">AI Interviewer</div>
                <div className="text-[10px] text-slate-500">Technical Lead</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1 border-t border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interview in progress</span>
            </div>
          </div>

          {/* Stage & Difficulty */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Interview Stage</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 font-medium text-[11px]">
              {state.interview_stage || "Warm-up & Fundamentals"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Adaptive Difficulty</div>
            <div className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] uppercase font-bold">
              {state.difficulty || "Intermediate"}
            </div>
          </div>

          {/* End Interview Early Button */}
          <div className="pt-4 border-t border-slate-100 mt-auto">
            <button
              onClick={onFinishEarly}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 text-[11px] font-medium transition-colors text-left"
            >
              Finish & Evaluate Early
            </button>
          </div>

        </aside>

        {/* CENTER TRANSCRIPT & QUESTION AREA */}
        <main className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden relative">
          
          {/* Conversation Transcript Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 font-sans">
            
            {answersList.map((item, index) => (
              <div key={index} className="space-y-4">
                
                {/* Past Question Block */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                      DAY {item.curriculum_day || 8} · {item.topic?.toUpperCase() || 'CORE'}
                    </span>
                    <span className="text-slate-400">Q{index + 1}</span>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-400">
                    AI INTERVIEWER
                  </div>
                  
                  <div className="text-sm text-slate-900 leading-relaxed font-normal">
                    {item.question}
                  </div>
                </div>

                {/* Candidate Answer Block */}
                <div className="p-5 rounded-3xl bg-[#F0F4FF] border border-indigo-100 space-y-2 ml-4 sm:ml-8 shadow-sm">
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    YOUR RESPONSE
                  </div>
                  <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                  </div>
                </div>

              </div>
            ))}

            {/* CURRENT ACTIVE QUESTION BLOCK */}
            {currentQ.question && (
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
                
                {/* Context & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px]">
                      {currentQ.is_follow_up ? 'FOLLOW-UP QUESTION' : (currentQ.followup_label || 'CORE QUESTION')}
                    </span>
                    <span className="text-slate-600 font-semibold">
                      DAY {currentQ.curriculum_day || 8} · {currentQ.topic || 'TECHNICAL QUESTION'}
                    </span>
                  </div>
                  <span className="text-slate-400">Question {qNum}</span>
                </div>

                <div className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
                  AI INTERVIEWER
                </div>

                <div className="text-base text-slate-900 leading-relaxed font-semibold">
                  {currentQ.question}
                </div>
              </div>
            )}

            {/* THINKING STATE */}
            {loading && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 text-xs font-mono text-slate-600 animate-pulse">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Interviewer is thinking and evaluating response...</span>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* ANSWER INPUT AREA */}
          <div className="p-4 border-t border-slate-200/80 bg-white shrink-0 shadow-lg">
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Explain your approach, design decisions, and trade-offs..."
                  rows={4}
                  disabled={loading}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-sans focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-y min-h-[100px] max-h-[250px]"
                />

                <div className="flex items-center justify-between pt-2 px-1 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>{answerText.length} characters</span>
                    {answerText && (
                      <button
                        type="button"
                        onClick={() => setAnswerText('')}
                        className="hover:text-slate-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] text-slate-400">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">Enter</kbd> to submit
                    </span>

                    <button
                      type="submit"
                      disabled={!answerText.trim() || loading}
                      className="btn-pill-primary text-xs px-6 py-2.5 shadow-sm"
                    >
                      <span>Submit Answer</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] font-mono text-slate-400 text-center">
                Your answer is evaluated after submission.
              </div>
            </form>
          </div>

        </main>

        {/* RIGHT SIDEBAR (~240px) */}
        <aside className={`${
          showMobileSidebar ? 'fixed inset-0 z-50 bg-white p-6 flex flex-col' : 'hidden md:flex'
        } flex-col w-64 border-l border-slate-200/80 bg-white p-4 space-y-6 overflow-y-auto shrink-0 font-mono text-xs`}>
          
          {showMobileSidebar && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">Interview Context</span>
              <button onClick={() => setShowMobileSidebar(false)} className="text-slate-500">Close</button>
            </div>
          )}

          <div>
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
              Interview Context
            </h3>
            
            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Candidate</span>
                <span className="text-slate-900 font-bold">{state.candidate_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Topic</span>
                <span className="text-slate-900 font-semibold truncate max-w-[110px]" title={currentQ.topic}>
                  {currentQ.topic || 'Overview'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Curriculum</span>
                <span className="text-slate-900 font-semibold">Day {currentQ.curriculum_day || 8}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Difficulty</span>
                <span className="text-indigo-600 uppercase font-bold">{state.difficulty || 'Intermediate'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Questions</span>
                <span className="text-slate-900 font-bold">{qNum}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-700 font-semibold">In progress</span>
              </div>
            </div>
          </div>

          {/* Topics Covered Chips */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Topics Covered
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topicsCovered.length > 0 ? (
                topicsCovered.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-[10px]">Initializing topics...</span>
              )}
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Interview Progress
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex justify-between">
                <span>Questions asked:</span>
                <strong className="text-slate-900">{qNum}</strong>
              </li>
              <li className="flex justify-between">
                <span>Topics explored:</span>
                <strong className="text-slate-900">{topicsCovered.length}</strong>
              </li>
              <li className="flex justify-between">
                <span>Curriculum days:</span>
                <strong className="text-slate-900">{daysCovered.length} / 4+</strong>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </div>
  );
}
