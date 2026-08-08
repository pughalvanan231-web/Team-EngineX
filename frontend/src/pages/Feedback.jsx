import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Target, BookOpen, TrendingUp, Bot, User } from 'lucide-react'
import { fetchInterview } from '../services/api.js'
import { getSession, clearSession } from '../services/session.js'
import { Spinner, ScoreRing, Badge, SectionLabel, Card } from '../components/ui.jsx'

function scoreColor(score) {
  if (score >= 80) return 'text-mint'
  if (score >= 60) return 'text-amber'
  return 'text-coral'
}

function statusTone(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('master')) return 'green'
  if (s.includes('develop')) return 'amber'
  if (s.includes('below') || s.includes('needs')) return 'red'
  return 'sky'
}

export default function Feedback() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const s = getSession()
    if (!s?.sessionId) {
      navigate('/candidates', { replace: true })
      return
    }
    fetchInterview(s.sessionId)
      .then((res) => {
        setReport(res)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [navigate])

  const restart = () => {
    clearSession()
    navigate('/candidates')
  }

  if (loading) {
    return (
      <main className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <Spinner label="Preparing your report…" size={22} />
      </main>
    )
  }

  if (error) {
    return (
      <main className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-coral">{error}</p>
        <button onClick={restart} className="btn-primary mt-6">
          Back to candidates
        </button>
      </main>
    )
  }

  const fb = report?.feedback
  if (!fb) {
    return (
      <main className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-muted">This interview has not produced a report yet.</p>
        <button onClick={restart} className="btn-primary mt-6">
          Back to candidates
        </button>
      </main>
    )
  }

  const overall = fb.overall_score ?? 0
  const categoryScores = fb.category_scores || []
  const topicScores = fb.topic_scores || []
  const strengths = fb.strengths || []
  const gaps = fb.gaps || fb.weaknesses || []
  const next = fb.next || fb.recommendations || []
  const evidence = fb.traceable_evidence || []
  const transcript = report.transcript || []

  return (
    <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Interview report</h1>
            <p className="mt-1 text-sm text-muted">Session complete — evidence-based evaluation</p>
          </div>
          <button onClick={restart} className="btn-ghost">
            New interview <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card-surface mt-8 flex flex-col items-center gap-8 p-8 sm:flex-row sm:items-center"
      >
        <ScoreRing score={overall} label="overall" size={128} stroke={10} />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{fb.interviewer_summary || fb.summary || 'Assessment'}</h2>
          {fb.summary && fb.summary !== fb.interviewer_summary && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{fb.summary}</p>
          )}
          {report.degraded_mode && (
            <div className="mt-4">
              <Badge tone="amber">Demo mode — simulated report</Badge>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card>
            <SectionLabel>Category performance</SectionLabel>
            <div className="mt-4 space-y-4">
              {categoryScores.length === 0 && <p className="text-sm text-muted">No category scores.</p>}
              {categoryScores.map((c) => (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-200">{c.category}</span>
                    <span className={`font-mono ${scoreColor(c.score)}`}>{c.score}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-neon-500"
                      style={{ width: `${Math.min(100, c.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <SectionLabel>Topic breakdown</SectionLabel>
            <div className="mt-4 space-y-3">
              {topicScores.length === 0 && <p className="text-sm text-muted">No topic scores.</p>}
              {topicScores.map((t) => (
                <div
                  key={t.topic}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line-800 bg-ink-900/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.topic}</p>
                    <p className="text-[11px] text-faint">Day {t.day || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-semibold ${scoreColor(t.score)}`}>{t.score}</span>
                    <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <SectionLabel>Strengths</SectionLabel>
            <ul className="mt-4 space-y-2.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mint" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionLabel>Growth areas</SectionLabel>
            <ul className="mt-4 space-y-2.5">
              {gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300">
                  <Target size={16} className="mt-0.5 shrink-0 text-coral" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionLabel>Suggested next steps</SectionLabel>
            <ul className="mt-4 space-y-2.5">
              {next.map((n, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300">
                  <BookOpen size={16} className="mt-0.5 shrink-0 text-neon-400" />
                  {n}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {evidence.length > 0 && (
        <Card className="mt-6">
          <SectionLabel>Traceable evidence</SectionLabel>
          <div className="mt-4 space-y-2">
            {evidence.map((e, i) => (
              <div key={i} className="rounded-lg border border-line-800 bg-ink-900/60 px-3 py-2 text-xs text-muted">
                {typeof e === 'string' ? e : JSON.stringify(e)}
              </div>
            ))}
          </div>
        </Card>
      )}

      {transcript.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="mt-6">
            <SectionLabel>Session transcript</SectionLabel>
            <div className="mt-4 space-y-3">
              {transcript.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      m.role === 'user' ? 'order-last bg-ink-700' : 'bg-primary-600/20'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <User size={13} className="text-muted" />
                    ) : (
                      <Bot size={13} className="text-primary-300" />
                    )}
                  </span>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user' ? 'bg-primary-600/80 text-white' : 'bg-ink-800 text-zinc-300'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <div className="mt-10 flex justify-center">
        <button onClick={restart} className="btn-primary">
          <TrendingUp size={17} /> Start another interview
        </button>
      </div>
    </main>
  )
}
