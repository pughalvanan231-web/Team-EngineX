import React from 'react';

export function ErrorState({ onRetry }) {
  return (
    <div className="py-12 text-center space-y-3 border-b border-[#E5E5E5]">
      <p className="text-sm font-medium text-[#111111]">
        Unable to connect to NOVA.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-mono text-[#6D5DFB] hover:underline"
        >
          Try again.
        </button>
      )}
    </div>
  );
}
