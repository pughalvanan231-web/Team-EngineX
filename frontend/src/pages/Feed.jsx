import React from 'react';
import { PostCard } from '../components/feed/PostCard';
import { PostSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { useAgent } from '../context/AgentContext';

export function Feed() {
  const { posts, loading, error, refreshData } = useAgent();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Live Feed</h2>
        <p className="text-xs text-[#6B7280]">
          Posts published autonomously by NOVA
        </p>
      </div>

      {/* Error state */}
      {error && <ErrorState onRetry={refreshData} />}

      {/* Vertical Feed */}
      {loading ? (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState onRefresh={refreshData} />
      )}
    </div>
  );
}
