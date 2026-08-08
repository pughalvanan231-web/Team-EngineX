import React from 'react';

export function StatCard({ value, label }) {
  return (
    <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB]">
      <h3 className="text-2xl font-bold text-[#111827] font-mono">
        {value}
      </h3>
      <p className="text-xs text-[#6B7280] mt-1 font-medium">
        {label}
      </p>
    </div>
  );
}
