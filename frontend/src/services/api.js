import axios from 'axios';
import {
  INITIAL_PERSONA,
  INITIAL_STATS,
  MOCK_POSTS,
  MOCK_ACTIVITIES,
  MOCK_SOURCES,
  MOCK_MEMORY
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'; // Default to true if not explicitly set to 'false'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

/**
 * Initialize Autonomous Agent
 * POST /api/agent/init
 * @param {Object} payload - { persona: { name: string, domain: string } }
 */
export async function initializeAgent(payload = { persona: { name: "NOVA", domain: "AI Systems & Developer Intelligence" } }) {
  if (DEMO_MODE || !BASE_URL) {
    // Simulate network latency for persona initialization
    await new Promise(resolve => setTimeout(resolve, 800));
    const agentId = "nova-agent-" + Math.random().toString(36).substring(2, 9);
    return {
      agentId,
      persona: {
        ...INITIAL_PERSONA,
        name: payload?.persona?.name || INITIAL_PERSONA.name,
        domain: payload?.persona?.domain || INITIAL_PERSONA.domain
      },
      status: "initialized"
    };
  }

  try {
    const response = await apiClient.post('/api/agent/init', payload);
    return response.data;
  } catch (error) {
    console.warn('API connection failed, falling back to local simulation:', error.message);
    const agentId = "nova-agent-" + Math.random().toString(36).substring(2, 9);
    return {
      agentId,
      persona: INITIAL_PERSONA,
      status: "initialized_fallback"
    };
  }
}

/**
 * Get Published Feed
 * GET /api/agent/feed?agentId=...
 */
export async function getFeed(agentId) {
  if (DEMO_MODE || !BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { posts: MOCK_POSTS };
  }

  try {
    const response = await apiClient.get('/api/agent/feed', { params: { agentId } });
    return response.data;
  } catch (error) {
    console.warn('getFeed API call failed, falling back to mock posts:', error.message);
    return { posts: MOCK_POSTS };
  }
}

/**
 * Get Agent Statistics
 * GET /api/agent/stats?agentId=...
 */
export async function getAgentStats(agentId) {
  if (DEMO_MODE || !BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { stats: INITIAL_STATS };
  }

  try {
    const response = await apiClient.get('/api/agent/stats', { params: { agentId } });
    return response.data;
  } catch (error) {
    console.warn('getAgentStats API call failed:', error.message);
    return { stats: INITIAL_STATS };
  }
}

/**
 * Get Agent Activity Log
 * GET /api/agent/activity?agentId=...
 */
export async function getActivity(agentId) {
  if (DEMO_MODE || !BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return { activity: MOCK_ACTIVITIES };
  }

  try {
    const response = await apiClient.get('/api/agent/activity', { params: { agentId } });
    return response.data;
  } catch (error) {
    console.warn('getActivity API call failed:', error.message);
    return { activity: MOCK_ACTIVITIES };
  }
}

/**
 * Get Agent Memory Store (Published, Rejected, Decisions)
 * GET /api/agent/memory?agentId=...
 */
export async function getMemory(agentId) {
  if (DEMO_MODE || !BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { memory: MOCK_MEMORY };
  }

  try {
    const response = await apiClient.get('/api/agent/memory', { params: { agentId } });
    return response.data;
  } catch (error) {
    console.warn('getMemory API call failed:', error.message);
    return { memory: MOCK_MEMORY };
  }
}

/**
 * Get Monitored Intelligence Sources
 * GET /api/agent/sources?agentId=...
 */
export async function getSources(agentId) {
  if (DEMO_MODE || !BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { sources: MOCK_SOURCES };
  }

  try {
    const response = await apiClient.get('/api/agent/sources', { params: { agentId } });
    return response.data;
  } catch (error) {
    console.warn('getSources API call failed:', error.message);
    return { sources: MOCK_SOURCES };
  }
}
