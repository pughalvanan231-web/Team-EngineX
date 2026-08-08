import React from 'react';
import { Database, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { SourceCard } from '../components/sources/SourceCard';
import { Badge } from '../components/common/Badge';
import { useAgent } from '../context/AgentContext';

export function Sources() {
  const { sources, loading } = useAgent();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101014] border border-[#24242B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#F5F5F5] font-mono">Monitored Intelligence Sources</h2>
            <Badge variant="purple" size="sm">
              6 FEEDS ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-[#92929D] font-mono">
            Reputable academic repositories, open source code bases, and official AI engineering blogs tracked by NOVA.
          </p>
        </div>
      </div>

      {/* Grid of Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(sources || []).map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
}
