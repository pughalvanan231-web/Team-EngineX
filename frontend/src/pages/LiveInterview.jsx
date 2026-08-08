import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Send, Trash2, CheckCircle2, ChevronRight, CornerDownLeft, Sparkles, AlertCircle, LayoutGrid, Info, Shield } from 'lucide-react';

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
        <div className="text-sm font-mono text-agent-secondary">No active interview session found.</div>
        <button
          onClick={() => navigate('/prep')}
          className="px-4 py-2 bg-agent-accent text-white font-mono text-xs rounded-md"
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
    <div className="w-full flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. INTERVIEW HEADER */}
      <div className="w-full border-b border-agent-border bg-agent-surface px-4 py-3 flex items-center justify-between font-mono text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-agent-text">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Technical Interview</span>
          </div>
          <span className="text-agent-muted">|</span>
          <span className="text-agent-secondary">
            Candidate: <strong className="text-agent-text">{state.candidate_name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-agent-secondary">Question {qNum}</span>
            <span className="text-agent-muted">/ 8+ Target</span>
          </div>

          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <span
                key={num}
                className={`w-2 h-2 rounded-full transition-colors ${
                  num < qNum
                    ? 'bg-agent-accent'
                    : num === qNum
                    ? 'bg-agent-accentLight animate-pulse'
                    : 'bg-agent-border'
                }`}
              />
            ))}
          </div>

          {/* Mobile Context Drawer Toggle */}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="md:hidden px-2.5 py-1 rounded bg-agent-elevated border border-agent-border text-agent-secondary text-[11px]"
          >
            Context
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (~220px) - Navigation & Index */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-agent-border bg-agent-bg p-4 space-y-6 overflow-y-auto shrink-0 font-mono text-xs">
          
          {/* AI Interviewer Badge */}
          <div className="p-3 rounded bg-agent-surface border border-agent-border space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-agent-accent/20 border border-agent-accent/40 flex items-center justify-center text-agent-accent">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-agent-text text-[11px]">AI Interviewer</div>
                <div className="text-[10px] text-agent-muted">Technical Lead</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1 border-t border-agent-borderMuted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>● Interview in progress</span>
            </div>
          </div>

          {/* Stage & Difficulty */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase text-agent-muted font-bold tracking-wider">Interview Stage</div>
            <div className="p-2.5 rounded bg-agent-surface border border-agent-border text-agent-text text-[11px]">
              {state.interview_stage || "Warm-up & Fundamentals"}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] uppercase text-agent-muted font-bold tracking-wider">Adaptive Difficulty</div>
            <div className="px-2.5 py-1.5 rounded bg-agent-surface border border-agent-border text-agent-accentLight text-[11px] uppercase font-semibold">
              {state.difficulty || "Intermediate"}
            </div>
          </div>

          {/* End Interview Early Button */}
          <div className="pt-4 border-t border-agent-border">
            <button
              onClick={onFinishEarly}
              className="w-full px-3 py-2 rounded bg-agent-surface border border-agent-border hover:border-agent-error/50 text-agent-muted hover:text-agent-error text-[11px] transition-colors text-left"
            >
              Finish & Evaluate Early
            </button>
          </div>

        </aside>

        {/* CENTER TRANSCRIPT & QUESTION AREA */}
        <main className="flex-1 flex flex-col bg-agent-bg overflow-hidden relative">
          
          {/* Conversation Transcript Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-8 font-sans">
            
            {answersList.map((item, index) => (
              <div key={index} className="space-y-6">
                
                {/* Past Question Block */}
                <div className="p-5 rounded-lg bg-agent-surface border border-agent-border space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-agent-elevated border border-agent-borderMuted text-agent-secondary">
                      MODULE {Math.ceil((item.curriculum_day || 8) / 4)} · DAY {item.curriculum_day || 8} · {item.topic?.toUpperCase() || 'CORE'}
                    </span>
                    <span className="text-agent-muted">Q{index + 1}</span>
                  </div>

                  <div className="text-xs font-mono font-semibold text-agent-muted">
                    AI INTERVIEWER
                  </div>
                  
                  <div className="text-sm text-agent-text leading-relaxed font-normal">
                    {item.question}
                  </div>
                </div>

                {/* Candidate Answer Block */}
                <div className="p-5 rounded-lg bg-agent-elevated/40 border border-agent-borderMuted space-y-2 ml-4 sm:ml-8">
                  <div className="text-xs font-mono font-semibold text-agent-accentLight">
                    YOUR RESPONSE
                  </div>
                  <div className="text-sm text-agent-text leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                  </div>
                </div>

              </div>
            ))}

            {/* CURRENT ACTIVE QUESTION BLOCK */}
            {currentQ.question && (
              <div className="p-5 rounded-lg bg-agent-surface border border-agent-border space-y-4 shadow-subtle">
                
                {/* Context & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-agent-accent/10 border border-agent-accent/30 text-agent-accentLight font-medium text-[11px]">
                      {currentQ.is_follow_up ? 'FOLLOW-UP QUESTION' : (currentQ.followup_label || 'CORE QUESTION')}
                    </span>
                    <span className="text-agent-secondary">
                      DAY {currentQ.curriculum_day || 8} · {currentQ.topic || 'TECHNICAL QUESTION'}
                    </span>
                  </div>
                  <span className="text-agent-muted">Question {qNum}</span>
                </div>

                <div className="text-xs font-mono font-semibold text-agent-muted tracking-wide">
                  AI INTERVIEWER
                </div>

                <div className="text-base text-agent-text leading-relaxed font-medium">
                  {currentQ.question}
                </div>
              </div>
            )}

            {/* THINKING STATE */}
            {loading && (
              <div className="p-4 rounded-lg bg-agent-surface/50 border border-agent-border flex items-center gap-3 text-xs font-mono text-agent-secondary animate-pulse">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-agent-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-agent-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-agent-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Interviewer is thinking and evaluating response...</span>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* 14. ANSWER INPUT AREA */}
          <div className="p-4 border-t border-agent-border bg-agent-surface shrink-0">
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Explain your approach, design decisions, and trade-offs..."
                  rows={4}
                  disabled={loading}
                  className="w-full p-3.5 rounded-lg bg-agent-elevated border border-agent-border text-agent-text placeholder-agent-muted text-sm font-sans focus:outline-none focus:border-agent-accent transition-colors resize-y min-h-[100px] max-h-[250px]"
                />

                <div className="flex items-center justify-between pt-2 px-1 text-xs font-mono text-agent-muted">
                  <div className="flex items-center gap-3">
                    <span>{answerText.length} characters</span>
                    {answerText && (
                      <button
                        type="button"
                        onClick={() => setAnswerText('')}
                        className="hover:text-agent-secondary flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px]">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-agent-border text-agent-text">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-agent-border text-agent-text">Enter</kbd> to submit
                    </span>

                    <button
                      type="submit"
                      disabled={!answerText.trim() || loading}
                      className="px-5 py-2 rounded-md bg-agent-accent text-white font-medium text-xs hover:bg-agent-accentHover disabled:opacity-40 transition-all flex items-center gap-2 shadow-subtle"
                    >
                      <span>Submit Answer</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] font-mono text-agent-muted text-center">
                Your answer is evaluated after submission.
              </div>
            </form>
          </div>

        </main>

        {/* RIGHT SIDEBAR (~240px) - INTERVIEW CONTEXT PANEL */}
        <aside className={`${
          showMobileSidebar ? 'fixed inset-0 z-50 bg-agent-bg/95 p-6 flex flex-col' : 'hidden md:flex'
        } flex-col w-64 border-l border-agent-border bg-agent-surface p-4 space-y-6 overflow-y-auto shrink-0 font-mono text-xs`}>
          
          {showMobileSidebar && (
            <div className="flex justify-between items-center pb-2 border-b border-agent-border">
              <span className="font-bold text-agent-text">Interview Context</span>
              <button onClick={() => setShowMobileSidebar(false)} className="text-agent-muted">Close</button>
            </div>
          )}

          <div>
            <h3 className="text-[10px] uppercase font-bold text-agent-muted tracking-wider mb-3">
              Interview Context
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-agent-borderMuted">
                <span className="text-agent-secondary">Candidate</span>
                <span className="text-agent-text font-medium">{state.candidate_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agent-borderMuted">
                <span className="text-agent-secondary">Current Topic</span>
                <span className="text-agent-text font-medium truncate max-w-[110px]" title={currentQ.topic}>
                  {currentQ.topic || 'Overview'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-agent-borderMuted">
                <span className="text-agent-secondary">Curriculum</span>
                <span className="text-agent-text font-medium">Day {currentQ.curriculum_day || 8}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agent-borderMuted">
                <span className="text-agent-secondary">Difficulty</span>
                <span className="text-agent-accentLight uppercase font-semibold">{state.difficulty || 'Intermediate'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agent-borderMuted">
                <span className="text-agent-secondary">Questions</span>
                <span className="text-agent-text font-medium">{qNum}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-agent-secondary">Status</span>
                <span className="text-emerald-400 font-medium">In progress</span>
              </div>
            </div>
          </div>

          {/* Topics Covered Chips */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-agent-muted tracking-wider">
              Topics Covered
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topicsCovered.length > 0 ? (
                topicsCovered.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-agent-elevated border border-agent-borderMuted text-agent-text text-[10px]">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-agent-muted text-[10px]">Initializing topics...</span>
              )}
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="p-3 rounded bg-agent-elevated border border-agent-border space-y-2">
            <div className="text-[10px] uppercase font-bold text-agent-muted tracking-wider">
              Interview Progress
            </div>
            <ul className="space-y-1.5 text-[11px] text-agent-secondary">
              <li className="flex justify-between">
                <span>Questions asked:</span>
                <strong className="text-agent-text">{qNum}</strong>
              </li>
              <li className="flex justify-between">
                <span>Topics explored:</span>
                <strong className="text-agent-text">{topicsCovered.length}</strong>
              </li>
              <li className="flex justify-between">
                <span>Curriculum days:</span>
                <strong className="text-agent-text">{daysCovered.length} / 4+</strong>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </div>
  );
}
