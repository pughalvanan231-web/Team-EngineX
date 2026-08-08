import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initializeAgent,
  getFeed,
  getAgentStats,
  getActivity,
  getMemory,
  getSources
} from '../services/api';
import { INITIAL_PERSONA, INITIAL_STATS } from '../services/mockData';

const AgentContext = createContext();

const LOCAL_STORAGE_KEY = 'nova_agent_id';

export function AgentProvider({ children }) {
  const [agentId, setAgentId] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) || null);
  const [agent, setAgent] = useState(INITIAL_PERSONA);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [activity, setActivity] = useState([]);
  const [memory, setMemory] = useState({ publishedTopics: [], rejectedTopics: [] });
  const [sources, setSources] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newPostNotification, setNewPostNotification] = useState(null);

  // Initialize or re-initialize agent
  const handleInitAgent = useCallback(async (personaData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await initializeAgent(personaData);
      if (res && res.agentId) {
        setAgentId(res.agentId);
        localStorage.setItem(LOCAL_STORAGE_KEY, res.agentId);
        if (res.persona) setAgent(res.persona);
      }
      return res;
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize autonomous agent.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all dashboard data
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const idToUse = agentId || 'default-nova-agent';

      const [feedRes, statsRes, actRes, memRes, srcRes] = await Promise.all([
        getFeed(idToUse),
        getAgentStats(idToUse),
        getActivity(idToUse),
        getMemory(idToUse),
        getSources(idToUse)
      ]);

      // Check for new posts to trigger real-time notification
      if (feedRes?.posts && feedRes.posts.length > 0) {
        setPosts(prevPosts => {
          if (prevPosts.length > 0) {
            const latestPrevId = prevPosts[0].id;
            const newPosts = feedRes.posts.filter(p => p.id !== latestPrevId);
            if (newPosts.length > 0 && newPosts[0].id !== latestPrevId) {
              setNewPostNotification(`New publication: "${newPosts[0].content.substring(0, 45)}..."`);
            }
          }
          return feedRes.posts;
        });
      }

      if (statsRes?.stats) setStats(statsRes.stats);
      if (actRes?.activity) setActivity(actRes.activity);
      if (memRes?.memory) setMemory(memRes.memory);
      if (srcRes?.sources) setSources(srcRes.sources);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching agent data:', err);
      setError('Agent connection unavailable. NOVA cannot currently reach the autonomous engine.');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  // Initial load
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Real-time polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const dismissNotification = () => setNewPostNotification(null);

  const resetAgentState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAgentId(null);
  };

  return (
    <AgentContext.Provider
      value={{
        agentId,
        agent,
        posts,
        stats,
        activity,
        memory,
        sources,
        loading,
        error,
        lastUpdated,
        newPostNotification,
        dismissNotification,
        initAgent: handleInitAgent,
        refreshData: () => fetchData(false),
        resetAgent: resetAgentState
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
