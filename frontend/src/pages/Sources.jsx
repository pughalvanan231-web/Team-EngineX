import React from 'react';
import { SourceTable } from '../components/sources/SourceTable';
import { useAgent } from '../context/AgentContext';

export function Sources() {
  const { sources } = useAgent();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Sources</h2>
        <p className="text-xs text-[#6B7280]">
          Monitored intelligence feeds and repositories
        </p>
      </div>

      {/* Simple Table */}
      <SourceTable sources={sources || []} />
    </div>
  );
}
