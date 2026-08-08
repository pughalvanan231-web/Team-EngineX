import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, RotateCcw, ChevronDown, ChevronUp, Sparkles, HelpCircle, BarChart2, ShieldCheck } from 'lucide-react';
import { fetchInterviewResult } from '../services/api';

export function FeedbackReport({ state: propState, onReset }) {
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  const [resultData, setResultData] = useState(propState?.final_feedback || propState?.final_result || null);
  const [loading, setLoading] = useState(!resultData);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const sessionId = routeSessionId || propState?.interview_id || propState?.sessionId;

  useEffect(() => {
    async function loadResult() {
      if (sessionId) {
        setLoading(true);
        const fetched = await fetchInterviewResult(sessionId);
        if (fetched) {
          setResultData(fetched);
        }
        setLoading(false);
      }
    }
    loadResult();
  }, [sessionId]);

  const result = resultData || propState?.final_feedback || propState?.final_result || {};

  const candidateName = result.candidateName || propState?.candidate_name || "Sarah Johnson";
  const candidateId = result.candidateId || propState?.candidate_id || "CAND-001";
  const jobRole = result.jobRole || propState?.job_role || "AI Engineer";

  const overallScore = result.overallScore ?? result.overall_score ?? 82;
  const performanceLabel = result.performanceLabel || (overallScore >= 88 ? "Exceptional Candidate" : overallScore >= 76 ? "Strong Candidate" : overallScore >= 65 ? "Moderate Candidate" : "Needs Improvement");

  const categoryScores = result.categoryScores || result.category_scores || {
    "Technical Correctness": 86,
    "Conceptual Depth": 78,
    "Practical Understanding": 84,
    "Engineering Reasoning": 80,
    "Communication": 88
  };

  const strengths = result.strengths || [
    "Strong API and backend architecture comprehension",
    "Clear technical reasoning and structured communication",
    "Good practical understanding of vector embeddings & RAG retrieval"
  ];

  const weaknesses = result.weaknesses || [
    "Could elaborate more on edge-case concurrency under heavy load",
    "Vector index HNSW tuning parameters can be explored in deeper detail"
  ];

  const knowledgeGaps = result.knowledgeGaps || [
    "Kubernetes deployment strategies",
    "Advanced retrieval optimization",
    "Multi-agent failure handling"
  ];

  const skippedAnalysis = result.skippedTopicsAnalysis || [
    { topic: "Monitoring, Logging & Observability", day: 29, note: "These areas had limited prior learning evidence and were therefore prioritized for interview validation." }
  ];

  const missingAnalysis = result.missingSignalsAnalysis || [
    { topic: "Distributed Systems & Scalability", day: 5, note: "These curriculum days were unrecorded in the candidate's learning log and were prioritized as baseline verification signals." }
  ];

  const questionReviews = result.questionReviews || propState?.question_reviews || [];
  const hiringRec = result.hiringRecommendation || {
    status: overallScore >= 76 ? "Recommended" : "Consider with Reservations",
    summary: "Candidate demonstrates strong practical engineering knowledge with good adaptability across AI infrastructure and backend systems."
  };

  const toggleExpand = (idx) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  return (
    <div className="w-full py-10 max-w-5xl mx-auto space-y-8 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-1">
            <span>AI EVALUATION REPORT</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">{sessionId}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Skill Analytics & Final Result
          </h1>
          <p className="text-sm text-slate-200">
            Candidate: <strong className="text-white">{candidateName}</strong> ({candidateId}) — {jobRole}
          </p>
        </div>

        <button
          onClick={() => navigate('/candidates')}
          className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-md transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Back to Candidates</span>
        </button>
      </div>

      {/* Top Banner: Score & Performance Label Card */}
      <div className="p-8 rounded-3xl bg-[#1d2d35]/90 border border-white/10 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-left">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>EVALUATION COMPLETE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {candidateName}
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            {result.interviewer_summary || `${candidateName} completed the AI adaptive technical interview across 31-day curriculum focus areas.`}
          </p>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center shrink-0 min-w-[200px]">
          <div className="text-xs font-mono text-white/60 uppercase tracking-widest font-semibold">Overall Score</div>
          <div className="text-5xl font-extrabold font-mono text-orange-400 mt-1">
            {overallScore} <span className="text-base text-white/50 font-normal">/ 100</span>
          </div>
          <div className="mt-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-semibold">
            {performanceLabel}
          </div>
        </div>
      </div>

      {/* Score Breakdown Charts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#272d1f]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-5 text-left">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-orange-400" />
          <span>Category Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {Object.entries(categoryScores).map(([catName, scoreVal]) => (
            <div key={catName} className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
              <div className="flex justify-between font-semibold text-white/80">
                <span>{catName}</span>
                <span className="font-mono text-indigo-300 font-bold">{scoreVal} / 100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-indigo-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Validated Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-white/95 font-medium">
            {strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Identified Weaknesses</span>
          </div>
          <ul className="space-y-2 text-xs text-white/95 font-medium">
            {weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Knowledge Gaps */}
      <div className="p-6 rounded-3xl bg-[#1d2d35]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-4 text-left">
        <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Knowledge Gaps</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {knowledgeGaps.map((gap, i) => (
            <li key={i} className="p-3 rounded-2xl bg-black/25 border border-white/10 text-white font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Previously Skipped & Missing Analysis Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#272d1f]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-6 text-left">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Prior Learning Evidence Analysis
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Explicit analysis of topics prioritized due to limited prior evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Skipped */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <h4 className="font-bold font-mono text-xs uppercase flex items-center gap-2 text-rose-350">
              <span>Previously Skipped Topics</span>
            </h4>
            {skippedAnalysis.map((sk, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/10 text-white space-y-1">
                <div className="font-semibold text-white/95">Day {sk.day}: {sk.topic}</div>
                <p className="text-white/60 italic text-[11px]">{sk.note}</p>
              </div>
            ))}
          </div>

          {/* Missing */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <h4 className="font-bold font-mono text-xs uppercase flex items-center gap-2 text-white/80">
              <span>Previously Missing Curriculum Signals</span>
            </h4>
            {missingAnalysis.map((ms, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/10 text-white space-y-1">
                <div className="font-semibold text-white/95">Day {ms.day}: {ms.topic}</div>
                <p className="text-white/60 italic text-[11px]">{ms.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1d2d35]/75 border border-white/10 backdrop-blur-md shadow-lg space-y-6 text-left">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Question-by-Question Review
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Expandable breakdown of questions, answers, AI evaluations, and priority selection reasons.
          </p>
        </div>

        <div className="space-y-3">
          {questionReviews.map((qr, idx) => (
            <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden text-xs">
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center">
                    Q{qr.question_number || idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-white">{qr.topic}</div>
                    <div className="text-[11px] text-white/60 font-mono">
                      Category: {qr.priorityCategory || 'GENERAL'} · Score: {qr.evaluation_score || 80}/100
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-black/45 border border-white/10 font-semibold font-mono text-indigo-300">
                    {qr.classification || 'STRONG'}
                  </span>
                  {expandedQuestion === idx ? <ChevronUp className="w-4 h-4 text-white/60" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
                </div>
              </button>

              {expandedQuestion === idx && (
                <div className="p-4 bg-black/20 space-y-3 border-t border-white/10 text-white/90">
                  <div>
                    <div className="font-bold text-white text-xs mb-1">Question:</div>
                    <p className="p-3 rounded-xl bg-black/30 text-white">{qr.question}</p>
                  </div>

                  <div>
                    <div className="font-bold text-white text-xs mb-1">Candidate Answer:</div>
                    <p className="p-3 rounded-xl bg-black/40 text-white leading-relaxed">{qr.answer}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px]">
                    <div>
                      <span className="font-bold text-indigo-300">Selection Reason: </span>
                      <span className="text-white/80">{qr.reason}</span>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-300">AI Feedback: </span>
                      <span className="text-white/80">{qr.feedback}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {questionReviews.length === 0 && (
            <div className="p-4 rounded-xl bg-black/25 text-white/50 text-xs font-mono text-center">
              No detailed per-question logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* Final Recommendation Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/80 to-indigo-950/80 border border-white/10 backdrop-blur-md text-white shadow-xl space-y-4 text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-200">
            Final Hiring Recommendation
          </h3>
        </div>

        <div className="space-y-2">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm font-bold">
            {hiringRec.status}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {hiringRec.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
