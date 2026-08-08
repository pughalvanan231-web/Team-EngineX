import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgent } from '../context/AgentContext';

export function Init() {
  const navigate = useNavigate();
  const { initAgent } = useAgent();
  const [name, setName] = useState('NOVA');
  const [domain, setDomain] = useState('AI Systems & Developer Intelligence');
  const [status, setStatus] = useState('idle'); // 'idle' | 'initializing' | 'complete'

  const handleInit = async (e) => {
    e.preventDefault();
    setStatus('initializing');

    try {
      await initAgent({
        persona: { name, domain }
      });
      setStatus('complete');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="py-16 space-y-6 max-w-sm mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#111111] font-mono">NOVA</h1>
        <p className="text-xs text-[#737373]">Initialize autonomous agent.</p>
      </div>

      {status === 'complete' ? (
        <div className="py-4 space-y-2 border-t border-b border-[#E5E5E5]">
          <p className="text-sm font-medium text-[#16A34A] font-mono">
            NOVA is now operating autonomously.
          </p>
          <p className="text-xs text-[#737373]">Redirecting to feed...</p>
        </div>
      ) : (
        <form onSubmit={handleInit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#737373] mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#6D5DFB]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#737373] mb-1">
              Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#6D5DFB]"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'initializing'}
            className="w-full py-2 px-4 rounded bg-[#6D5DFB] hover:bg-[#5B4CF0] text-white text-sm font-medium transition-colors"
          >
            {status === 'initializing' ? 'Initializing...' : 'Initialize'}
          </button>
        </form>
      )}
    </div>
  );
}
