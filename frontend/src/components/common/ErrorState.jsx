import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({ onRetry }) {
  return (
    <div className="p-8 text-center rounded-lg bg-[#FEF2F2] border border-[#DC2626]/20 space-y-3">
      <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 text-[#DC2626] mx-auto flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h3 className="text-base font-semibold text-[#111827]">
        Unable to connect to NOVA
      </h3>

      <p className="text-sm text-[#6B7280] max-w-sm mx-auto">
        The autonomous agent cannot currently be reached.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#FEF2F2] text-xs font-mono font-medium text-[#DC2626] border border-[#DC2626]/30 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
