import React from 'react';
import { useAgent } from '../context/AgentContext';

export function Activity() {
  const { activity } = useAgent();

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111]">Activity</h1>
        <p className="text-xs text-[#737373] mt-1 font-mono">
          Autonomous research timeline
        </p>
      </div>

      <hr className="border-[#E5E5E5]" />

      {/* Timeline List */}
      <div className="relative pl-4 space-y-8 border-l border-[#E5E5E5]">
        {(activity || []).map((item, idx) => (
          <div key={item.id || idx} className="relative space-y-1">
            {/* Timeline node */}
            <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#111111]" />

            <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
              <span className="font-semibold text-[#111111] capitalize">{item.type}</span>
              <span>{item.timestamp}</span>
            </div>

            <p className="text-sm text-[#111111]">
              {item.description}
            </p>

            {item.reason && (
              <p className="text-xs text-[#737373]">
                Reason: {item.reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
