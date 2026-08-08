import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, ShieldCheck, Code2, MessageSquare, Terminal } from 'lucide-react';

export function LandingPage({ onStart }) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/overview');
  };

  const handleHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full py-10 sm:py-16 flex flex-col items-center justify-center bg-soft-gradient relative">
      <div className="w-full max-w-5xl mx-auto px-4 text-center space-y-10">
        
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-indigo-600 font-semibold">AI COHORT EVALUATION</span>
          <span className="text-slate-300">•</span>
          <span>Adaptive Technical Interviewer</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Prove what you built.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">
              Explain why you built it.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            An intelligent technical interviewer tailored to your actual 31-day AI cohort journey, code trade-offs, and completed missions.
          </p>
        </div>

        {/* Action Buttons (Pill Shapes) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto btn-pill-primary text-base px-8 py-3.5 group shadow-md"
          >
            <span>Start Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleHowItWorks}
            className="w-full sm:w-auto btn-pill-ghost text-base px-8 py-3.5"
          >
            View how it works
          </button>
        </div>

        {/* Hero Showcase Block with Overlapping Cards & Floating Pill Badges (Inspired by Image 2) */}
        <div className="pt-8 relative max-w-4xl mx-auto">
          
          {/* Floating Pill Badges */}
          <div className="absolute -top-3 left-4 sm:left-12 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
            <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white font-mono text-xs font-semibold shadow-md flex items-center gap-1.5">
              <span>@sarah</span>
              <span className="text-blue-200">· CAND-001</span>
            </span>
          </div>

          <div className="absolute top-8 right-4 sm:right-12 z-20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white font-mono text-xs font-semibold shadow-md flex items-center gap-1.5">
              <span>@alex</span>
              <span className="text-emerald-200">· CAND-002</span>
            </span>
          </div>

          {/* Center Card Stack Showcase */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/90 shadow-card flex flex-col items-center justify-center gap-6 relative overflow-hidden">
            
            {/* Background Accent Tint Container (Inspired by Image 1) */}
            <div className="w-full p-6 sm:p-8 rounded-[24px] bg-[#F2F7F4] border border-emerald-100/80 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Widget (Canva/Task style widget from reference) */}
              <div className="w-full md:w-64 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500 font-semibold uppercase">RAG Engine</div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-sm font-bold text-slate-900">Vector Search</div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Day 8 Mission</span>
                  <span className="font-semibold text-emerald-600">100% Passed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[88%]" />
                </div>
              </div>

              {/* Center Vector Avatar / Illustration Graphic */}
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-inner">
                  <Terminal className="w-10 h-10" />
                </div>
                <div className="text-sm font-bold text-slate-900">Adaptive AI Technical Interviewer</div>
                <p className="text-xs text-slate-500 max-w-xs">
                  Evaluates system architecture, retrieval trade-offs, and practical execution.
                </p>
              </div>

              {/* Right Widget */}
              <div className="w-full md:w-64 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-indigo-600 font-semibold uppercase">MCP Protocol</div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">Active</span>
                </div>
                <div className="text-sm font-bold text-slate-900">Agentic Orchestration</div>
                <div className="text-xs text-slate-500">Day 22 · Multi-Agent Workflows</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Grounded evaluation
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3 Compact Feature Cards (Inspired by Image 1 clean card layout) */}
        <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card hover:shadow-lg transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Adaptive Questions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Questions evolve dynamically based on your answers, technical depth, and code trade-off decisions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F2F7F4] border border-emerald-100/90 shadow-card hover:shadow-lg transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Context-Aware Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The interviewer understands your 31-day learning journey, completed missions, and failed attempts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card hover:shadow-lg transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Actionable Feedback
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get clear strengths, gaps, and concrete next steps immediately upon interview completion.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
