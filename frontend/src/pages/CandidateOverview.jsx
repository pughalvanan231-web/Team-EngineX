import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Minus, ArrowRight, ShieldAlert, Award, Layers, Sparkles, RefreshCw, BarChart2, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
import { fetchCandidateAnalytics, startInterviewSession } from '../services/api';

export function CandidateOverview({ candidates = [], selectedCandidate, onSelectCandidate }) {
  const { candidateId: routeCandidateId } = useParams();
  const navigate = useNavigate();

  const activeCandId = routeCandidateId || selectedCandidate?.member?.id || selectedCandidate?.candidate_id || "CAND-001";
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchCandidateAnalytics(activeCandId);
        if (res && res.candidate) {
          setAnalyticsData(res);
        } else {
          // Fallback normalization if backend endpoint not active
          const found = candidates.find(c => (c.member?.id || c.candidate_id) === activeCandId) || candidates[0];
          setAnalyticsData({
            candidate: found ? (found.stats ? found : {
              candidate_id: activeCandId,
              name: found.member?.name || found.name || "Sarah Johnson",
              role: found.member?.jobRole || found.role || "Senior Data Engineer",
              experience: found.member?.yearsExperience || 4,
              education: found.member?.education || "Computer Science",
              stats: {
                totalDays: 31,
                completedDays: 24,
                passedDays: 22,
                failedDays: 2,
                skippedDays: 2,
                missingDays: 5,
                avgAttempts: 2.1,
                completionPct: 77,
                passPct: 91
              },
              normalizedDays: []
            }) : null,
            priorityAnalysis: [
              { topic: "Monitoring & Security", day: 29, category: "SKIPPED", priority: 1, reason: "No demonstrated completion", recommendedDifficulty: "medium" },
              { topic: "Prompt Engineering", day: 12, category: "HIGH_ATTEMPTS", attempts: 4, priority: 2, reason: "Highest learning friction", recommendedDifficulty: "medium" },
              { topic: "Docker & Kubernetes", day: 28, category: "MEDIUM_ATTEMPTS", attempts: 3, priority: 3, reason: "Moderate learning friction", recommendedDifficulty: "intermediate" },
              { topic: "Distributed Systems", day: 5, category: "MISSING", priority: 5, reason: "No detailed signal recorded", recommendedDifficulty: "fundamentals" }
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching candidate analytics:', err);
        setError('Failed to fetch candidate analytics.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [activeCandId]);

  const cand = analyticsData?.candidate;
  const stats = cand?.stats || {
    totalDays: 31,
    completedDays: 24,
    passedDays: 22,
    failedDays: 2,
    skippedDays: 2,
    missingDays: 5,
    avgAttempts: 2.1,
    completionPct: 77,
    passPct: 91
  };
  const priorityAnalysis = analyticsData?.priorityAnalysis || [];

  const handleStartInterview = async () => {
    try {
      setStartingInterview(true);
      const state = await startInterviewSession(activeCandId, cand);
      const sessionId = state?.interview_id || state?.session_id || state?.sessionId || `session_${Date.now()}`;
      navigate(`/interview/${sessionId}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      setError('Could not initialize interview session.');
    } finally {
      setStartingInterview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-orange-600" />
        <span>Analyzing candidate curriculum data & building AI priorities...</span>
      </div>
    );
  }

  if (!cand) {
    return (
      <div className="py-16 text-center text-slate-600 font-mono text-sm space-y-4">
        <div>Candidate profile {activeCandId} not found.</div>
        <button onClick={() => navigate('/candidates')} className="px-6 py-2 rounded-full bg-orange-600 text-white font-bold text-xs">
          Back to Candidates
        </button>
      </div>
    );
  }

  // Categorize normalized days for Skill Signals
  const normDays = cand.normalizedDays || [];
  const strongAreas = normDays.filter(d => d.status === 'PASSED' && d.attempts === 1);
  const moderateAreas = normDays.filter(d => d.status === 'PASSED' && (d.attempts === 2 || d.attempts === 3));
  const highAttemptAreas = normDays.filter(d => (d.status === 'PASSED' || d.status === 'FAILED') && d.attempts >= 4);
  const skippedAreas = normDays.filter(d => d.status === 'SKIPPED');
  const missingAreas = normDays.filter(d => d.status === 'MISSING');

  return (
    <div className="w-full py-10 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <button onClick={() => navigate('/candidates')} className="hover:text-orange-600 underline">Candidates</button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">{cand.candidate_id || activeCandId}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {cand.name}
          </h1>
          <p className="text-sm text-slate-600 font-medium flex items-center gap-3">
            <span>{cand.role}</span>
            <span>•</span>
            <span>{cand.experience} Years Experience</span>
            <span>•</span>
            <span className="text-orange-600 font-mono">{cand.education || 'CS / Engineering'}</span>
          </p>
        </div>

        {/* Start Interview CTA */}
        <button
          onClick={handleStartInterview}
          disabled={startingInterview}
          className="px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2.5 self-start md:self-auto"
        >
          {startingInterview ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Building AI Priority...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span>Start AI Interview</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono text-center">
          {error}
        </div>
      )}

      {/* Candidate Overview & Learning Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Stats Overview */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Learning Statistics
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Curriculum Days</span>
              <span className="text-slate-900 font-mono font-bold">31 Days</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Completed Days</span>
              <span className="text-slate-900 font-mono font-semibold">{stats.completedDays}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Passed Days</span>
              <span className="text-emerald-600 font-mono font-bold">{stats.passedDays}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Failed Days</span>
              <span className="text-rose-600 font-mono font-semibold">{stats.failedDays || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Explicitly Skipped Days</span>
              <span className="text-amber-600 font-mono font-semibold">{stats.skippedDays}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Missing / Unrecorded Days</span>
              <span className="text-slate-400 font-mono font-semibold">{stats.missingDays}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Average Attempts</span>
              <span className="text-indigo-600 font-mono font-bold">{stats.avgAttempts}</span>
            </div>
          </div>
        </div>

        {/* Progress Progress Bars / Metrics */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#F2F7F4] border border-emerald-100/90 shadow-card flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold mb-4">
              Curriculum Mastery & Progress
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Overall Curriculum Completion</span>
                  <span className="font-mono text-indigo-600 font-bold">{stats.completionPct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${stats.completionPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Pass Rate (Completed Modules)</span>
                  <span className="font-mono text-emerald-600 font-bold">{stats.passPct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${stats.passPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Strong Signals</div>
              <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{strongAreas.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">High Attempts</div>
              <div className="text-xl font-bold text-amber-600 font-mono mt-0.5">{highAttemptAreas.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Skipped</div>
              <div className="text-xl font-bold text-rose-600 font-mono mt-0.5">{stats.skippedDays}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Missing Days</div>
              <div className="text-xl font-bold text-slate-500 font-mono mt-0.5">{stats.missingDays}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Signals Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
          <span>Skill Signals Visualization</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Strong Areas */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="font-mono text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Areas (1 Attempt)</span>
            </div>
            <ul className="space-y-1 text-slate-700 font-medium pl-1">
              {strongAreas.slice(0, 5).map(a => (
                <li key={a.day} className="truncate">✓ Day {a.day}: {a.title}</li>
              ))}
              {strongAreas.length === 0 && <li className="text-slate-400 italic">None recorded</li>}
            </ul>
          </div>

          {/* High Attempt / Friction Areas */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <div className="font-mono text-amber-800 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>High-Attempt Areas (≥ 4 Attempts)</span>
            </div>
            <ul className="space-y-1 text-slate-700 font-medium pl-1">
              {highAttemptAreas.map(a => (
                <li key={a.day} className="truncate">⚠ Day {a.day}: {a.title} ({a.attempts} attempts)</li>
              ))}
              {highAttemptAreas.length === 0 && <li className="text-slate-400 italic">No high-attempt bottlenecks</li>}
            </ul>
          </div>

          {/* Skipped & Missing Areas */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
            <div className="font-mono text-rose-800 font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>Skipped & Missing Signals</span>
            </div>
            <ul className="space-y-1 text-slate-700 font-medium pl-1">
              {skippedAreas.map(a => (
                <li key={a.day} className="truncate text-rose-700 font-semibold">! Day {a.day}: {a.title} (Skipped)</li>
              ))}
              {missingAreas.slice(0, 3).map(a => (
                <li key={a.day} className="truncate text-slate-500">? Day {a.day}: {a.title} (Missing signal)</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pre-Interview AI Priority Analysis Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI PRIORITY ENGINE</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Pre-Interview Priority Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured 5-tier candidate focus queue automatically derived from learning history.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Top Priority: <span className="font-bold text-indigo-600">{priorityAnalysis[0]?.topic || 'Security'}</span>
          </div>
        </div>

        <div className="space-y-3">
          {priorityAnalysis.slice(0, 6).map((item, idx) => {
            const categoryColors = {
              SKIPPED: "bg-rose-50 border-rose-200 text-rose-700",
              HIGH_ATTEMPTS: "bg-amber-50 border-amber-200 text-amber-800",
              MEDIUM_ATTEMPTS: "bg-blue-50 border-blue-200 text-blue-800",
              LOW_ATTEMPTS: "bg-emerald-50 border-emerald-200 text-emerald-800",
              MISSING: "bg-slate-100 border-slate-300 text-slate-700"
            };

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {item.priority || idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                      <span className="text-[11px] font-mono text-slate-400">Day {item.day}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${categoryColors[item.category] || "bg-slate-100 text-slate-700"}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 capitalize px-2 py-1 bg-white border border-slate-200 rounded-lg">
                    {item.recommendedDifficulty || 'Medium'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Interview Footer Button */}
        <div className="pt-4 flex justify-end border-t border-slate-100">
          <button
            onClick={handleStartInterview}
            disabled={startingInterview}
            className="btn-pill-primary px-8 py-3.5 group shadow-md flex items-center gap-2"
          >
            {startingInterview ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Initializing Interview...</span>
              </>
            ) : (
              <>
                <span>Start Adaptive Interview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
