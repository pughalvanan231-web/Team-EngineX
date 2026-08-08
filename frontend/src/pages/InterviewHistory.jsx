import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, History, PlusCircle } from 'lucide-react';

export function InterviewHistory({ history = [], activeSession, onSelectSession }) {
  const navigate = useNavigate();

  const mockHistory = history.length > 0 ? history : [
    {
      interview_id: "int_sample_001",
      candidate_name: "Sarah Johnson",
      date: "August 8, 2026",
      questions_count: 8,
      curriculum_count: 5,
      status: "Completed"
    }
  ];

  const handleStartNew = () => {
    navigate('/candidates');
  };

  return (
    <div className="w-full py-10 max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/25 pb-6 text-white">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-1">
            <span>HISTORICAL RECORDS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Skill Analytics History
          </h1>
        </div>

        <button
          onClick={handleStartNew}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Select Candidate</span>
        </button>
      </div>

      {/* History List or Empty State */}
      {mockHistory.length === 0 ? (
        
        /* Empty State */
        <div className="py-16 p-8 rounded-3xl bg-[#1d2d35]/70 border border-white/10 backdrop-blur-md shadow-lg text-center space-y-4 text-white">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white/70">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No interviews recorded yet</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Complete your first technical interview to view your skill analytics log here.
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="px-6 py-2.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-50 transition-all"
          >
            Select Candidate
          </button>
        </div>

      ) : (

        /* History Cards List */
        <div className="space-y-4 font-sans text-white">
          {mockHistory.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#1d2d35]/70 border border-white/10 backdrop-blur-md shadow-md hover:scale-[1.01] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">
                    Technical Evaluation — {item.candidate_name}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="text-white/60 text-xs flex items-center gap-3">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.questions_count} questions</span>
                  <span>•</span>
                  <span>{item.curriculum_count} curriculum topics</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/feedback')}
                className="px-5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
