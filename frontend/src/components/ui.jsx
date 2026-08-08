import { motion } from 'framer-motion'

export function Spinner({ size = 18, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span>{label}</span> : null}
    </span>
  )
}

const toneMap = {
  green: 'border-mint/30 bg-mint/10 text-mint',
  violet: 'border-primary-500/30 bg-primary-500/10 text-primary-300',
  amber: 'border-amber/30 bg-amber/10 text-amber',
  red: 'border-coral/30 bg-coral/10 text-coral',
  sky: 'border-neon-500/30 bg-neon-500/10 text-neon-300',
  zinc: 'border-line-600 bg-ink-700 text-zinc-400',
}

export function Badge({ tone = 'zinc', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${toneMap[tone] || toneMap.zinc} ${className}`}
    >
      {children}
    </span>
  )
}

export function ScoreRing({ score, size = 112, stroke = 9, label }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#fb7185'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#262640" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold text-white">{score}</span>
        {label ? <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span> : null}
      </div>
    </div>
  )
}

export function ProgressBar({ value, max, className = '' }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100))
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-600 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-neon-500 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function SectionLabel({ children }) {
  return <div className="label-sm">{children}</div>
}

export function Card({ children, className = '' }) {
  return <div className={`card-surface p-5 ${className}`}>{children}</div>
}

export function EmptyState({ title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-700 px-8 py-14 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  )
}
