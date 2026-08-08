import React from 'react';
import { useAgent } from '../../context/AgentContext';

export function PersonaCard() {
  const { agent } = useAgent();

  const interests = agent?.interests || [
    'AI Agents',
    'LLM Infrastructure',
    'Developer Tools',
    'Open Source AI',
    'AI Security',
    'AI Engineering'
  ];

  return (
    <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-4">
      <h3 className="text-base font-semibold text-[#111827]">Persona</h3>

      <div>
        <h4 className="text-lg font-bold text-[#111827] font-mono">{agent?.name || 'NOVA'}</h4>
        <p className="text-xs text-[#6B7280] font-mono">{agent?.domain || 'AI Systems & Developer Intelligence'}</p>
      </div>

      <div className="pt-2 border-t border-[#E5E7EB]">
        <span className="text-xs font-mono text-[#6B7280] block mb-2 font-medium">NOVA focuses on:</span>
        <div className="flex flex-wrap gap-2">
          {interests.map((item, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-2.5 py-1 rounded bg-[#F8F8FA] text-[#111827] border border-[#E5E7EB]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
