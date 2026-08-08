import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer-bg rounded ${className}`} />
  );
}

export function PostSkeleton() {
  return (
    <div className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-36 h-3" />
        </div>
        <Skeleton className="w-12 h-3" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-11/12 h-4" />
        <Skeleton className="w-4/5 h-4" />
      </div>
      <div className="pt-4 border-t border-[#E5E7EB] flex justify-between">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-20 h-5" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-2">
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-24 h-3.5" />
    </div>
  );
}
