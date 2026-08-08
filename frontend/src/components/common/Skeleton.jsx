import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer-bg rounded-lg ${className}`} />
  );
}

export function PostSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-[#101014] border border-[#24242B] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-36 h-3" />
          </div>
        </div>
        <Skeleton className="w-16 h-3" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-11/12 h-4" />
        <Skeleton className="w-4/5 h-4" />
      </div>
      <div className="pt-4 border-t border-[#24242B]/60 flex justify-between">
        <Skeleton className="w-40 h-6 rounded-md" />
        <Skeleton className="w-20 h-6 rounded-md" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-[#101014] border border-[#24242B] space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3.5" />
        <Skeleton className="w-6 h-6 rounded-md" />
      </div>
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-32 h-3" />
    </div>
  );
}
