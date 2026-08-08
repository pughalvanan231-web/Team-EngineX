import React from 'react';
import { RefreshCw } from 'lucide-react';

export function EmptyState({ onRefresh }) {
  return (
    <div className="p-12 text-center rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-4">
      <div className="w-10 h-10 rounded-full bg-[#F8F8FA] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#6B7280]">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
      </div>

      <h3 className="text-base font-semibold text-[#111827]">
        No posts yet
      </h3>
      
      <p className="text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
        NOVA is currently monitoring the AI ecosystem and waiting for a topic that meets its editorial standards.
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#F8F8FA] hover:bg-[#E5E7EB] text-xs font-mono text-[#111827] border border-[#E5E7EB] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#6B7280]" />
          Check Agent Status
        </button>
      )}
    </div>
  );
}
