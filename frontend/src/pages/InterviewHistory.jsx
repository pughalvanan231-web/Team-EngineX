import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle2, History, PlusCircle } from 'lucide-react';

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
    navigate('/overview');
  };

  return (
    <div className="w-full py-10 max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-agent-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-agent-secondary mb-1">
            <span>SESSION RECORDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-agent-text tracking-tight">
            Interview History
          </h1>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 rounded-lg bg-agent-accent text-white font-medium text-xs hover:bg-agent-accentHover transition-colors flex items-center gap-2 shadow-subtle font-mono"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start Interview</span>
        </button>
      </div>

      {/* History List or Empty State */}
      {mockHistory.length === 0 ? (
        
        /* 24. Clean Empty State */
        <div className="py-16 p-8 rounded-lg bg-agent-surface border border-agent-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-agent-elevated border border-agent-border mx-auto flex items-center justify-center text-agent-muted">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-agent-text">No interviews yet</h3>
            <p className="text-xs text-agent-secondary max-w-sm mx-auto">
              Complete your first technical interview to see your evaluation report here.
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="px-5 py-2.5 rounded-lg bg-agent-accent text-white font-medium text-xs hover:bg-agent-accentHover transition-colors font-mono"
          >
            Start Interview
          </button>
        </div>

      ) : (

        /* History Cards List */
        <div className="space-y-4 font-mono text-xs">
          {mockHistory.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg bg-agent-surface border border-agent-border hover:border-agent-borderMuted transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-agent-text">
                    Technical Interview — {item.candidate_name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>
                <div className="text-agent-muted text-[11px] flex items-center gap-3">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.questions_count} questions</span>
                  <span>•</span>
                  <span>{item.curriculum_count} curriculum areas</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/feedback')}
                className="px-4 py-2 rounded bg-agent-elevated border border-agent-border hover:border-agent-accent/40 text-agent-accentLight hover:text-white font-medium transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>View Feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      )}

    </div>
  );
}
