import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Minus, ArrowRight, UserCheck, Calendar, Award, Code2, ChevronRight } from 'lucide-react';

export function CandidateOverview({ candidates = [], selectedCandidate, onSelectCandidate, curriculum }) {
  const navigate = useNavigate();

  // Normalize candidate fields
  const cand = selectedCandidate || (candidates.length > 0 ? candidates[0] : null);
  
  if (!cand) {
    return (
      <div className="py-20 text-center text-agent-secondary font-mono text-sm">
        Loading candidate profile...
      </div>
    );
  }

  const member = cand.member || {
    id: cand.candidate_id || "CAND-001",
    name: cand.name || "Sarah Johnson",
    jobRole: cand.role || "Senior Data Engineer",
    yearsExperience: 9,
    education: "MS Computer Science",
    status: "COMPLETED"
  };

  const signals = cand.signals || {
    commitDays: cand.completed_days?.length || 28,
    missionsCompleted: cand.completed_missions?.length || 24,
    missionsFirstTry: cand.learning_signals?.failed_attempts === 0 ? 20 : 18
  };

  const missionsList = cand.missions || cand.completed_missions || [];

  // Define 8 Cohort Modules
  const cohortModules = [
    { n: 1, title: "Environment & Tooling", daysRange: [1, 3] },
    { n: 2, title: "Data Foundations", daysRange: [4, 6] },
    { n: 3, title: "Embeddings & Vector Search", daysRange: [7, 10] },
    { n: 4, title: "LLM Core, Prompting & Fine-Tuning", daysRange: [11, 15] },
    { n: 5, title: "Chatbot Application Build", daysRange: [16, 20] },
    { n: 6, title: "Agentic AI & MCP", daysRange: [21, 24] },
    { n: 7, title: "Evaluation, Security & Deployment", daysRange: [25, 28] },
    { n: 8, title: "Production & Capstone", daysRange: [29, 31] },
  ];

  // Helper to get mission status for a given day
  const getDayStatus = (dayNum) => {
    const mission = missionsList.find(m => m.day === dayNum);
    if (mission) {
      if (mission.skipped) return 'skipped';
      if (mission.passed || mission.score > 0) return 'completed';
    }
    if (cand.completed_days && cand.completed_days.includes(dayNum)) return 'completed';
    if (cand.skipped_days && cand.skipped_days.includes(dayNum)) return 'skipped';
    return dayNum <= 24 ? 'completed' : 'pending';
  };

  return (
    <div className="w-full py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header & Candidate Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-agent-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-agent-secondary mb-1">
            <span>CANDIDATE PROFILE</span>
            <span>•</span>
            <span className="text-agent-accent">{member.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-agent-text tracking-tight">
            Welcome, {member.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-agent-secondary mt-0.5 font-mono">
            {member.jobRole}
          </p>
        </div>

        {/* Switch Candidate dropdown if multiple available */}
        {candidates.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-agent-muted">Select Candidate:</span>
            <select
              value={member.id}
              onChange={(e) => {
                const selected = candidates.find(c => (c.member?.id || c.candidate_id) === e.target.value);
                if (selected) onSelectCandidate(selected);
              }}
              className="bg-agent-surface border border-agent-border text-agent-text text-xs font-mono rounded-md px-3 py-1.5 focus:outline-none focus:border-agent-accent"
            >
              {candidates.map(c => {
                const cId = c.member?.id || c.candidate_id;
                const cName = c.member?.name || c.name;
                return (
                  <option key={cId} value={cId}>
                    {cName} ({cId})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Candidate Profile Details & Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="p-5 rounded-lg bg-agent-surface border border-agent-border space-y-4">
          <div className="text-xs font-mono text-agent-muted uppercase tracking-wider">
            Background Information
          </div>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-agent-borderMuted">
              <span className="text-agent-secondary">Candidate ID</span>
              <span className="text-agent-text font-medium">{member.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-agent-borderMuted">
              <span className="text-agent-secondary">Experience</span>
              <span className="text-agent-text font-medium">{member.yearsExperience || 2} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-agent-borderMuted">
              <span className="text-agent-secondary">Education</span>
              <span className="text-agent-text font-medium truncate max-w-[140px]" title={member.education}>
                {member.education || 'Computer Science'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-agent-secondary">Status</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {member.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Progress Stats Grid (2 Cols across remaining 2/3) */}
        <div className="md:col-span-2 p-5 rounded-lg bg-agent-surface border border-agent-border space-y-4">
          <div className="text-xs font-mono text-agent-muted uppercase tracking-wider">
            Learning Progress
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted">
              <div className="text-[11px] font-mono text-agent-secondary uppercase">Missions</div>
              <div className="text-xl font-bold text-agent-text font-mono mt-1">
                {signals.missionsCompleted || 24} <span className="text-xs text-agent-muted font-normal">/ 31</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted">
              <div className="text-[11px] font-mono text-agent-secondary uppercase">First Try</div>
              <div className="text-xl font-bold text-agent-text font-mono mt-1">
                {signals.missionsFirstTry || 18}
              </div>
            </div>

            <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted">
              <div className="text-[11px] font-mono text-agent-secondary uppercase">Commit Days</div>
              <div className="text-xl font-bold text-agent-text font-mono mt-1">
                {signals.commitDays || 27}
              </div>
            </div>

            <div className="p-3.5 rounded bg-agent-elevated border border-agent-borderMuted">
              <div className="text-[11px] font-mono text-agent-secondary uppercase">Topics</div>
              <div className="text-xl font-bold text-agent-text font-mono mt-1">
                31
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 31-Day Cohort Learning Journey Timeline */}
      <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-agent-text font-mono uppercase tracking-wide">
              31-Day Cohort Journey
            </h3>
            <p className="text-xs text-agent-secondary mt-0.5">
              Structured learning modules and completed practical missions
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-agent-secondary">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-agent-muted" /> Skipped
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-agent-accent" /> In Progress
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cohortModules.map((mod) => (
            <div 
              key={mod.n}
              className="p-4 rounded bg-agent-elevated border border-agent-border hover:border-agent-borderMuted transition-colors space-y-3"
            >
              <div className="flex items-center justify-between border-b border-agent-borderMuted pb-2">
                <span className="text-[11px] font-mono font-semibold text-agent-accent">
                  Module {mod.n}
                </span>
                <span className="text-[10px] font-mono text-agent-muted">
                  Days {mod.daysRange[0]}–{mod.daysRange[1]}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-agent-text line-clamp-1" title={mod.title}>
                {mod.title}
              </h4>
              
              {/* Day status row */}
              <div className="flex items-center gap-1.5 pt-1">
                {Array.from({ length: mod.daysRange[1] - mod.daysRange[0] + 1 }).map((_, idx) => {
                  const dayNum = mod.daysRange[0] + idx;
                  const st = getDayStatus(dayNum);
                  return (
                    <div 
                      key={dayNum}
                      className="flex-1 flex flex-col items-center gap-1 p-1 rounded bg-agent-bg/50 border border-agent-borderMuted text-[10px] font-mono"
                      title={`Day ${dayNum}: ${st}`}
                    >
                      <span className="text-agent-muted text-[9px]">D{dayNum}</span>
                      {st === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {st === 'skipped' && <Minus className="w-3 h-3 text-agent-muted" />}
                      {st === 'pending' && <span className="w-2 h-2 rounded-full bg-agent-accent/70" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => navigate('/prep')}
          className="px-6 py-3 rounded-lg bg-agent-accent text-white font-medium text-sm hover:bg-agent-accentHover transition-colors flex items-center gap-2 shadow-subtle"
        >
          <span>Continue to Interview Preparation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
