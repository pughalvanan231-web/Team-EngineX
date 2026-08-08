import React, { useState } from 'react';
import { useAgent } from '../context/AgentContext';

export function Memory() {
  const { memory } = useAgent();
  const [search, setSearch] = useState('');

  const published = (memory?.publishedTopics || []).filter(p =>
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  const rejected = (memory?.rejectedTopics || []).filter(r =>
    r.topic.toLowerCase().includes(search.toLowerCase()) ||
    (r.reason && r.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111]">Memory</h1>
        <p className="text-xs text-[#737373] mt-1">
          Previously evaluated topics.
        </p>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#6D5DFB]"
        />
      </div>

      <hr className="border-[#E5E5E5]" />

      {/* Published Topics */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
          Published
        </h2>

        <div className="divide-y divide-[#E5E5E5]">
          {published.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
              <span className="text-[#111111]">{item.topic}</span>
              <span className="text-xs font-mono text-[#737373]">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Topics */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
          Rejected
        </h2>

        <div className="divide-y divide-[#E5E5E5]">
          {rejected.map((item) => (
            <div key={item.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#111111]">{item.topic}</span>
                <span className="text-xs font-mono text-[#737373]">{item.date}</span>
              </div>
              {item.reason && (
                <p className="text-xs text-[#737373]">
                  Reason: {item.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
