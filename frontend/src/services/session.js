const CANDIDATE_KEY = 'interview_candidate'
const SESSION_KEY = 'interview_session'

export function getCandidate() {
  try {
    const raw = sessionStorage.getItem(CANDIDATE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCandidate(candidate) {
  sessionStorage.setItem(CANDIDATE_KEY, JSON.stringify(candidate))
}

export function clearCandidate() {
  sessionStorage.removeItem(CANDIDATE_KEY)
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
