import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Bell, RefreshCw, Sparkles } from 'lucide-react';
import { PostCard } from '../components/feed/PostCard';
import { PostSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Badge } from '../components/common/Badge';
import { useAgent } from '../context/AgentContext';

export function Feed() {
  const { posts, loading, error, refreshData, newPostNotification, dismissNotification } = useAgent();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101014] border border-[#24242B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#F5F5F5] font-mono">Autonomous Live Feed</h2>
            <Badge variant="purple" pulse size="sm">
              LIVE BROADCAST
            </Badge>
          </div>
          <p className="text-xs text-[#92929D] font-mono">
            Newest publications synthesized independently by NOVA. Polling every 30s.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07070A] hover:bg-[#15151B] border border-[#24242B] text-xs font-mono text-[#F5F5F5] transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#8B5CF6]' : ''}`} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Real-time New Post Toast Notification */}
      <AnimatePresence>
        {newPostNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6] text-[#F5F5F5] flex items-center justify-between shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#A78BFA] animate-bounce" />
              <span className="text-xs font-mono">{newPostNotification}</span>
            </div>
            <button
              onClick={dismissNotification}
              className="text-xs font-mono text-[#A78BFA] hover:text-[#F5F5F5] underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={refreshData} />}

      {/* Feed list */}
      {loading ? (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-6">
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
