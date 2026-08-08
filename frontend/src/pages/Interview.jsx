import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  Layers,
  Gauge,
  ListChecks,
} from 'lucide-react'
import { fetchInterview, sendAnswer } from '../services/api.js'
import { getSession } from '../services/session.js'
import { Spinner, Badge, ProgressBar } from '../components/ui.jsx'

export default function Interview() {
  const [sessionId, setSessionId] = useState(null)
  const [transcript, setTranscript] = useState([])
  const [question, setQuestion] = useState(null)
  const [progress, setProgress] = useState(null)
  const [done, setDone] = useState(false)
  const [degraded, setDegraded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const s = getSession()
    if (!s?.sessionId) {
      navigate('/candidates', { replace: true })
      return
    }
    setSessionId(s.sessionId)
    fetchInterview(s.sessionId)
      .then((res) => {
        setTranscript(res.transcript || [])
        setQuestion(res.question)
        setProgress(res.progress)
        setDegraded(Boolean(res.degraded_mode))
        if (res.done) {
          setDone(true)
          setTimeout(() => navigate('/feedback', { replace: true }), 900)
        }
        setLoading(false)
      })
      .catch((e) => {
        if (String(e.message).toLowerCase().includes('not found')) {
          navigate('/candidates', { replace: true })
        } else {
          setError(e.message)
          setLoading(false)
        }
      })
  }, [navigate])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [transcript, analyzing])

  const submit = async () => {
    const text = answer.trim()
    if (!text || analyzing || done) return
    setAnalyzing(true)
    setError('')
    setAnswer('')
    setTranscript((prev) => [...prev, { role: 'user', text }])
    try {
      const res = await sendAnswer(sessionId, text)
      setTranscript((prev) => [...prev, { role: 'ai', text: res.reply }])
      setQuestion(res.question)
      setProgress(res.progress)
      setDegraded(Boolean(res.degraded_mode))
      if (res.done) {
        setDone(true)
        setTimeout(() => navigate('/feedback', { replace: true }), 900)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    }
  }

  if (loading) {
    return (
      <main className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <Spinner label="Loading your interview session…" size={22} />
      </main>
    )
  }

  const qNum = progress?.question_number || 0
  const answers = progress?.answers || 0
  const minQuestions = progress?.min_questions || 8
  const difficulty = progress?.difficulty || '—'
  const stage = progress?.stage || '—'
  const topics = progress?.topics_covered || []

  return (
    <main className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-12 pt-8 lg:h-[calc(100vh-4rem)] lg:flex-row">
      {/* Interviewer / chat column */}
      <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line-800 bg-ink-900/80 backdrop-blur-sm lg:h-full">
        <header className="flex items-center justify-between gap-3 border-b border-line-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600/20 ring-1 ring-primary-500/40">
              <Bot size={18} className="text-primary-300" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">AI Interviewer</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
                {analyzing ? 'Evaluating your response…' : done ? 'Interview complete' : 'Listening'}
              </p>
            </div>
          </div>
          <Badge tone="violet">{stage}</Badge>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {transcript.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  m.role === 'user'
                    ? 'order-last bg-ink-700 ring-1 ring-line-700'
                    : 'bg-primary-600/20 ring-1 ring-primary-500/40'
                }`}
              >
                {m.role === 'user' ? (
                  <User size={15} className="text-muted" />
                ) : (
                  <Bot size={15} className="text-primary-300" />
                )}
              </span>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary-600/90 text-white'
                    : 'bg-ink-800 text-zinc-200 ring-1 ring-line-800'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/20 ring-1 ring-primary-500/40">
                  <Bot size={15} className="text-primary-300" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl bg-ink-800 px-4 py-3 ring-1 ring-line-800">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary-300 animate-pulse-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted">analyzing your response…</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="border-t border-line-800 p-4">
          {error && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          <div className="flex items-end gap-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={analyzing || done}
              rows={3}
              placeholder="Type your answer… (⌘/Ctrl + Enter to send)"
              className="input-field resize-none !rounded-xl"
            />
            <button
              onClick={submit}
              disabled={analyzing || done || !answer.trim()}
              className="btn-primary !px-4 !py-3"
              aria-label="Send answer"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-2 text-right text-[11px] text-faint">
            {done ? 'Report is ready.' : `Question ${qNum} · ${answers} answers given`}
          </p>
        </footer>
      </section>

      {/* Intelligence panel */}
      <aside className="w-full shrink-0 space-y-4 lg:w-80">
        <div className="card-surface p-5">
          <p className="label-sm">Interview progress</p>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-semibold text-white">
              {Math.min(qNum, answers + 1)}
              <span className="text-muted">/{minQuestions}+</span>
            </span>
            <span className="text-xs text-muted">
              {topics.length} {topics.length === 1 ? 'topic' : 'topics'} covered
            </span>
          </div>
          <ProgressBar value={answers + 1} max={Math.max(minQuestions, answers + 1)} className="mt-3" />
        </div>

        <div className="card-surface p-5">
          <p className="label-sm">Current question</p>
          {question ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
                  <Layers size={15} className="text-primary-300" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">Topic</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-200">
                    {question.topic || '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
                  <Gauge size={15} className="text-neon-400" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">Target difficulty</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-200">{difficulty}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 ring-1 ring-line-700">
                  <ListChecks size={15} className="text-mint" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">Curriculum day</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-200">{question.day}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">—</p>
          )}
        </div>

        <div className="card-surface p-5">
          <p className="label-sm">Topics covered</p>
          {topics.length ? (
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-lg border border-line-700 bg-ink-700/60 px-2 py-1 text-[11px] text-zinc-300"
                >
                  <Sparkles size={11} className="text-primary-300" />
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No topics yet.</p>
          )}
        </div>

        {degraded && (
          <div className="flex items-start gap-2 rounded-xl border border-amber/25 bg-amber/10 p-3 text-xs text-amber">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            Running in degraded demo mode — questions are simulated until an AI provider is configured.
          </div>
        )}
      </aside>
    </main>
  )
}
