import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle, Clock, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';

export function InterviewPreparation({ candidate, onStartInterview, loading }) {
  const navigate = useNavigate();

  const handleBegin = async () => {
    const candId = candidate?.member?.id || candidate?.candidate_id || 'CAND-001';
    await onStartInterview(candId, candidate);
    navigate('/interview');
  };

  const topicsList = [
    "RAG Architecture",
    "Vector Search & Embeddings",
    "Prompt Engineering",
    "Multi-Agent Orchestration",
    "Model Context Protocol (MCP)",
    "Docker & Kubernetes Deployment",
    "Evaluation & Security Guardrails"
  ];

  return (
    <div className="w-full py-12 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERVIEW PREPARATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Personalized Technical Interview
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Tailored to your completed cohort missions, architectural choices, and candidate signals.
        </p>
      </div>

      {/* Summary Matrix Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Interview Parameters
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 text-[11px]">Questions</div>
            <div className="text-xl font-bold text-slate-900">8+</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 text-[11px]">Curriculum Target</div>
            <div className="text-xl font-bold text-slate-900">4+ Days</div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1">
            <div className="text-indigo-600 text-[11px]">Mode</div>
            <div className="text-xl font-bold text-indigo-700">Adaptive</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 text-[11px]">Est. Time</div>
            <div className="text-xl font-bold text-slate-900">15–20 min</div>
          </div>
        </div>
      </div>

      {/* Topics Likely to be Explored */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            Topics Likely to be Explored
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Based on your completed missions</span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {topicsList.map((topic, i) => (
            <span
              key={i}
              className="chip-pill"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Adaptive Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-[#F2F7F4] border border-emerald-200/80 text-xs font-mono text-slate-700 flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-900 font-bold">Adaptive Evaluation Engine:</span>
          <p className="mt-0.5 text-slate-600">
            "The interviewer will adapt the conversation based on your answers. Questions escalate in technical depth when you answer strongly, or pivot to clarify foundational concepts."
          </p>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={handleBegin}
          disabled={loading}
          className="btn-pill-primary text-base px-10 py-3.5 shadow-md group"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Initializing Engine...</span>
            </>
          ) : (
            <>
              <span>Begin Interview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        <span className="text-xs font-mono text-slate-400">
          Session state will be saved automatically throughout the interview
        </span>
      </div>

    </div>
  );
}
