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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>EVALUATION REPORT</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">{state?.interview_id || 'int_session'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview Feedback
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            Candidate: <strong className="text-slate-900">{candidateName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="btn-pill-ghost text-xs px-5 py-2.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Overall Summary Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-3">
        <h3 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
          Overall Summary
        </h3>
        <p className="text-base text-slate-900 leading-relaxed font-normal">
          {summary}
        </p>
      </div>

      {/* Technical Evaluation Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Technical Evaluation Breakdown
        </h3>

        <div className="space-y-3 text-xs font-mono">
          
          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Technical Depth</span>
              <span className="text-slate-900 font-bold">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Communication</span>
              <span className="text-slate-900 font-bold">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Architecture & Trade-offs</span>
              <span className="text-slate-900 font-bold">9 / 10</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Problem Solving</span>
              <span className="text-slate-900 font-bold">8 / 10</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Strengths & Gaps 2-Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F2F7F4] border border-emerald-100/90 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Key Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Areas for Improvement (Gaps)
            </h3>
          </div>
          <ul className="space-y-3">
            {gaps.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Recommended Next Steps */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            Recommended Next Steps
          </h3>
        </div>
        <ol className="space-y-3 font-sans text-xs">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-900 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-medium">
              <span className="font-mono text-indigo-600 font-extrabold">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Curriculum Coverage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            Curriculum Coverage
          </h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">
            {coveredDays.length} topics evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {coveredDays.map((d) => (
            <div key={d} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-900 font-semibold truncate">
                Day {d} — {daysLabelMap[d] || `Topic Day ${d}`}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
