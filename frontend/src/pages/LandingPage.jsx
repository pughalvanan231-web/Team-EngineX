import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UserCheck, Layers, Cpu, ShieldCheck, BarChart2, CheckCircle2 } from 'lucide-react';

export function LandingPage({ onStart }) {
  const navigate = useNavigate();

  const handleSelectCandidate = () => {
    navigate('/candidates');
  };

  return (
    <div className="w-full min-h-[88vh] bg-transparent text-slate-800 font-sans px-6 sm:px-12 py-8 flex flex-col justify-between space-y-12">
      
      {/* Hero Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Nestive Editorial Typography */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Social Proof Avatar Badge */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-200/30 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar 1" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-200/30 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar 2" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-200/30 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar 3" />
            </div>
            <span className="text-xs text-slate-650 font-medium">
              +10,000 candidates evaluated using <strong className="text-slate-900">"Engine.AI"</strong>
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl font-light text-[var(--text-headings)] tracking-tight leading-[1.05]">
              Assess <span className="font-luxury-serif italic text-[var(--text-muted)]">Your Talent</span><br />
              The Smart Way
            </h1>
          </div>

          {/* Body Paragraph */}
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-lg leading-relaxed font-light">
            Curriculum-aware evaluation of your candidates — without lifting a finger. Your technical hiring is just four steps away from being autonomous!
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <div 
              onClick={handleSelectCandidate}
              className="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-900/5 border border-slate-200 backdrop-blur-md cursor-pointer hover:bg-slate-900/10 transition-all shadow-md group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900/90 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <span className="bg-slate-950 text-white hover:bg-slate-900 text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-full shadow-md font-sans">
                SELECT CANDIDATE
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Luxury Hero Graphic Showcase (Exact match to Nestive 3D House) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          
          <div className="relative w-full max-w-xl group">
            {/* Soft Shadow behind image */}
            <div className="absolute inset-0 bg-slate-950/20 rounded-[40px] blur-2xl transform scale-95 translate-y-6 pointer-events-none" />

            {/* Generated Luxury 3D House Image */}
            <img 
              src="/luxury_ai_house.png" 
              alt="Luxury AI Pavilion Architecture" 
              className="w-full h-auto object-cover rounded-[36px] drop-shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 relative z-10"
            />
          </div>

        </div>

      </div>

      {/* Bottom 4 Step Glass Cards (Exact match to Nestive 01 02 03 04 Bottom Bar) */}
      <div className="w-full max-w-7xl mx-auto pt-6 text-left">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Step 01 */}
          <div 
            onClick={handleSelectCandidate}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Select Candidate
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">01</div>
            </div>
          </div>

          {/* Step 02 */}
          <div 
            onClick={() => navigate('/overview')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Analyze Syllabus
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">02</div>
            </div>
          </div>

          {/* Step 03 */}
          <div 
            onClick={handleSelectCandidate}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Adaptive Q&A
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">03</div>
            </div>
          </div>

          {/* Step 04 */}
          <div 
            onClick={() => navigate('/history')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Skill Analytics
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">04</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}





