import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-50 border-b border-line-800/70 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/20 ring-1 ring-primary-500/40">
            <BrainCircuit className="h-4.5 w-4.5 text-primary-300" size={18} />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Interview<span className="text-primary-300">Agent</span>
          </span>
        </button>

        <nav className="flex items-center gap-1.5">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/candidates"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            Candidates
          </Link>
          <Link
            to="/candidates"
            className="btn-primary ml-2 !px-4 !py-2 text-sm"
          >
            Start Interview
          </Link>
        </nav>
      </div>
    </header>
  )
}
