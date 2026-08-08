import React from 'react';

export function MemoryItem({ item, type = 'published' }) {
  return (
    <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-1.5 shadow-subtle">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#111827]">
          {item.topic}
        </h4>
        <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
          type === 'published' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'
        }`}>
          Decision: {type === 'published' ? 'Published' : 'Rejected'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>{item.date}</span>
        {item.score && <span className="font-mono">Score: {item.score}/10</span>}
      </div>

      {item.reason && (
        <p className="text-xs text-[#6B7280] pt-1 leading-relaxed border-t border-[#E5E7EB]">
          {item.reason}
        </p>
      )}
    </div>
  );
}
