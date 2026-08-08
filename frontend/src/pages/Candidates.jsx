import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { fetchCurriculum } from '../services/api';

export function Candidates() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCurriculum();
        if (data && data.days) {
          setDays(data.days);
        } else if (data && data.curriculum && data.curriculum.days) {
          setDays(data.curriculum.days);
        } else if (Array.isArray(data)) {
          setDays(data);
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
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-355 font-mono text-xs">
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
                bgColor: "bg-[#1d2d35]",
              },
              {
                bgColor: "bg-[#272d1f]",
              },
              {
                bgColor: "bg-[#291e26]",
              }
            ];

            const getTopicImage = (day) => {
              const images = {
                1: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80", // VS Code Setup
                2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTobqm62dGSj8aeDLJkk5eN2P3BwhryI3GKYAYrKwpm8g&s=10", // Local LLM
                3: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80", // React Frontend
                4: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", // Data foundations
                5: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80", // SQL / SQLite
                6: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80", // FastAPI
                7: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80", // Embeddings
                8: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&auto=format&fit=crop&q=80", // Vector DB
              };
              return images[day] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
            };

            return days.slice(0, 8).map((dayItem, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const cardImage = getTopicImage(dayItem.day);

              return (
                <div
                  key={dayItem.day}
                  className="card-surface relative overflow-hidden flex flex-col justify-between h-[360px] w-full group"
                >
                  {/* Top Image Segment */}
                  <div className="relative h-[190px] w-full overflow-hidden">
                    <img
                      src={cardImage}
                      alt={dayItem.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  {/* Glass Divider */}
                  <div className="glass-divider" />

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1 text-left">
                      {/* Title and Badge Row */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight line-clamp-2">
                          {dayItem.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-black/45 text-[9px] font-mono font-bold text-white border border-white/10 shrink-0 font-sans">
                          Day {dayItem.day}
                        </span>
                      </div>
                    </div>

                    {/* Glassmorphic Read more button - triggers popup */}
                    <button
                      onClick={() => setActiveDay({ ...dayItem, cardImage, bgColor: theme.bgColor })}
                      className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 backdrop-blur-md font-bold text-xs shadow-sm transition-all flex items-center justify-center"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Student ID Lookup Section */}
      <div className="card-surface p-8 mt-12 max-w-lg mx-auto space-y-4 text-center">
        <h2 className="text-lg font-bold text-white tracking-tight">Access Student Dashboard</h2>
        <p className="text-xs text-white/60">
          Enter a Student ID (e.g., CAND-001, CAND-002) to view curriculum mastery, performance signals, and launch adaptive AI interviews.
        </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const studentId = e.currentTarget.studentId.value.trim();
            if (studentId) {
              navigate(`/candidates/${studentId}`);
            }
          }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <input
            type="text"
            name="studentId"
            placeholder="e.g. CAND-001"
            className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/25 text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all backdrop-blur-md"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>
      </div>

      {/* Glassmorphic Popup Modal */}
      {activeDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="card-surface relative w-full max-w-lg overflow-hidden flex flex-col">
            {/* Top Image Banner */}
            <div className="relative h-[220px] w-full overflow-hidden">
              <img src={activeDay.cardImage} alt={activeDay.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={() => setActiveDay(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-5 text-left">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight leading-snug">{activeDay.title}</h2>
                <span className="px-3 py-1 rounded-full bg-black/45 text-xs font-mono font-bold text-white border border-white/10 shrink-0">
                  Day {activeDay.day}
                </span>
              </div>

              {/* Objectives List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Learning Objectives</h4>
                <ul className="text-xs text-white/80 space-y-1.5 list-disc pl-4 font-light">
                  {activeDay.objectives && activeDay.objectives.map((obj, oIdx) => (
                    <li key={oIdx}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Tools List */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Tech Stack & Tools</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDay.tools && activeDay.tools.map((tool, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-medium text-white/90">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button inside modal */}
              <button
                onClick={() => setActiveDay(null)}
                className="w-full py-3.5 mt-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
