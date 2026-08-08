import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export function InitModal({ isOpen, onClose }) {
  const { initAgent } = useAgent();
  const [name, setName] = useState('NOVA');
  const [domain, setDomain] = useState('AI Systems & Developer Intelligence');
  const [step, setStep] = useState('form'); // 'form' | 'initializing' | 'complete'
  const [progressLogs, setProgressLogs] = useState([]);

  if (!isOpen) return null;

  const handleInitialize = async (e) => {
    e.preventDefault();
    setStep('initializing');
    setProgressLogs([]);

    const steps = [
      "Connecting to intelligence sources...",
      "Creating persona architecture...",
      "Loading editorial vector memory...",
      "Starting autonomous observation engine..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setProgressLogs(prev => [...prev, steps[i]]);
    }

    try {
      await initAgent({
        persona: { name, domain }
      });
      await new Promise(r => setTimeout(r, 400));
      setStep('complete');
    } catch (err) {
      console.error(err);
      setStep('form');
    }
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#101014] border border-[#24242B] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

          {step === 'form' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#F5F5F5]">Initialize Autonomous Agent</h2>
                    <p className="text-xs text-[#92929D]">Set up persona and launch autonomous monitor</p>
                  </div>
                </div>
                {onClose && (
                  <button onClick={onClose} className="p-1 rounded-lg text-[#92929D] hover:text-[#F5F5F5] hover:bg-[#24242B]/50 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleInitialize} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#92929D] mb-1.5 uppercase">
                    Agent Persona Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#07070A] border border-[#24242B] text-[#F5F5F5] text-sm focus:outline-none focus:border-[#8B5CF6] transition-all font-mono"
                    placeholder="e.g. NOVA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#92929D] mb-1.5 uppercase">
                    Focus Domain / Expertise
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#07070A] border border-[#24242B] text-[#F5F5F5] text-sm focus:outline-none focus:border-[#8B5CF6] transition-all font-mono"
                    placeholder="e.g. AI Systems & Developer Intelligence"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Initialize Agent
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'initializing' && (
            <div className="py-8 text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
                <Cpu className="w-6 h-6 text-[#A78BFA] absolute" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#F5F5F5] mb-1">Initializing Agent...</h3>
                <p className="text-xs text-[#92929D]">Setting up autonomous observation parameters</p>
              </div>

              <div className="bg-[#07070A] border border-[#24242B] rounded-xl p-3 text-left font-mono text-xs text-[#92929D] space-y-2 max-h-36 overflow-y-auto">
                {progressLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#A78BFA] animate-fadeIn">
                    <Loader2 className="w-3 h-3 animate-spin text-[#8B5CF6]" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="py-6 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-1">Agent Initialized</h3>
                <p className="text-xs font-mono text-[#22C55E]">{name} is now operating autonomously.</p>
              </div>

              <div className="p-3 bg-[#07070A] border border-[#24242B] rounded-xl text-xs text-[#92929D] leading-relaxed">
                The agent will now discover, evaluate, and synthesize AI developments in real-time.
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-xl bg-[#24242B] hover:bg-[#353540] text-sm text-[#F5F5F5] font-medium transition-all"
              >
                Go to Control Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
