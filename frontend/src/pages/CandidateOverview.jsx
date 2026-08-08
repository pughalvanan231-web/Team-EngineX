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
          const found = candidates.find(c => (c.member?.id || c.candidate_id) === activeCandId);
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Visual Banner Profile (Optimized Layout) */}
        <div className="lg:col-span-7 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden flex flex-col justify-between relative min-h-[380px]">
          <div className="p-8 space-y-6 z-10 text-left">
            <span className="text-xs uppercase tracking-widest text-[#5E6C55] font-mono font-bold block">
              Candidate Profile
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-headings)]">
                {cand.name}
              </h1>
              <p className="text-sm text-[var(--text-muted)] font-medium">
                {cand.role} &middot; {cand.experience} Years Exp
              </p>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleStartInterview}
                disabled={startingInterview}
                className="px-6 py-2.5 rounded-lg bg-white text-black hover:bg-slate-100 font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
              >
                {startingInterview ? "Building Interview..." : "Start Now"}
              </button>
            </div>
          </div>
          
          {/* Overlay Profile Image aligned on right edge (Dynamic Unique Local Renders) */}
          <div className="absolute right-0 bottom-0 h-full w-[45%] z-0 pointer-events-none opacity-90">
            <img 
              src={
                (() => {
                  const nameLower = (cand.name || "").toLowerCase();
                  const femaleNames = ["sarah", "emily", "wendy", "zara", "mia", "bethany", "isabella", "diane", "priyanka", "jessica", "lisa", "anna"];
                  const isFemale = femaleNames.some(fn => nameLower.includes(fn));

                  const femaleImages = [
                    "/src/assets/candidates image/images (7).jpg",
                    "/src/assets/candidates image/businesswomen.jpg",
                    "/src/assets/candidates image/images (9).jpg",
                    "/src/assets/candidates image/images (8).jpg",
                    "/src/assets/candidates image/003.avif"
                  ];

                  const maleImages = [
                    "/src/assets/candidates image/001.png",
                    "/src/assets/candidates image/004.jpg",
                    "/src/assets/candidates image/005.avif",
                    "/src/assets/candidates image/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.avif",
                    "/src/assets/candidates image/confident-businessman-smiling-with-arms-crossed-conveying-professionalism-and-success-photo.jpg",
                    "/src/assets/candidates image/depositphotos_126047328-stock-photo-handsome-business-man.jpg",
                    "/src/assets/candidates image/images (2).jpg",
                    "/src/assets/candidates image/images (3).jpg",
                    "/src/assets/candidates image/images (4).jpg",
                    "/src/assets/candidates image/images (5).jpg",
                    "/src/assets/candidates image/images (6).jpg",
                    "/src/assets/candidates image/images.jpg",
                    "/src/assets/candidates image/portrait-young-handsome-man-jean-shirt-smiling-with-crossed-arms_176420-12083.avif",
                    "/src/assets/candidates image/serious-indian-professional-business-man-office-portrait-serious-young-ambitious-indian-businessman-project-leader-dressed-367980912.webp"
                  ];

                  // Use a simple hash of the name to pick a consistent image
                  let hash = 0;
                  for (let i = 0; i < nameLower.length; i++) {
                    hash = nameLower.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  hash = Math.abs(hash);

                  if (isFemale) {
                    return femaleImages[hash % femaleImages.length];
                  } else {
                    return maleImages[hash % maleImages.length];
                  }
                })()
              } 
              alt={cand.name} 
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--card-bg)] via-[var(--card-bg)]/40 to-transparent" />
          </div>

          {/* Bottom frosted analytics line */}
          <div className="w-full bg-[var(--panel-bg)] border-t border-[var(--border-color)] px-8 py-5 flex items-center justify-between text-xs font-mono font-bold z-10">
            <div>
              <span className="block text-[10px] text-[var(--text-muted)] uppercase">Active Days</span>
              <span className="text-base text-[var(--text-headings)]">{stats.completedDays}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--text-muted)] uppercase">Missions</span>
              <span className="text-base text-[var(--text-headings)]">{stats.totalDays}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--text-muted)] uppercase">First Try</span>
              <span className="text-base text-[var(--text-headings)]">{stats.passedDays}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--text-muted)] uppercase">Avg Attempts</span>
              <span className="text-base text-[var(--text-headings)]">{stats.avgAttempts}</span>
            </div>
          </div>
        </div>

        {/* Right Dashboard Statistics (Active telemetry) */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-6">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Curriculum Mastery & Progress
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[var(--text-headings)] mb-1">
                  <span>Overall Completion</span>
                  <span className="font-mono text-[#EA580C] font-bold">{stats.completionPct}%</span>
                </div>
                <div className="w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-full h-2">
                  <div className="bg-[#EA580C] h-2 rounded-full" style={{ width: `${stats.completionPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[var(--text-headings)] mb-1">
                  <span>Pass Rate</span>
                  <span className="font-mono text-[#10B981] font-bold">{stats.passPct}%</span>
                </div>
                <div className="w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-full h-2">
                  <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${stats.passPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-center">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Strong Signals</div>
              <div className="text-lg font-bold text-[#10B981] font-mono mt-0.5">{strongAreas.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-center">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">High Attempts</div>
              <div className="text-lg font-bold text-[#F59E0B] font-mono mt-0.5">{highAttemptAreas.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-center">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Skipped</div>
              <div className="text-lg font-bold text-[#EF4444] font-mono mt-0.5">{stats.skippedDays}</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-center">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Missing Days</div>
              <div className="text-lg font-bold text-[var(--text-muted)] font-mono mt-0.5">{stats.missingDays}</div>
            </div>
          </div>
        </div>
      </div>


      {/* Skill Signals Section */}
      <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-6">
        <h3 className="text-base font-bold text-[var(--text-headings)] tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#EA580C]" />
          <span>Skill Signals Distribution & Analytics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: SVG Donut Chart */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" />
                
                {/* Strong Segment (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray={`${Math.max(5, (strongAreas.length / 10) * 251.2)} 251.2`}
                  strokeDashoffset="0"
                />

                {/* High Segment (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  strokeDasharray={`${Math.max(5, (highAttemptAreas.length / 10) * 251.2)} 251.2`}
                  strokeDashoffset={`-${(strongAreas.length / 10) * 251.2}`}
                />

                {/* Skipped Segment (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="10"
                  strokeDasharray={`${Math.max(5, ((skippedAreas.length + missingAreas.length) / 10) * 251.2)} 251.2`}
                  strokeDashoffset={`-${((strongAreas.length + highAttemptAreas.length) / 10) * 251.2}`}
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[var(--text-headings)]">
                  {strongAreas.length + highAttemptAreas.length + skippedAreas.length}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Signals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry list details */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Strong Areas Info */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800 space-y-2 text-left">
              <div className="font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strong Areas ({strongAreas.length})</span>
              </div>
              <ul className="space-y-1 text-white pl-1 text-[11px]">
                {strongAreas.slice(0, 3).map(a => (
                  <li key={a.day} className="truncate">✓ Day {a.day}: {a.title}</li>
                ))}
                {strongAreas.length === 0 && <li className="text-white/60 italic">None</li>}
              </ul>
            </div>

            {/* High Attempt Info */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800 space-y-2 text-left">
              <div className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>High-Attempt ({highAttemptAreas.length})</span>
              </div>
              <ul className="space-y-1 text-white pl-1 text-[11px]">
                {highAttemptAreas.slice(0, 3).map(a => (
                  <li key={a.day} className="truncate">⚠ Day {a.day}: {a.title}</li>
                ))}
                {highAttemptAreas.length === 0 && <li className="text-white/60 italic">None</li>}
              </ul>
            </div>

            {/* Skipped Info */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800 space-y-2 text-left">
              <div className="font-mono text-rose-350 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Skipped/Missing ({skippedAreas.length + missingAreas.length})</span>
              </div>
              <ul className="space-y-1 text-white pl-1 text-[11px]">
                {skippedAreas.slice(0, 2).map(a => (
                  <li key={a.day} className="truncate">! Day {a.day}: {a.title}</li>
                ))}
                {missingAreas.slice(0, 1).map(a => (
                  <li key={a.day} className="truncate">? Day {a.day}: {a.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Interview AI Priority Analysis Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-300 font-mono text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI PRIORITY ENGINE</span>
            </div>
            <h3 className="text-xl font-extrabold text-[var(--text-headings)] tracking-tight">
              Pre-Interview Priority Analysis
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Structured 5-tier candidate focus queue automatically derived from learning history.
            </p>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--panel-bg)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Top Priority: <span className="font-bold text-[#EA580C]">{priorityAnalysis[0]?.topic || 'Security'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorityAnalysis.slice(0, 6).map((item, idx) => {
            const categoryColors = {
              SKIPPED: "bg-rose-600 border-rose-700 text-white",
              HIGH_ATTEMPTS: "bg-amber-600 border-amber-700 text-white",
              MEDIUM_ATTEMPTS: "bg-blue-600 border-blue-700 text-white",
              LOW_ATTEMPTS: "bg-emerald-600 border-emerald-700 text-white",
              MISSING: "bg-slate-500 border-slate-600 text-white"
            };

            return (
              <div
                key={idx}
                className="card-surface p-5 flex flex-col justify-between space-y-4 text-left group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#EA580C] text-white font-mono text-xs font-bold flex items-center justify-center shadow-sm">
                      {item.priority || idx + 1}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] font-bold">
                      DAY {item.day}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[var(--text-headings)] tracking-tight leading-snug group-hover:text-[#EA580C] transition-colors">
                      {item.topic}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${categoryColors[item.category] || "bg-[var(--panel-bg)] text-[var(--text-headings)]"}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize px-2 py-0.5 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded">
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
