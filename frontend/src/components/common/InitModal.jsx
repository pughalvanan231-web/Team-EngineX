import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

export function InitModal({ isOpen, onClose }) {
  const { initAgent } = useAgent();
  const [name, setName] = useState('NOVA');
  const [domain, setDomain] = useState('AI Systems & Developer Intelligence');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await initAgent({
        persona: { name, domain }
      });
      setInitialized(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setInitialized(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-6 shadow-xl relative">
        {!initialized ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#111827]">Initialize NOVA</h2>
              {onClose && (
                <button onClick={onClose} className="p-1 rounded text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F8FA]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#6B7280] mb-1 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#6D5DFB]"
                  placeholder="NOVA"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#6B7280] mb-1 uppercase">
                  Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#6D5DFB]"
                  placeholder="AI Systems & Developer Intelligence"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-md bg-[#6D5DFB] hover:bg-[#5B4CF0] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Initializing...' : 'Initialize Agent'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] border border-[#16A34A]/20 text-[#16A34A] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#111827]">Agent initialized</h3>
              <p className="text-xs font-mono text-[#16A34A] mt-1">
                {name} is now operating autonomously.
              </p>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2 px-4 rounded-md bg-[#F8F8FA] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-sm text-[#111827] font-medium transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
