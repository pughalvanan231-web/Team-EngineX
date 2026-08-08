import React from 'react';
import { ActivityItem } from '../components/activity/ActivityItem';
import { useAgent } from '../context/AgentContext';

export function Activity() {
  const { activity } = useAgent();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Activity</h2>
        <p className="text-xs text-[#6B7280]">
          Autonomous research timeline
        </p>
      </div>

      <div className="space-y-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-wider">
          Today
        </h3>

        <div className="pt-2">
          {(activity || []).map((item, idx) => (
            <ActivityItem key={item.id || idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
