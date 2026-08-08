import React from 'react';

export function ActivityItem({ item }) {
  const getStatusColor = (type) => {
    switch (type) {
      case 'published':
        return 'text-[#16A34A] bg-[#16A34A]';
      case 'rejected':
        return 'text-[#DC2626] bg-[#DC2626]';
      case 'discovered':
        return 'text-[#6D5DFB] bg-[#6D5DFB]';
      default:
        return 'text-[#6B7280] bg-[#6B7280]';
    }
  };

  const dotClass = getStatusColor(item.type);

  return (
    <div className="flex gap-4 relative pb-6 group last:pb-0">
      {/* Timeline vertical line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-[#E5E7EB] group-last:hidden" />

      {/* Bullet dot */}
      <div className="pt-1 z-10">
        <span className={`block w-3 h-3 rounded-full border-2 border-[#FFFFFF] shadow-sm ${dotClass}`} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#111827] capitalize">
            {item.type}
          </h4>
          <span className="text-xs font-mono text-[#6B7280]">
            {item.timestamp}
          </span>
        </div>

        <p className="text-sm text-[#111827]">
          {item.description}
        </p>

        {item.detail && (
          <p className="text-xs text-[#6B7280] pt-0.5">
            {item.detail}
          </p>
        )}
      </div>
    </div>
  );
}
