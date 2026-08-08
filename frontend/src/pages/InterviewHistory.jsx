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
    navigate('/candidates');
  };

  return (
    <div className="w-full py-10 max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>HISTORICAL RECORDS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Skill Analytics History
          </h1>
        </div>

        <button
          onClick={handleStartNew}
          className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Select Candidate</span>
        </button>
      </div>

      {/* History List or Empty State */}
      {mockHistory.length === 0 ? (
        
        /* Empty State */
        <div className="py-16 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-slate-900">No interviews recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete your first technical interview to view your skill analytics log here.
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="px-6 py-2.5 rounded-full bg-orange-600 text-white text-xs font-bold"
          >
            Select Candidate
          </button>
        </div>

      ) : (

        /* History Cards List */
        <div className="space-y-4 font-sans">
          {mockHistory.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-slate-900">
                    Technical Evaluation — {item.candidate_name}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="text-slate-500 text-xs flex items-center gap-3">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.questions_count} questions</span>
                  <span>•</span>
                  <span>{item.curriculum_count} curriculum topics</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/feedback')}
                className="px-5 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all"
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
