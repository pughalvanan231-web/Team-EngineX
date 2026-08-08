import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, X, UserCheck, Sparkles } from 'lucide-react';
import { fetchCandidates } from '../services/api';

export function Candidates({ candidates: initialCandidates, onSelectCandidate }) {
  const [candidates, setCandidates] = useState(initialCandidates || []);
  const [loading, setLoading] = useState(!initialCandidates || initialCandidates.length === 0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCandidates();
        if (data && data.length > 0) {
          setCandidates(data);
        }
      } catch (err) {
        console.error('Failed to load candidate list:', err);
        setError('Could not load candidates dynamically.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleReadMore = (cand) => {
    const candId = cand.member?.id || cand.candidate_id || cand.id;
    if (onSelectCandidate) onSelectCandidate(cand);
    navigate(`/candidates/${candId}`);
  };

  return (
    <div className="w-full py-10 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="chip-neon-indigo mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COHORT ASSESSMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select a Candidate
          </h1>
          <p className="text-sm text-slate-400">
            Choose a candidate to view their 31-day curriculum progress, 5-tier AI priority queue, and start an adaptive interview.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-glass-secondary px-5 py-2 text-xs self-start sm:self-auto"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400 font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading candidate profiles...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => {
            const member = c.member || {
              id: c.candidate_id || c.id || "CAND-001",
              name: c.name || "Sarah Johnson",
              jobRole: c.role || c.jobRole || "AI Engineer",
              yearsExperience: c.yearsExperience || c.experience || 4,
            };

            const stats = c.stats || {
              completedDays: c.missions?.filter(m => m.passed && !m.skipped)?.length || 24,
              skippedDays: c.missions?.filter(m => m.skipped)?.length || 2,
              avgAttempts: c.stats?.avgAttempts || 2.1,
            };

            const skillsSummary = c.missions
              ? c.missions.filter(m => m.passed && !m.skipped).slice(0, 3).map(m => m.title.replace(' Explained', '').replace(' Overview', '')).join(' · ')
              : "Embeddings · RAG · Micro-services";

            return (
              <div
                key={member.id}
                className="glass-card p-6 flex flex-col justify-between space-y-5 group"
              >
                {/* Top Badge & Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="chip-neon-indigo">
                      {member.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {member.yearsExperience} Yrs Experience
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {member.jobRole}
                    </p>
                  </div>
                </div>

                {/* Statistics Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Completed Syllabus</span>
                    <span className="font-bold text-emerald-400 font-mono">{stats.completedDays} / 31 days</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Skipped Topics</span>
                    <span className="font-bold text-amber-400 font-mono">{stats.skippedDays} days</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Avg Learning Friction</span>
                    <span className="font-bold text-indigo-400 font-mono">{stats.avgAttempts} attempts</span>
                  </div>
                </div>

                {/* Short Skill Summary */}
                <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                  <span className="font-semibold not-italic text-slate-300">Missions: </span>
                  {skillsSummary}
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => handleReadMore(c)}
                  className="btn-gradient-primary w-full py-3 text-xs"
                >
                  <span>Select Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
