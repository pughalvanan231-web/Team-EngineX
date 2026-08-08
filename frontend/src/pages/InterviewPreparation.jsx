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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agent-surface border border-agent-border text-agent-accentLight text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERVIEW PREPARATION</span>
        </div>
        <h1 className="text-3xl font-bold text-agent-text tracking-tight">
          Your Personalized Technical Interview
        </h1>
        <p className="text-sm text-agent-secondary max-w-lg mx-auto">
          Tailored to your completed cohort missions, architectural choices, and candidate signals.
        </p>
      </div>

      {/* Summary Matrix Card */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-6">
        <div className="text-xs font-mono text-agent-muted uppercase tracking-wider">
          Interview Parameters
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-muted text-[11px]">Questions</div>
            <div className="text-lg font-bold text-agent-text">8+</div>
          </div>
          <div className="p-4 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-muted text-[11px]">Curriculum Target</div>
            <div className="text-lg font-bold text-agent-text">4+ Days</div>
          </div>
          <div className="p-4 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-muted text-[11px]">Mode</div>
            <div className="text-lg font-bold text-agent-accent">Adaptive</div>
          </div>
          <div className="p-4 rounded bg-agent-elevated border border-agent-borderMuted space-y-1">
            <div className="text-agent-muted text-[11px]">Est. Time</div>
            <div className="text-lg font-bold text-agent-text">15–20 min</div>
          </div>
        </div>
      </div>

      {/* Topics Likely to be Explored */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold text-agent-text uppercase tracking-wider">
            Topics Likely to be Explored
          </h3>
          <span className="text-[11px] font-mono text-agent-muted">Based on your completed missions</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {topicsList.map((topic, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded bg-agent-elevated border border-agent-borderMuted text-agent-text text-xs font-mono hover:border-agent-accent/40 transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Adaptive Disclaimer Box */}
      <div className="p-4 rounded-lg bg-agent-elevated/60 border border-agent-borderMuted text-xs font-mono text-agent-secondary flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-agent-accent shrink-0 mt-0.5" />
        <div>
          <span className="text-agent-text font-medium">Adaptive Evaluation Engine:</span>
          <p className="mt-0.5 text-agent-secondary">
            "The interviewer will adapt the conversation based on your answers. Questions escalate in technical depth when you answer strongly, or pivot to clarify foundational concepts."
          </p>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={handleBegin}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-agent-accent text-white font-semibold text-sm hover:bg-agent-accentHover disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Initializing Interview Engine...</span>
            </>
          ) : (
            <>
              <span>Begin Interview</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <span className="text-[11px] font-mono text-agent-muted">
          Session state will be saved automatically throughout the interview
        </span>
      </div>

    </div>
  );
}
