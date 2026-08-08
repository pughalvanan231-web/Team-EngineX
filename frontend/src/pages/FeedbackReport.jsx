import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Sparkles, Layers, ListOrdered, RotateCcw } from 'lucide-react';

export function FeedbackReport({ state, onReset }) {
  const navigate = useNavigate();

  const feedback = state?.final_feedback || {};
  const candidateName = state?.candidate_name || "Sarah Johnson";

  const summary = feedback.summary || feedback.interviewer_summary || 
    "The candidate showed exceptional command over RAG architectures, vector similarity search, and prompt template engineering. Responses clearly articulated trade-offs when choosing vector databases vs SQLite structured indexing.";

  const strengths = feedback.strengths && feedback.strengths.length > 0 
    ? feedback.strengths 
    : [
        "In-depth understanding of RAG architecture and chunk overlap strategies",
        "Clear explanation of engineering trade-offs when choosing vector similarity indexes",
        "Structured communication and problem-solving methodology"
      ];

  const gaps = feedback.gaps || feedback.weaknesses || [
    "Vector database internals (e.g. HNSW indexing fine-tuning) need deeper elaboration",
    "Production deployment strategies and latency evaluation under concurrency could be expanded"
  ];

  const nextSteps = feedback.next || feedback.recommendations || [
    "Review vector indexing strategies and benchmark HNSW parameter tuning",
    "Practice explaining high-concurrency production deployments in technical interviews",
    "Build a small evaluation pipeline using automated RAG metrics tools"
  ];

  const coveredDays = state?.curriculum_days_covered || [7, 8, 10, 12, 16, 22, 23, 28];

  const daysLabelMap = {
    1: "VS Code & Python Environment Setup",
    4: "Reading & Processing Structured Data",
    7: "Embeddings Explained",
    8: "Vector Databases Overview",
    10: "The Retrieval & Matching Engine",
    12: "Prompt Engineering Fundamentals",
    16: "Chatbot Application Build",
    22: "Multi-Agent Orchestration",
    23: "Model Context Protocol (MCP)",
    28: "Evaluation, Security & Deployment",
    31: "Production & Capstone"
  };

  return (
    <div className="w-full py-10 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-agent-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-agent-secondary mb-1">
            <span>EVALUATION REPORT</span>
            <span>•</span>
            <span className="text-agent-accent">{state?.interview_id || 'int_session'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-agent-text tracking-tight">
            Interview Feedback
          </h1>
          <p className="text-sm text-agent-secondary mt-0.5 font-mono">
            Candidate: <strong className="text-agent-text">{candidateName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded bg-agent-surface border border-agent-border hover:border-agent-borderMuted text-agent-secondary hover:text-agent-text text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Overall Summary Section */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-3">
        <h3 className="text-xs font-mono font-semibold text-agent-accentLight uppercase tracking-wider">
          Overall Summary
        </h3>
        <p className="text-sm sm:text-base text-agent-text leading-relaxed font-normal">
          {summary}
        </p>
      </div>

      {/* 21. Minimal Feedback Visualization */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
        <h3 className="text-xs font-mono font-semibold text-agent-muted uppercase tracking-wider">
          Technical Evaluation Breakdown
        </h3>

        <div className="space-y-3 text-xs font-mono">
          
          <div>
            <div className="flex justify-between text-agent-secondary mb-1">
              <span>Technical Depth</span>
              <span className="text-agent-text">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded bg-agent-elevated overflow-hidden">
              <div className="h-full bg-agent-accent rounded" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-agent-secondary mb-1">
              <span>Communication</span>
              <span className="text-agent-text">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded bg-agent-elevated overflow-hidden">
              <div className="h-full bg-agent-accent rounded" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-agent-secondary mb-1">
              <span>Architecture & Trade-offs</span>
              <span className="text-agent-text">9 / 10</span>
            </div>
            <div className="w-full h-2 rounded bg-agent-elevated overflow-hidden">
              <div className="h-full bg-emerald-500 rounded" style={{ width: '90%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-agent-secondary mb-1">
              <span>Problem Solving</span>
              <span className="text-agent-text">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded bg-agent-elevated overflow-hidden">
              <div className="h-full bg-agent-accent rounded" style={{ width: '80%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Strengths & Gaps 2-Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-semibold text-agent-text uppercase tracking-wider">
              Key Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-agent-text leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-semibold text-agent-text uppercase tracking-wider">
              Areas for Improvement (Gaps)
            </h3>
          </div>
          <ul className="space-y-3">
            {gaps.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-agent-text leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Recommended Next Steps */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-agent-accentLight" />
          <h3 className="text-xs font-mono font-semibold text-agent-text uppercase tracking-wider">
            Recommended Next Steps
          </h3>
        </div>
        <ol className="space-y-3 font-sans text-xs">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-agent-text leading-relaxed p-3 rounded bg-agent-elevated border border-agent-borderMuted">
              <span className="font-mono text-agent-accent font-bold">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 22. Curriculum Coverage */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold text-agent-text uppercase tracking-wider">
            Curriculum Coverage
          </h3>
          <span className="text-[11px] font-mono text-agent-muted">
            {coveredDays.length} topics evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {coveredDays.map((d) => (
            <div key={d} className="p-2.5 rounded bg-agent-elevated border border-agent-borderMuted flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-agent-text truncate">
                Day {d} — {daysLabelMap[d] || `Topic Day ${d}`}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
