import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Minus, ArrowRight, UserCheck, Calendar, Award, Code2, ChevronRight, Layers } from 'lucide-react';

export function CandidateOverview({ candidates = [], selectedCandidate, onSelectCandidate, curriculum }) {
  const navigate = useNavigate();

  // Normalize candidate fields
  const cand = selectedCandidate || (candidates.length > 0 ? candidates[0] : null);
  
  if (!cand) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono text-sm">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>CANDIDATE PROFILE</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">{member.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {member.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            {member.jobRole}
          </p>
        </div>

        {/* Switch Candidate dropdown */}
        {candidates.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Select Candidate:</span>
            <select
              value={member.id}
              onChange={(e) => {
                const selected = candidates.find(c => (c.member?.id || c.candidate_id) === e.target.value);
                if (selected) onSelectCandidate(selected);
              }}
              className="bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded-full px-4 py-2 shadow-sm focus:outline-none focus:border-indigo-500"
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Background Information
          </div>
          <div className="space-y-3 text-xs font-sans">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Candidate ID</span>
              <span className="text-slate-900 font-mono font-semibold">{member.id}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Experience</span>
              <span className="text-slate-900 font-semibold">{member.yearsExperience || 2} years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Education</span>
              <span className="text-slate-900 font-semibold truncate max-w-[140px]" title={member.education}>
                {member.education || 'Computer Science'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Status</span>
              <span className="px-3 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                {member.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Progress Stats Grid (2 Cols across remaining 2/3) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#F2F7F4] border border-emerald-100/90 shadow-card space-y-4">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
            Cohort Progress Metrics
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Missions</div>
              <div className="text-2xl font-extrabold text-slate-900 font-sans mt-1">
                {signals.missionsCompleted || 24} <span className="text-xs text-slate-400 font-normal">/ 31</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-[11px] font-mono text-slate-500 uppercase">First Try</div>
              <div className="text-2xl font-extrabold text-slate-900 font-sans mt-1">
                {signals.missionsFirstTry || 18}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Commit Days</div>
              <div className="text-2xl font-extrabold text-slate-900 font-sans mt-1">
                {signals.commitDays || 27}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Topics</div>
              <div className="text-2xl font-extrabold text-indigo-600 font-sans mt-1">
                31
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 31-Day Cohort Learning Journey Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              31-Day AI Cohort Journey
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured modules and evaluated technical missions
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="w-4 h-4 text-slate-400" /> Skipped
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> In Progress
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cohortModules.map((mod) => (
            <div 
              key={mod.n}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-mono font-bold text-indigo-600">
                  Module {mod.n}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Days {mod.daysRange[0]}–{mod.daysRange[1]}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={mod.title}>
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
                      className="flex-1 flex flex-col items-center gap-1 p-1 rounded-xl bg-white border border-slate-200/80 text-[10px] font-mono shadow-sm"
                      title={`Day ${dayNum}: ${st}`}
                    >
                      <span className="text-slate-400 text-[9px]">D{dayNum}</span>
                      {st === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {st === 'skipped' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                      {st === 'pending' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
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
          className="btn-pill-primary px-8 py-3.5 group shadow-md"
        >
          <span>Continue to Preparation</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
