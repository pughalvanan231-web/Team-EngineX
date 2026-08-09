import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function Candidates({ candidates = [] }) {
  const [lookupError, setLookupError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="w-full py-20 max-w-6xl mx-auto space-y-8 flex flex-col justify-center min-h-[70vh]">
      
      {/* Student ID Lookup Section */}
      <div id="dashboard" className="card-surface p-8 max-w-lg mx-auto space-y-4 text-center w-full">
        <h2 className="text-lg font-bold text-[var(--text-headings)] tracking-tight">Access Student Dashboard</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Enter a Student ID (e.g., CAND-001, CAND-002) to view curriculum mastery, performance signals, and launch adaptive AI interviews.
        </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const studentId = e.currentTarget.studentId.value.trim();
            if (studentId) {
              const exists = candidates.some(c => 
                (c.member?.id || c.candidate_id || "").toLowerCase() === studentId.toLowerCase()
              );
              if (exists) {
                navigate(`/curriculum/${studentId.toUpperCase()}`);
              } else {
                setLookupError(studentId);
              }
            }
          }}
          className="flex flex-col sm:flex-row gap-2 pt-2"
        >
          <input
            type="text"
            name="studentId"
            placeholder="e.g. CAND-001"
            className="flex-1 px-5 py-3 rounded-lg bg-[var(--panel-bg)] border border-[var(--border-color)] text-sm text-[var(--text-headings)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#EA580C] transition-all"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#EA580C] hover:bg-[#D94E09] text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>
      </div>

      {/* Glassmorphic Error Popup Modal */}
      {lookupError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm overflow-hidden flex flex-col p-6 text-center space-y-4 bg-slate-900/95 border border-white/20 shadow-2xl rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-450 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Student ID Not Found</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              We couldn't find any student with the ID <span className="font-mono font-bold text-rose-350">"{lookupError}"</span>. Please double check and try again.
            </p>
            <button
              onClick={() => setLookupError(null)}
              className="w-full py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
