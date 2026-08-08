import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from './Badge';

export function ErrorState({ message = "NOVA cannot currently reach the autonomous engine.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/20">
      <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center mb-4 text-[#EF4444]">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <Badge variant="error" className="mb-3">
        CONNECTION OFFLINE
      </Badge>

      <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">
        Agent connection unavailable
      </h3>

      <p className="text-sm text-[#92929D] max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-xs font-mono font-medium text-[#EF4444] border border-[#EF4444]/40 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
}
