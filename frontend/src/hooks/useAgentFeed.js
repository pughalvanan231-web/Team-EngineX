import { useAgent } from '../context/AgentContext';

export function useAgentFeed() {
  const { posts, loading, error, refreshData, lastUpdated } = useAgent();
  
  return {
    posts,
    loading,
    error,
    refreshFeed: refreshData,
    lastUpdated
  };
}
