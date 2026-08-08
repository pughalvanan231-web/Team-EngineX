import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, GraduationCap, ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { fetchCandidates } from '../services/api.js'
import { Spinner, Badge } from '../components/ui.jsx'

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    fetchCandidates()
      .then((res) => {
        if (!cancelled) setCandidates(res.candidates || [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return candidates
    return candidates.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.role || '').toLowerCase().includes(q) ||
        (c.education || '').toLowerCase().includes(q),
    )
  }, [candidates, query])

  const select = (c) => {
    sessionStorage.setItem('interview_candidate', JSON.stringify(c))
    navigate('/pre-interview')
  }

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Select a candidate to start an adaptive interview. Difficulty and topics are derived from their
          real curriculum progress — no generic questions.
        </p>
      </motion.div>

      <div className="mt-8 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, education…"
            className="input-field !pl-10"
          />
        </div>
        {!loading && !error && (
          <span className="text-xs text-muted">
            {filtered.length} of {candidates.length}
          </span>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Loading candidates…" size={22} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-coral/30 bg-coral/10 p-6 text-sm text-coral">
            Could not load candidates: {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <motion.button
                key={c.candidate_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onClick={() => select(c)}
                className="card-surface group flex flex-col gap-4 p-5 text-left transition-all hover:border-primary-500/40 hover:shadow-glow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">{c.role}</p>
                  </div>
                  <Badge tone="zinc">{c.status || 'active'}</Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <GraduationCap size={14} />
                  {c.education || '—'}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-md border border-mint/25 bg-mint/10 px-2 py-0.5 font-medium text-mint">
                    <CheckCircle2 size={12} /> {c.completed_count} done
                  </span>
                  {c.failed_count > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-coral/25 bg-coral/10 px-2 py-0.5 font-medium text-coral">
                      <XCircle size={12} /> {c.failed_count} missed
                    </span>
                  )}
                  {c.skipped_count > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber/25 bg-amber/10 px-2 py-0.5 font-medium text-amber">
                      <MinusCircle size={12} /> {c.skipped_count} skipped
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line-800 pt-3">
                  <span className="text-xs text-muted">{c.experience} yrs experience</span>
                  <ArrowRight
                    size={16}
                    className="text-muted transition-all group-hover:translate-x-0.5 group-hover:text-primary-300"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
