import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MemoryItem } from '../components/memory/MemoryItem';
import { useAgent } from '../context/AgentContext';

export function Memory() {
  const { memory } = useAgent();
  const [tab, setTab] = useState('published'); // 'published' | 'rejected'
  const [search, setSearch] = useState('');

  const published = (memory?.publishedTopics || []).filter(p =>
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  const rejected = (memory?.rejectedTopics || []).filter(r =>
    r.topic.toLowerCase().includes(search.toLowerCase()) ||
    (r.reason && r.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Agent Memory</h2>
        <p className="text-xs text-[#6B7280]">
          Topics NOVA has previously evaluated.
        </p>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#F8F8FA] border border-[#E5E7EB] rounded-md">
          <button
            onClick={() => setTab('published')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              tab === 'published'
                ? 'bg-[#FFFFFF] text-[#111827] shadow-subtle font-semibold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setTab('rejected')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              tab === 'rejected'
                ? 'bg-[#FFFFFF] text-[#111827] shadow-subtle font-semibold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#6D5DFB]"
          />
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-3">
        {tab === 'published' ? (
          published.length > 0 ? (
            published.map(item => (
              <MemoryItem key={item.id} item={item} type="published" />
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[#6B7280] bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg">
              No published memory entries found.
            </div>
          )
        ) : (
          rejected.length > 0 ? (
            rejected.map(item => (
              <MemoryItem key={item.id} item={item} type="rejected" />
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[#6B7280] bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg">
              No rejected memory entries found.
            </div>
          )
        )}
      </div>
    </div>
  );
}
