import React, { useState } from 'react';
import { Activity as ActivityIcon, Filter, Search } from 'lucide-react';
import { ActivityItem } from '../components/activity/ActivityItem';
import { Badge } from '../components/common/Badge';
import { useAgent } from '../context/AgentContext';

export function Activity() {
  const { activity, loading, error, refreshData } = useAgent();
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'discovered' | 'rejected'
  const [searchTerm, setSearchTerm] = useState('');

  const filterOptions = [
    { id: 'all', label: 'All Events' },
    { id: 'published', label: 'Published' },
    { id: 'discovered', label: 'Discovered' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const filteredActivity = (activity || []).filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101014] border border-[#24242B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#F5F5F5] font-mono">Autonomous Execution Activity</h2>
            <Badge variant="purple" size="sm">
              TELEMETRY LOG
            </Badge>
          </div>
          <p className="text-xs text-[#92929D] font-mono">
            Chronological audit trail of topics discovered, scored, synthesized, and published.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#101014] border border-[#24242B]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                filter === opt.id
                  ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                  : 'bg-[#07070A] text-[#92929D] hover:text-[#F5F5F5] border border-[#24242B]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#92929D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search telemetry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#07070A] border border-[#24242B] text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filteredActivity.length > 0 ? (
          filteredActivity.map((item, idx) => (
            <ActivityItem key={item.id || idx} item={item} index={idx} />
          ))
        ) : (
          <div className="p-8 text-center bg-[#101014]/40 border border-[#24242B] rounded-2xl text-xs font-mono text-[#92929D]">
            No activity records found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
