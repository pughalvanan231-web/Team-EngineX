import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, GraduationCap, Briefcase, Layers, Siren } from 'lucide-react'
import { fetchCurriculum, startInterview, newSessionId } from '../services/api.js'
import { getCandidate, setSession } from '../services/session.js'
import { Spinner, Badge } from '../components/ui.jsx'

export default function PreInterview() {
  const [candidate, setCandidate] = useState(null)
  const [curriculum, setCurriculum] = useState(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const c = getCandidate()
    if (!c) {
      navigate('/candidates', { replace: true })
      return
    }
    setCandidate(c)
    fetchCurriculum()
      .then((res) => setCurriculum(res.curriculum))
      .catch(() => {})
  }, [navigate])

  if (!candidate) return null

  const focusDays = (candidate.days || []).slice(0, 6)
  const focusTopics = focusDays
    .map((d) => {
      const day = (curriculum?.days || []).find((x) => x.day === d)
      return day ? day.title : null
    })
    .filter(Boolean)

  const begin = async () => {
    setStarting(true)
    setError('')
    const sessionId = newSessionId()
    const payload = {
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      role: candidate.role,
      experience: candidate.experience,
      education: candidate.education,
    }
    try {
      await startInterview(sessionId, payload)
      setSession({ sessionId, candidate: candidate.candidate_id })
      navigate('/interview', { replace: true })
    } catch (e) {
      setError(e.message)
      setStarting(false)
    }
  }

  return (
    <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-14">
      <button
        onClick={() => navigate('/candidates')}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={16} /> Back to candidates
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Interview preview</h1>
        <p className="mt-2 text-sm text-muted">
          This is what the interviewer will focus on for this candidate, derived from their curriculum
          history.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card-surface mt-8 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{candidate.name}</h2>
            <p className="mt-0.5 text-sm text-muted">{candidate.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="violet">{candidate.experience} yrs</Badge>
            <Badge tone="zinc">{candidate.status || 'active'}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
              <Briefcase size={15} className="text-muted" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted">Experience</p>
              <p className="mt-0.5 text-sm text-zinc-200">{candidate.experience} years</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
              <GraduationCap size={15} className="text-muted" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted">Education</p>
              <p className="mt-0.5 text-sm text-zinc-200">{candidate.education || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
              <Layers size={15} className="text-muted" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted">Curriculum days</p>
              <p className="mt-0.5 text-sm text-zinc-200">{(candidate.days || []).length} tracked</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
              <Siren size={15} className="text-muted" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted">Missed missions</p>
              <p className="mt-0.5 text-sm text-zinc-200">{candidate.failed_count}</p>
            </div>
          </div>
        </div>

        {focusTopics.length > 0 && (
          <div className="mt-6 border-t border-line-800 pt-5">
            <p className="label-sm">Likely focus areas</p>
            <div className="flex flex-wrap gap-2">
              {focusTopics.map((t) => (
                <Badge key={t} tone="sky">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 grid gap-4 sm:grid-cols-3"
      >
        {[
          ['8+ questions', 'A minimum of 8 questions, always covering 4+ distinct curriculum days.'],
          ['Adaptive difficulty', 'Difficulty climbs with strong answers and drops with weak ones.'],
          ['Instant report', 'Structured feedback with scores, strengths, gaps, and next steps.'],
        ].map(([t, b]) => (
          <div key={t} className="card-surface p-4">
            <p className="text-sm font-semibold text-white">{t}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{b}</p>
          </div>
        ))}
      </motion.div>

      {error && (
        <div className="mt-6 rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</div>
      )}

      <div className="mt-8 flex justify-end">
        <button onClick={begin} disabled={starting} className="btn-primary w-full sm:w-auto">
          {starting ? <Spinner size={18} label="Preparing interview…" /> : (
            <>
              Begin interview <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </main>
  )
}
