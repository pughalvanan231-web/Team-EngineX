import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Target,
  Gauge,
  FileText,
  Bot,
  ArrowRight,
  GitBranch,
  Database,
  Users,
  Brain,
  ShieldCheck,
  Layers,
  ChevronDown,
  RefreshCw,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Adaptive to real progress',
    body: 'Every question is grounded in the candidate’s actual curriculum history — weak days are probed, strong days are challenged at higher difficulty.',
  },
  {
    icon: GitBranch,
    title: 'Difficulty that moves',
    body: 'A five-level difficulty engine reacts to each answer: strong responses push toward architecture and trade-offs, weak ones pull back to fundamentals.',
  },
  {
    icon: Bot,
    title: 'Follow-up probe',
    body: 'When an answer is partial or vague, the interviewer drills one level deeper before moving on — like a real senior engineer.',
  },
  {
    icon: FileText,
    title: 'Structured feedback',
    body: 'A complete report at the end: overall score, category and topic scores, strengths, gaps, and concrete next steps.',
  },
  {
    icon: Brain,
    title: 'Personalized topic pool',
    body: 'Failed days, high-attempt topics, and role-preferred modules are prioritized so the interview targets exactly what matters most.',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence over opinion',
    body: 'Every evaluation is scored across correctness, depth, practicality, reasoning, and communication — not a gut feeling.',
  },
]

const stats = [
  { icon: Database, value: '31', label: 'curriculum days' },
  { icon: Users, value: '20', label: 'candidate profiles' },
  { icon: Gauge, value: '5', label: 'difficulty levels' },
  { icon: BarChart3, value: '5', label: 'scoring dimensions' },
]

const difficultyLadder = [
  {
    level: 'Fundamentals',
    tone: 'text-mint',
    description: 'Core concepts, terminology, and first principles of the module.',
  },
  {
    level: 'Application',
    tone: 'text-neon-400',
    description: 'Applying knowledge to concrete tasks, small tools, and hands-on code.',
  },
  {
    level: 'Debugging',
    tone: 'text-primary-300',
    description: 'Fault-finding, edge cases, and reasoning through broken systems.',
  },
  {
    level: 'Architecture',
    tone: 'text-amber',
    description: 'Trade-offs, system design, and connecting components end-to-end.',
  },
  {
    level: 'Engineering Judgment',
    tone: 'text-coral',
    description: 'Production thinking: reliability, scaling, and hard decisions.',
  },
]

const journey = [
  {
    step: '01',
    title: 'Pick a candidate',
    body: 'Browse 20 real cohort profiles — each carries mission history, skill signals, and completion patterns.',
  },
  {
    step: '02',
    title: 'Profile is analyzed',
    body: 'The orchestrator builds a topic pool from weak days, high-attempt areas, and role-preferred modules.',
  },
  {
    step: '03',
    title: 'Live adaptive interview',
    body: 'Questions span five difficulty levels. Each answer is evaluated and steers the next question.',
  },
  {
    step: '04',
    title: 'Structured report',
    body: 'Overall score, per-category and per-topic scores, strengths, gaps, and recommended next steps.',
  },
]

const faqs = [
  {
    q: 'How does the interviewer know what to ask?',
    a: 'Each candidate profile is matched against the 31-day curriculum. The topic pool prioritizes failed days, high-attempt modules, and topics aligned to the candidate’s role.',
  },
  {
    q: 'What happens if an answer is weak?',
    a: 'The engine drops a difficulty level and can ask a focused follow-up on the same topic before moving on — reinforcing weak areas instead of glossing over them.',
  },
  {
    q: 'How is the final score calculated?',
    a: 'Every answer is graded on five dimensions — correctness, depth, practicality, reasoning, and communication. A weighted aggregate produces the overall score.',
  },
  {
    q: 'Can I use it without an API key?',
    a: 'Yes. Demo mode runs the entire flow deterministically with simulated questions and evaluations, so you can try the experience end-to-end offline.',
  },
]

