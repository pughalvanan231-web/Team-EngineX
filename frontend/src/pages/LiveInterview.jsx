import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal, Send, CheckCircle2, Sparkles, RefreshCw, AlertCircle, Award, User, HelpCircle } from 'lucide-react';
import { fetchInterviewSession, submitInterviewAnswer, finishInterviewSession } from '../services/api';

export function LiveInterview({ state: propState, onSubmitAnswer: propSubmit, onFinishEarly: propFinish, loading: propLoading, candidate }) {
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(propState || null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const transcriptEndRef = useRef(null);

  const sessionId = routeSessionId || propState?.interview_id || propState?.sessionId;

  // Load session from API if missing from props
  useEffect(() => {
    async function syncSession() {
      if (sessionId) {
        const fetched = await fetchInterviewSession(sessionId);
        if (fetched) {
          setState(fetched);
          if (fetched.status === 'completed') {
            navigate(`/interview/${sessionId}/result`);
          }
        }
      }
    }
    syncSession();
  }, [sessionId]);

  // Keep state updated when propState changes
  useEffect(() => {
    if (propState) {
      setState(propState);
      if (propState.status === 'completed') {
        const sId = propState.interview_id || propState.sessionId || sessionId;
        navigate(`/interview/${sId}/result`);
      }
    }
  }, [propState]);

  // Auto-scroll conversation
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.answers, state?.current_question, submitting]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!answerText.trim() || submitting || propLoading) return;

    const currentAns = answerText.trim();
    setAnswerText('');

    if (propSubmit) {
      propSubmit(currentAns);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const newState = await submitInterviewAnswer(sessionId, currentAns);
      if (newState) {
        setState(newState);
        if (newState.status === 'completed') {
          navigate(`/interview/${sessionId}/result`);
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit answer. Retrying...');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishEarly = async () => {
    if (propFinish) {
      propFinish();
      return;
    }
    try {
      setSubmitting(true);
      const finalState = await finishInterviewSession(sessionId);
      if (finalState) {
        navigate(`/interview/${sessionId}/result`);
      }
    } catch (err) {
      console.error('Error completing interview:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!state && !sessionId) {
    return (
      <div className="py-20 text-center space-y-4 font-mono text-xs">
        <div className="text-slate-500">No active interview session found.</div>
        <button onClick={() => navigate('/candidates')} className="btn-pill-primary px-6 py-2">
          Select Candidate
        </button>
      </div>
    );
  }

  const activeState = state || propState || {};
  const currentQ = activeState.current_question || {};
  const qNum = activeState.question_number || (activeState.answers?.length ? activeState.answers.length + 1 : 1);
  const totalTarget = 8;
  const progressPct = Math.min(100, Math.round((qNum / totalTarget) * 100));

  const candidateName = activeState.candidate_name || candidate?.name || candidate?.member?.name || "Candidate";
  const candidateId = activeState.candidate_id || candidate?.candidate_id || candidate?.member?.id || "CAND-001";
  const jobRole = activeState.job_role || candidate?.role || candidate?.member?.jobRole || "AI Engineer";

  return (
    <div className="w-full flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto overflow-hidden bg-slate-50/50 py-4">
      {/* 1. TEST PANEL HEADER */}
      <div className="w-full border-b border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans rounded-t-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold font-mono text-xs shrink-0">
            {candidateId}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">{candidateName}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">Active Session</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{jobRole}</p>
          </div>
        </div>

        {/* Question Counter & Progress Bar */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 font-medium">Question</span>
              <span className="font-bold text-slate-900">{qNum} / ~{totalTarget}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
              <div
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleFinishEarly}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
          >
            End Early
          </button>
        </div>
      </div>

      {/* 2. QUESTION & CONVERSATION AREA */}
      <div className="flex-1 flex flex-col bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6">
        
        {/* Previous Q&A Conversation Turns */}
        {activeState.answers?.map((ans, idx) => (
          <div key={idx} className="space-y-4 pt-2 border-b border-slate-100 pb-4">
            {/* Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                AI
              </div>
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-slate-800 text-xs font-sans space-y-1 max-w-3xl">
                <div className="text-[10px] font-mono text-orange-700 font-bold uppercase">
                  Question {ans.question_number} · {ans.topic}
                </div>
                <p className="font-medium text-slate-900 leading-relaxed">{ans.question}</p>
              </div>
            </div>

            {/* Answer */}
            <div className="flex items-start justify-end gap-3">
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-sans space-y-1 max-w-3xl">
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  {candidateName}
                </div>
                <p className="leading-relaxed">{ans.answer}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {/* Current Active Question Card */}
        {currentQ.question && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                AI
              </div>

              <div className="flex-1 p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
                {/* Topic & Priority Badges */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 font-semibold">
                    Day {currentQ.day || currentQ.curriculum_day}: {currentQ.topic}
                  </span>

                  {currentQ.priority_category && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold uppercase">
                      Priority: {currentQ.priority_category}
                    </span>
                  )}

                  {currentQ.is_follow_up && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold">
                      {currentQ.followup_label || 'FOLLOW-UP QUESTION'}
                    </span>
                  )}

                  <span className="ml-auto text-slate-400 text-[11px] capitalize">
                    Difficulty: {currentQ.difficulty || 'Intermediate'}
                  </span>
                </div>

                {/* Main Question Text */}
                <h3 className="text-base sm:text-lg font-bold leading-relaxed tracking-tight text-white pt-1">
                  {currentQ.question}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* 3. ANSWER SUBMISSION AREA */}
      <div className="border border-slate-200 bg-white p-4 rounded-b-3xl shadow-sm space-y-3">
        {error && (
          <div className="text-xs font-mono text-rose-600 bg-rose-50 p-2 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your technical response, trade-off analysis, and system architecture explanation..."
            disabled={submitting || propLoading}
            rows={3}
            className="flex-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
          />

          <button
            type="submit"
            disabled={!answerText.trim() || submitting || propLoading}
            className="px-6 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-2 self-end sm:self-center disabled:opacity-50 shadow-md shadow-orange-600/20 transition-all"
          >
            {submitting || propLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
