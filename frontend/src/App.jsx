import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Candidates from './pages/Candidates.jsx'
import PreInterview from './pages/PreInterview.jsx'
import Interview from './pages/Interview.jsx'
import Feedback from './pages/Feedback.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-ink-950">
        <div className="pointer-events-none fixed inset-0 bg-grid-faint bg-size-grid opacity-40" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-radial-glow" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/pre-interview" element={<PreInterview />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
