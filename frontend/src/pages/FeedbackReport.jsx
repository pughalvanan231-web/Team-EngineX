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
    <div className="w-full py-10 max-w-5xl mx-auto space-y-8 font-sans" style={{ color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>AI EVALUATION REPORT</span>
            <span>•</span>
            <span className="text-orange-500 font-semibold">{sessionId}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-headings)' }}>
            Skill Analytics & Final Result
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Candidate: <strong style={{ color: 'var(--text-headings)' }}>{candidateName}</strong> ({candidateId}) — {jobRole}
          </p>
        </div>

        <button
          onClick={() => {
            if (onReset) onReset();
            else navigate('/candidates');
          }}
          className="px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm transition-all active:scale-[0.98] border"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-headings)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: 'var(--text-headings)' }} />
          <span>Back to Candidates</span>
        </button>
      </div>

      {/* Top Banner: Score & Performance Label Card */}
      <div className="p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-left" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>EVALUATION COMPLETE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-headings)' }}>
            {candidateName}
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {result.interviewer_summary || `${candidateName} completed the AI adaptive technical interview across 31-day curriculum focus areas.`}
          </p>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border text-center shrink-0 min-w-[200px]" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
          <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Overall Score</div>
          <div className="text-5xl font-extrabold font-mono text-orange-500 mt-1">
            {overallScore} <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div className="mt-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-semibold">
            {performanceLabel}
          </div>
        </div>
      </div>

      {/* Score Breakdown Charts */}
      <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 text-left" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-headings)' }}>
          <BarChart2 className="w-5 h-5 text-orange-500" />
          <span>Category Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {Object.entries(categoryScores).map(([catName, scoreVal]) => (
            <div key={catName} className="p-3.5 rounded-2xl border space-y-1.5" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between font-semibold" style={{ color: 'var(--text-headings)' }}>
                <span>{catName}</span>
                <span className="font-mono text-indigo-500 font-bold">{scoreVal} / 100</span>
              </div>
              <div className="w-full rounded-full h-2 bg-slate-200 dark:bg-slate-800">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
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
        <div className="p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Validated Strengths</span>
          </div>
          <ul className="space-y-2 text-xs font-medium" style={{ color: 'var(--text-headings)' }}>
            {strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Identified Weaknesses</span>
          </div>
          <ul className="space-y-2 text-xs font-medium" style={{ color: 'var(--text-headings)' }}>
            {weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Knowledge Gaps */}
      <div className="p-6 rounded-3xl border shadow-sm space-y-4 text-left" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-base font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-headings)' }}>
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <span>Knowledge Gaps</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {knowledgeGaps.map((gap, i) => (
            <li key={i} className="p-3 rounded-2xl border font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-headings)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Previously Skipped & Missing Analysis Section */}
      <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 text-left" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div>
          <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-headings)' }}>
            Prior Learning Evidence Analysis
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Explicit analysis of topics prioritized due to limited prior evidence.
          </p>
        </div>

        <div className="p-5 rounded-2xl border space-y-6 text-xs" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
          {/* Skipped */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-xs uppercase flex items-center gap-2 text-rose-500">
              <span>Previously Skipped Topics</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skippedAnalysis.map((sk, idx) => (
                <div key={idx} className="p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <h5 className="font-bold text-xs" style={{ color: 'var(--text-headings)' }}>Day {sk.day}: {sk.topic}</h5>
                  <p className="italic text-[11px]" style={{ color: 'var(--text-muted)' }}>{sk.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-color)' }} />

          {/* Missing */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-xs uppercase flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <span>Previously Missing Curriculum Signals</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missingAnalysis.map((ms, idx) => (
                <div key={idx} className="p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <h5 className="font-bold text-xs" style={{ color: 'var(--text-headings)' }}>Day {ms.day}: {ms.topic}</h5>
                  <p className="italic text-[11px]" style={{ color: 'var(--text-muted)' }}>{ms.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 text-left" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div>
          <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-headings)' }}>
            Question-by-Question Review
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Expandable breakdown of questions, answers, AI evaluations, and priority selection reasons.
          </p>
        </div>

        <div className="space-y-3">
          {questionReviews.map((qr, idx) => (
            <div key={idx} className="border rounded-2xl overflow-hidden text-xs" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full p-4 flex items-center justify-between text-left transition-colors"
                style={{ backgroundColor: 'var(--panel-bg)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center">
                    Q{qr.question_number || idx + 1}
                  </span>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--text-headings)' }}>{qr.topic}</div>
                    <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      Category: {qr.priorityCategory || 'GENERAL'} · Score: {qr.evaluation_score || 80}/100
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(() => {
                    const cls = (qr.classification || 'STRONG').toUpperCase();
                    let badgeClass = "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300";
                    if (cls === 'WEAK') {
                      badgeClass = "text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300";
                    } else if (cls === 'MODERATE' || cls === 'AVERAGE') {
                      badgeClass = "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300";
                    }
                    return (
                      <span className={`px-3 py-1 rounded-full border font-semibold font-mono text-[10px] ${badgeClass}`} style={{ borderColor: 'var(--border-color)' }}>
                        {cls}
                      </span>
                    );
                  })()}
                  {expandedQuestion === idx ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                </div>
              </button>

              {expandedQuestion === idx && (
                <div className="p-4 space-y-3 border-t text-[13px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  <div>
                    <div className="font-bold text-xs mb-1" style={{ color: 'var(--text-headings)' }}>Question:</div>
                    <p className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>{qr.question}</p>
                  </div>

                  <div>
                    <div className="font-bold text-xs mb-1" style={{ color: 'var(--text-headings)' }}>Candidate Answer:</div>
                    <p className="p-3 rounded-xl border leading-relaxed" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>{qr.answer}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-500/20 text-[11px]">
                    <div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Selection Reason: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{qr.reason}</span>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">AI Feedback: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{qr.feedback}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {questionReviews.length === 0 && (
            <div className="p-4 rounded-xl text-xs font-mono text-center border" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              No detailed per-question logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* Final Recommendation Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border shadow-sm space-y-4 text-left" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <h3 className="text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Final Hiring Recommendation
          </h3>
        </div>

        <div className="space-y-2">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-bold">
            {hiringRec.status}
          </div>
          <p className="text-sm leading-relaxed font-sans" style={{ color: 'var(--text-primary)' }}>
            {hiringRec.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