export default function Landing() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40" />

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300">
            <Sparkles size={14} />
            Adaptive AI technical interview
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Build the interviewer,
            <span className="bg-gradient-to-r from-primary-300 to-neon-400 bg-clip-text text-transparent">
              {' '}
              not the interview.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            InterviewAgent reads each candidate’s real cohort progress, picks the topics they need most,
            and runs a live, adaptive conversation that ends with an evidence-based evaluation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/candidates" className="btn-primary text-base">
              Start an interview <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-ghost text-base">
              How it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                <s.icon size={18} className="text-primary-300" />
                {s.value}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-14 flex justify-center">
          <a href="#how-it-works" className="flex flex-col items-center gap-1 text-muted transition-colors hover:text-white">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown size={18} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* --------------------------- HOW IT WORKS --------------------------- */}
      <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">
          Four steps from candidate profile to complete evaluation.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((j, i) => (
            <motion.div
              key={j.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface relative flex flex-col gap-4 p-6 transition-colors hover:border-line-600"
            >
              <span className="font-mono text-3xl font-bold text-primary-500/40">{j.step}</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{j.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------ FEATURES ------------------------------ */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Engineered for real interviews</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            The interviewer behaves less like a quiz bot and more like a senior engineer running a panel.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="card-surface flex flex-col gap-4 p-6 transition-colors hover:border-line-600"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/30">
                <f.icon size={20} className="text-primary-300" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------- DIFFICULTY LADDER ------------------------- */}
      <section id="difficulty" className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Five levels of difficulty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            The conversation climbs and descends this ladder based on each answer.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {difficultyLadder.map((d, i) => (
            <motion.div
              key={d.level}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-surface flex items-start gap-4 p-5 transition-colors hover:border-line-600"
            >
              <span className={`mt-1 font-mono text-sm font-bold ${d.tone}`}>{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{d.level}</h3>
                  {i === 0 ? (
                    <span className="chip !border-mint/40 !bg-mint/10 !text-mint">Start point</span>
                  ) : null}
                  {i === 4 ? (
                    <span className="chip !border-coral/40 !bg-coral/10 !text-coral">Senior bar</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------- REPORT ------------------------------- */}
      <section id="report" className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-3xl border border-primary-500/25 bg-gradient-to-b from-ink-800 to-ink-900 p-10 shadow-glow lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-medium text-mint">
              <RefreshCw size={13} /> No more vague feedback
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">A report you can act on</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              When the interview completes, every answer has already been scored. The final report turns the
              conversation into an honest, structured evaluation you can use immediately.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Overall score and difficulty progression',
                'Category scores across five dimensions',
                'Per-topic mastery breakdown',
                'Strengths and evidence-backed gaps',
                'Concrete next-step recommendations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mint" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/candidates" className="btn-primary mt-8">
              See it in action <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="card-surface p-6">
              <div className="flex items-center justify-between">
                <span className="label-sm !mb-0">Overall score</span>
                <span className="font-mono text-2xl font-bold text-mint">84</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-600">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-primary-500 to-neon-500" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Correctness', value: '9' },
                  { label: 'Depth', value: '8' },
                  { label: 'Practicality', value: '9' },
                  { label: 'Reasoning', value: '7' },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl border border-line-800 bg-ink-900 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted">{row.label}</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-white">{row.value}/10</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- FAQ --------------------------------- */}
      <section id="faq" className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Questions, answered</h2>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card-surface group p-5 transition-colors open:border-primary-500/30 hover:border-line-600"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
                {f.q}
                <ChevronDown size={16} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* -------------------------------- CTA -------------------------------- */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-primary-500/25 bg-gradient-to-b from-ink-800 to-ink-900 p-10 text-center shadow-glow">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/30 mx-auto">
            <Layers size={22} className="text-primary-300" />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-white">Pick a candidate and begin</h3>
          <p className="mt-3 text-sm text-muted">
            Each profile maps to real missions and skill signals, so the first question is already personal.
          </p>
          <Link to="/candidates" className="btn-primary mt-8">
            Choose a candidate <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
