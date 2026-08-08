import React, { useState } from 'react';
import { Brain, Search, BookmarkCheck, ShieldAlert, Filter } from 'lucide-react';
import { MemoryCard } from '../components/memory/MemoryCard';
import { DecisionCard } from '../components/memory/DecisionCard';
import { Badge } from '../components/common/Badge';
import { useAgent } from '../context/AgentContext';

export function Memory() {
  const { memory } = useAgent();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'published' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  const published = memory?.publishedTopics || [];
  const rejected = memory?.rejectedTopics || [];

  const filteredPublished = published.filter(p =>
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRejected = rejected.filter(r =>
    r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101014] border border-[#24242B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#F5F5F5] font-mono">Agent Memory Index</h2>
            <Badge variant="purple" size="sm">
              VECTOR STORE
            </Badge>
          </div>
          <p className="text-xs text-[#92929D] font-mono">
            Everything NOVA remembers to maintain continuity and avoid unnecessary repetition.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#101014] border border-[#24242B]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'all'
                ? 'bg-[#8B5CF6] text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'bg-[#07070A] text-[#92929D] hover:text-[#F5F5F5] border border-[#24242B]'
            }`}
          >
            All Entries ({published.length + rejected.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'published'
                ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-semibold'
                : 'bg-[#07070A] text-[#92929D] hover:text-[#F5F5F5] border border-[#24242B]'
            }`}
          >
            Published ({published.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'rejected'
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-semibold'
                : 'bg-[#07070A] text-[#92929D] hover:text-[#F5F5F5] border border-[#24242B]'
            }`}
          >
            Rejected Decisions ({rejected.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#92929D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#07070A] border border-[#24242B] text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>
      </div>

      {/* Main Memory Content */}
      <div className="space-y-8">
        {/* Published Memory Section */}
        {(activeTab === 'all' || activeTab === 'published') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#22C55E]" />
              <h3 className="text-sm font-bold font-mono text-[#F5F5F5] uppercase tracking-wider">
                Published Topic Memory
              </h3>
            </div>

            <div className="space-y-3">
              {filteredPublished.length > 0 ? (
                filteredPublished.map((item) => (
                  <MemoryCard key={item.id} item={item} />
                ))
              ) : (
                <div className="p-4 text-xs font-mono text-[#92929D] bg-[#101014]/50 border border-[#24242B] rounded-xl text-center">
                  No published memory entries found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rejected Decisions Section */}
        {(activeTab === 'all' || activeTab === 'rejected') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <h3 className="text-sm font-bold font-mono text-[#F5F5F5] uppercase tracking-wider">
                Editorial Decision Archive (Rejected)
              </h3>
            </div>

            <div className="space-y-4">
              {filteredRejected.length > 0 ? (
                filteredRejected.map((item) => (
                  <DecisionCard key={item.id} item={item} />
                ))
              ) : (
                <div className="p-4 text-xs font-mono text-[#92929D] bg-[#101014]/50 border border-[#24242B] rounded-xl text-center">
                  No rejected editorial decisions found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
