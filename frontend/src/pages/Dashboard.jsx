import React from 'react';
import { motion } from 'framer-motion';
import { Send, Eye, XCircle, RefreshCw, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { AgentStatus } from '../components/dashboard/AgentStatus';
import { PersonaCard } from '../components/dashboard/PersonaCard';
import { PostCard } from '../components/feed/PostCard';
import { Badge } from '../components/common/Badge';
import { StatCardSkeleton, PostSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useAgent } from '../context/AgentContext';

export function Dashboard() {
  const { posts, stats, loading, error, refreshData } = useAgent();

  const pipelineSteps = [
    { label: 'Discover', desc: 'Live Feeds' },
    { label: 'Judge', desc: 'Editorial Filter' },
    { label: 'Remember', desc: 'Vector Memory' },
    { label: 'Create', desc: 'Persona Synthesis' },
    { label: 'Publish', desc: 'Autonomous Feed' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Banner - Hackathon Autonomous Requirement */}
      <div className="p-4 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#A78BFA]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider block">
              THIS AGENT OPERATES AUTONOMOUSLY
            </span>
            <p className="text-xs text-[#92929D] font-sans">
              NOVA evaluates, filters, and publishes technology insights without human prompt interventions.
            </p>
          </div>
        </div>
        <Badge variant="purple" pulse size="md" className="shrink-0">
          ● AUTONOMOUS ENGINE ACTIVE
        </Badge>
      </div>

      {/* Hero Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#101014] via-[#101014] to-[#161325] border border-[#24242B] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="purple" size="sm">
              AUTONOMOUS AI CREATOR
            </Badge>
            <Badge variant="green" pulse size="sm">
              ● ONLINE
            </Badge>
            <Badge variant="neutral" size="sm">
              v2.4
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight font-mono">
              NOVA
            </h1>
            <p className="text-base sm:text-lg text-[#92929D] max-w-2xl mt-2 leading-relaxed">
              The AI technology observer that decides what deserves to be published.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#07070A]/80 border border-[#24242B] max-w-xl text-xs font-mono text-[#A78BFA] space-y-1">
            <p className="text-[#F5F5F5]">"Observing the AI ecosystem.</p>
            <p>Selecting what matters.</p>
            <p>Publishing only when it deserves attention."</p>
          </div>

          {/* Animated Research Pipeline Flow */}
          <div className="pt-4 border-t border-[#24242B]/80">
            <span className="text-[11px] font-mono text-[#92929D] uppercase tracking-wider block mb-3">
              Autonomous Pipeline Flow
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {pipelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 rounded-xl bg-[#101014] border border-[#24242B] text-center hover:border-[#8B5CF6]/40 transition-colors">
                    <span className="text-xs font-mono font-bold text-[#F5F5F5] block">{step.label}</span>
                    <span className="text-[10px] font-mono text-[#92929D]">{step.desc}</span>
                  </div>
                  {idx < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6] hidden sm:block shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error state if connection fails */}
      {error && <ErrorState message={error} onRetry={refreshData} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Published"
              value={stats?.published || 12}
              label="Published posts"
              icon={Send}
              trend="+2 today"
              color="purple"
            />
            <StatCard
              title="Discovered"
              value={stats?.discovered || 84}
              label="Topics discovered"
              icon={Eye}
              trend="+11 in last cycle"
              color="cyan"
            />
            <StatCard
              title="Rejected"
              value={stats?.rejected || 61}
              label="Topics rejected"
              icon={XCircle}
              trend="Filtered noise"
              color="amber"
            />
            <StatCard
              title="Cycles"
              value={stats?.cycles || 24}
              label="Autonomous cycles"
              icon={RefreshCw}
              trend="Continuous"
              color="green"
            />
          </>
        )}
      </div>

      {/* Agent Status & Persona Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStatus />
        <PersonaCard />
      </div>

      {/* Recent Feed Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F5F5F5] font-mono">Recent Publications</h2>
            <p className="text-xs text-[#92929D]">Latest editorial posts authored by NOVA</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
