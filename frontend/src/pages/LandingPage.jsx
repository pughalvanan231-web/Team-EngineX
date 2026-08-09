import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Layers, 
  Cpu, 
  BarChart2, 
  Target, 
  ShieldCheck, 
  Brain, 
  FileText, 
  GitBranch, 
  MessageSquare,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Curriculum-Aware Targeting',
    body: 'Automatically scans the candidate\'s historical logs. Prioritizes failed days, high-attempt topics, and role-preferred modules.',
  },
  {
    icon: GitBranch,
    title: '5-Level Adaptive Engine',
    body: 'Dynamically scales difficulty (±1 level per answer) between fundamentals, application, debugging, architecture, and engineering judgment.',
  },
  {
    icon: MessageSquare,
    title: 'Autonomous Probing',
    body: 'Identifies vague or partial answers and triggers deep-dive follow-up questions to test limits, capped at 2 depths to preserve time budget.',
  },
  {
    icon: ShieldCheck,
    title: 'Multidimensional Scoring',
    body: 'Measures candidates across 5 pillars: correctness, depth, practical understanding, engineering reasoning, and communication.',
  },
  {
    icon: FileText,
    title: 'Evidence-Based Reports',
    body: 'Generates structured report cards detailing performance, strengths, gaps, full transcripts, and recommended development actions.',
  },
  {
    icon: Brain,
    title: 'Durable State persistence',
    body: 'Session recovery handles browser refreshes effortlessly by storing the state in SQLite after each candidate exchange.',
  },
];

const difficultyLevels = [
  { level: '1. Fundamentals', desc: 'Core concepts, terminology, first principles, and structural basics.' },
  { level: '2. Application', desc: 'Translating concepts to code, small tool scripting, and API usage.' },
  { level: '3. Debugging', desc: 'Isolating errors, refactoring faulty designs, and edge-case handling.' },
  { level: '4. Architecture', desc: 'System design, microservices, scaling trade-offs, and integration patterns.' },
  { level: '5. Judgment', desc: 'Production trade-offs: cost, reliability, security, and hard team engineering decisions.' }
];

const stats = [
  { value: '31', label: 'Curriculum Days' },
  { value: '20', label: 'Sample Candidates' },
  { value: '5', label: 'Adaptive Tiers' },
  { value: '5', label: 'Scoring Dimensions' }
];

const faqs = [
  {
    q: 'How does the AI know what questions to ask?',
    a: 'The engine reads the candidate\'s completed curriculum missions. It prioritizes topics with high attempts or failed states, ensuring the interview specifically probes areas of concern.'
  },
  {
    q: 'Is an API key required to run this?',
    a: 'No. The system features a deterministic "Demo Mode" fallback that simulates realistic questions and evaluations, allowing you to trial the complete UX out-of-the-box.'
  },
  {
    q: 'What is the stopping condition for an interview?',
    a: 'An interview terminates automatically when the candidate has answered at least 8 questions AND covered at least 4 distinct curriculum days, with a hard cap at 12 questions.'
  }
];

function FAQItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/50 py-4 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-sm font-semibold text-[var(--text-headings)]">{q}</span>
        {isOpen ? <Minus className="w-4 h-4 text-slate-500" /> : <Plus className="w-4 h-4 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed animate-fadeIn">
          {a}
        </div>
      )}
    </div>
  );
}

export function LandingPage({ onStart }) {
  const navigate = useNavigate();

  const handleSelectCandidate = () => {
    navigate('/candidates');
  };

  return (
    <div className="w-full min-h-[88vh] bg-transparent text-slate-800 font-sans px-6 sm:px-12 py-8 flex flex-col space-y-20">
      
      {/* Hero Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Nestive Editorial Typography */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Social Proof Avatar Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium">
              Used to evaluate cohort progress in <strong className="text-slate-900">Engine.AI</strong>
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl font-light text-[var(--text-headings)] tracking-tight leading-[1.05]">
              Assess <span className="font-luxury-serif italic text-[var(--text-muted)]">Your Talent</span><br />
              The Smart Way
            </h1>
          </div>

          {/* Body Paragraph */}
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-lg leading-relaxed font-light">
            Curriculum-aware evaluation of your candidates — without lifting a finger. Your technical hiring is just four steps away from being autonomous!
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <div 
              onClick={handleSelectCandidate}
              className="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-900/5 border border-slate-200 backdrop-blur-md cursor-pointer hover:bg-slate-900/10 transition-all group"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: '#0f172a' }}
              >
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div 
                className="text-white hover:bg-slate-900 text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-full font-sans cursor-pointer"
                style={{ backgroundColor: '#090d16', color: '#ffffff' }}
              >
                SELECT CANDIDATE
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Luxury Hero Graphic Showcase */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full max-w-xl group">
            {/* Soft Shadow behind image */}
            <div className="absolute inset-0 bg-slate-950/20 rounded-[40px] blur-2xl transform scale-95 translate-y-6 pointer-events-none" />

            <img 
              src="/luxury_ai_house.png" 
              alt="Luxury AI Pavilion Architecture" 
              className="w-full h-auto object-cover rounded-[36px] drop-shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 relative z-10"
            />
          </div>
        </div>

      </div>

      {/* Core Stats Overview */}
      <div className="w-full max-w-7xl mx-auto py-6 border-y border-slate-250/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, index) => (
            <div key={index} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-headings)] tracking-tight">
                {s.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Core Capabilities */}
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-light text-[var(--text-headings)] tracking-tight">
            How Engine.AI Powers <span className="font-luxury-serif italic text-[var(--text-muted)]">Assessments</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            A specialized adaptive technical interviewer designed for modern software development curricula.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-sm font-bold text-[var(--text-headings)]">{f.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Ladder & FAQ Section */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Difficulty Ladder */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-[var(--text-headings)] tracking-tight">
              Adaptive <span className="font-luxury-serif italic text-[var(--text-muted)]">Difficulty Ladder</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Questions scale in real-time according to candidate performance.
            </p>
          </div>
          <div className="space-y-3">
            {difficultyLevels.map((dl, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-200/40">
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-[var(--text-headings)] uppercase tracking-wider">{dl.level}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">{dl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Frequently Asked Questions */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-[var(--text-headings)] tracking-tight">
              Common <span className="font-luxury-serif italic text-[var(--text-muted)]">Questions</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Find instant answers regarding execution, requirements, and limitations.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 4 Step Glass Cards */}
      <div className="w-full max-w-7xl mx-auto pt-6 text-left">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Step 01 */}
          <div 
            onClick={handleSelectCandidate}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Select Candidate
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">01</div>
            </div>
          </div>

          {/* Step 02 */}
          <div 
            onClick={() => navigate('/overview')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Analyze Syllabus
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">02</div>
            </div>
          </div>

          {/* Step 03 */}
          <div 
            onClick={handleSelectCandidate}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Adaptive Q&A
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">03</div>
            </div>
          </div>

          {/* Step 04 */}
          <div 
            onClick={() => navigate('/history')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer space-y-4 group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-headings)]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-headings)] group-hover:translate-x-0.5 transition-transform">
                Skill Analytics
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 font-bold">04</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}





