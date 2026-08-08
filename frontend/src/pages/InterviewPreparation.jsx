import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function InterviewPreparation({ candidate, onStartInterview, loading }) {
  const navigate = useNavigate();

  const handleBegin = async () => {
    const candId = candidate?.member?.id || candidate?.candidate_id || 'CAND-001';
    const state = await onStartInterview(candId, candidate);
    const sId = state?.interview_id || state?.sessionId || 'CAND-001';
    navigate(`/interview/${sId}`);
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
      <div className="text-center space-y-3 text-white">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERVIEW PREPARATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Personalized Technical Interview
        </h1>
        <p className="text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
          Tailored to your completed cohort missions, architectural choices, and candidate signals.
        </p>
      </div>

      {/* Summary Matrix Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#272d1f]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-6 text-white">
        <div className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider text-left">
          Interview Parameters
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1 text-left">
            <div className="text-white/50 text-[11px]">Questions</div>
            <div className="text-xl font-bold text-white">8+</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1 text-left">
            <div className="text-white/50 text-[11px]">Curriculum Target</div>
            <div className="text-xl font-bold text-white">4+ Days</div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-1 text-left">
            <div className="text-indigo-300 text-[11px]">Mode</div>
            <div className="text-xl font-bold text-indigo-400">Adaptive</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1 text-left">
            <div className="text-white/50 text-[11px]">Est. Time</div>
            <div className="text-xl font-bold text-white">15–20 min</div>
          </div>
        </div>
      </div>

      {/* Topics Likely to be Explored */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1d2d35]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-left">
            Topics Likely to be Explored
          </h3>
          <span className="text-[11px] font-mono text-white/50">Based on your completed missions</span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1 justify-start">
          {topicsList.map((topic, i) => (
            <span
              key={i}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Adaptive Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-100 flex items-start gap-3 shadow-sm text-left">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-bold">Adaptive Evaluation Engine:</span>
          <p className="mt-0.5 text-white/85">
            "The interviewer will adapt the conversation based on your answers. Questions escalate in technical depth when you answer strongly, or pivot to clarify foundational concepts."
          </p>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={handleBegin}
          disabled={loading}
          className="px-10 py-3.5 rounded-full bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
              <span>Initializing Engine...</span>
            </>
          ) : (
            <>
              <span>Begin Interview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        <span className="text-xs font-mono text-white/60">
          Session state will be saved automatically throughout the interview
        </span>
      </div>

    </div>
  );
}
