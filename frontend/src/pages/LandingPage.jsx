import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, Sparkles, Code2, CheckCircle2 } from 'lucide-react';

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
    <div className="w-full py-12 sm:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 text-center space-y-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agent-surface border border-agent-border text-agent-secondary text-xs font-mono tracking-wide">
          <span className="w-2 h-2 rounded-full bg-agent-accent animate-pulse" />
          <span>AI ENGINEERING INTERVIEW</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-agent-text leading-tight sm:leading-none">
            Prove what you built.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agent-text via-agent-secondary to-agent-accent">
              Explain why you built it.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-agent-secondary font-normal">
            An adaptive technical interview based on your actual AI Cohort journey.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-agent-text text-agent-bg font-medium text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 group shadow-subtle"
          >
            <span>Start Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleHowItWorks}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-agent-surface border border-agent-border text-agent-secondary hover:text-agent-text hover:border-agent-secondary/50 font-medium text-sm transition-all"
          >
            View how it works
          </button>
        </div>

        {/* Feature Cards Grid (Compact) */}
        <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-16 text-left">
          
          <div className="p-5 rounded-lg bg-agent-surface border border-agent-border hover:border-agent-borderMuted transition-colors space-y-3">
            <div className="w-8 h-8 rounded-md bg-agent-elevated border border-agent-border flex items-center justify-center text-agent-accent">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-agent-text font-mono">
              Adaptive Questions
            </h3>
            <p className="text-xs text-agent-secondary leading-relaxed">
              Questions evolve dynamically based on your answers, technical depth, and code trade-off decisions.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-agent-surface border border-agent-border hover:border-agent-borderMuted transition-colors space-y-3">
            <div className="w-8 h-8 rounded-md bg-agent-elevated border border-agent-border flex items-center justify-center text-agent-accent">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-agent-text font-mono">
              Context-Aware
            </h3>
            <p className="text-xs text-agent-secondary leading-relaxed">
              The interviewer understands your 31-day learning journey, completed missions, and failed attempts.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-agent-surface border border-agent-border hover:border-agent-borderMuted transition-colors space-y-3">
            <div className="w-8 h-8 rounded-md bg-agent-elevated border border-agent-border flex items-center justify-center text-agent-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-agent-text font-mono">
              Actionable Feedback
            </h3>
            <p className="text-xs text-agent-secondary leading-relaxed">
              Get clear strengths, gaps, and concrete next steps immediately upon interview completion.
            </p>
          </div>

        </div>

        {/* Minimal Footer Note */}
        <div className="pt-10 border-t border-agent-borderMuted text-xs font-mono text-agent-muted flex items-center justify-center gap-6">
          <span>8+ Technical Questions</span>
          <span>•</span>
          <span>4+ Curriculum Modules</span>
          <span>•</span>
          <span>Real-time Evaluation</span>
        </div>

      </div>
    </div>
  );
}
