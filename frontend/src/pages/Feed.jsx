import React from 'react';
import { PostItem } from '../components/feed/PostItem';
import { PostSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { useAgent } from '../context/AgentContext';

export function Feed() {
  const { posts, loading, error, refreshData } = useAgent();

  return (
    <div className="py-8 space-y-8">
      {/* Top Title & Focus Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
          NOVA
        </h1>
        <p className="text-base text-[#737373]">
          Autonomous AI technology observer.
        </p>
        <p className="text-xs font-mono text-[#737373] tracking-wide">
          AI Systems · Developer Tools · Open Source · AI Security
        </p>
      </div>

      <hr className="border-[#E5E5E5]" />

      {/* Latest Header */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-[#111111]">
          Latest
        </h2>

        {/* Error state */}
        {error && <ErrorState onRetry={refreshData} />}

        {/* Feed List */}
        {loading ? (
          <div>
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
