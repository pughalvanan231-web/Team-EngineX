import React from 'react';

export function SkeletonLoader({ type = 'card' }) {
  if (type === 'interview') {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="p-6 rounded-lg bg-agent-surface border border-agent-border space-y-4">
          <div className="h-4 w-32 bg-agent-border rounded" />
          <div className="h-6 w-3/4 bg-agent-border rounded" />
          <div className="h-4 w-1/2 bg-agent-border rounded" />
        </div>
        <div className="h-32 rounded-lg bg-agent-surface border border-agent-border p-4 space-y-3">
          <div className="h-4 w-24 bg-agent-border rounded" />
          <div className="h-16 w-full bg-agent-border rounded" />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="w-full p-6 rounded-lg bg-agent-surface border border-agent-border animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-agent-border" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-agent-border rounded" />
            <div className="h-3 w-24 bg-agent-border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-agent-border">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-agent-border rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 rounded-lg bg-agent-surface border border-agent-border animate-pulse space-y-3">
      <div className="h-4 w-1/3 bg-agent-border rounded" />
      <div className="h-8 w-2/3 bg-agent-border rounded" />
      <div className="h-4 w-1/2 bg-agent-border rounded" />
    </div>
  );
}
