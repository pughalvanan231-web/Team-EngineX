import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { fetchCurriculum } from '../services/api';

export function Candidates() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCurriculum();
        if (data && data.curriculum && data.curriculum.days) {
          setDays(data.curriculum.days);
        } else if (data && data.curriculum) {
          setDays(data.curriculum);
        }
      } catch (err) {
        console.error('Failed to load curriculum list:', err);
        setError('Could not load curriculum days.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full py-10 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/20 pb-6 text-white">
        <div className="space-y-1">
          <div className="chip-neon-indigo mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COHORT ASSESSMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Curriculum Syllabus
          </h1>
          <p className="text-sm text-slate-200">
            View the 31-day curriculum topics, tooling, and learn modules built for the cohort.
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
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-350 font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading curriculum syllabus...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(() => {
            const CARD_THEMES = [
              {
                image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80", // Swiss Alps Retreat
                bgColor: "bg-[#1d2d35]",
              },
              {
                image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=80", // Iceland Cabin
                bgColor: "bg-[#272d1f]",
              },
              {
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80", // Tokyo Penthouse
                bgColor: "bg-[#291e26]",
              }
            ];

            return days.slice(0, 8).map((dayItem, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];

              return (
                <div
                  key={dayItem.day}
                  className={`relative rounded-[32px] overflow-hidden ${theme.bgColor} border border-white/10 shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] flex flex-col justify-between h-[480px] w-full group`}
                >
                  {/* Top Image Segment */}
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <img 
                      src={theme.image} 
                      alt={dayItem.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Overlay to fade image smoothly into card bg */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2 text-left">
                      {/* Title and Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight leading-tight line-clamp-2">
                          {dayItem.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/45 text-[9px] font-mono font-bold text-white border border-white/10 shrink-0 font-sans">
                          Day {dayItem.day}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/60 leading-relaxed font-light line-clamp-3">
                        {dayItem.objectives ? dayItem.objectives.slice(0, 2).join('. ') : 'Learn core AI Engineering principles.'}
                      </p>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {dayItem.tools && dayItem.tools.slice(0, 2).map((tool, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-medium text-white/80">
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* White Reserve button */}
                    <button
                      className="w-full py-3 rounded-full bg-white hover:bg-white/95 active:scale-[0.98] text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
