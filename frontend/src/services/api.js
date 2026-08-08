const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body && body.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch {
      /* keep default */
    }
    throw new Error(detail)
  }
  return res.json()
}

export function fetchHealth() {
  return request('/api/v1/health')
}

export function fetchCandidates() {
  return request('/api/v1/candidates')
}

export function fetchCurriculum() {
  return request('/api/v1/curriculum')
}

export function startInterview(sessionId, candidate) {
  return request('/api/interview', {
    method: 'POST',
    body: JSON.stringify({ sessionId, candidate }),
  })
}

export function sendAnswer(sessionId, message) {
  return request('/api/interview', {
    method: 'POST',
    body: JSON.stringify({ sessionId, message }),
  })
}

export function fetchInterview(sessionId) {
  return request(`/api/interview/${encodeURIComponent(sessionId)}`)
}

export function newSessionId() {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
