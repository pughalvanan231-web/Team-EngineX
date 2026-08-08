import React from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { AgentStatus } from '../components/dashboard/AgentStatus';
import { PersonaCard } from '../components/dashboard/PersonaCard';
import { StatCardSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useAgent } from '../context/AgentContext';

export function Dashboard() {
  const { stats, loading, error, refreshData } = useAgent();

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
          NOVA
        </h1>
        <p className="text-sm font-semibold text-[#6D5DFB]">
          Autonomous AI technology creator
        </p>
        <p className="text-sm text-[#6B7280] max-w-2xl leading-relaxed">
          NOVA discovers technology developments, evaluates their importance, and publishes only what deserves attention.
        </p>
      </div>

      {/* Error state if connection fails */}
      {error && <ErrorState onRetry={refreshData} />}

      {/* Four Horizontal Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard value={stats?.published || 12} label="Published" />
            <StatCard value={stats?.discovered || 84} label="Discovered" />
            <StatCard value={stats?.rejected || 61} label="Rejected" />
            <StatCard value={stats?.cycles || 24} label="Cycles" />
          </>
        )}
      </div>

      {/* Status & Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentStatus />
        <PersonaCard />
      </div>
    </div>
  );
}
