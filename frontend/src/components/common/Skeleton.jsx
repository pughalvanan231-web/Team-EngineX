import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-[#F5F5F5] rounded ${className}`} />
  );
}

export function PostSkeleton() {
  return (
    <div className="py-8 border-b border-[#E5E5E5] space-y-3">
      <div className="flex justify-between">
        <Skeleton className="w-16 h-3" />
        <Skeleton className="w-10 h-3" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-5/6 h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  );
}
