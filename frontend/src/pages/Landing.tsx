import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
        Next-Gen AI Interviewer
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl text-center">
        Conduct technical interviews at scale with an intelligent agent that assesses skills, asks follow-up questions, and evaluates candidates in real-time.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/dashboard" 
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/30"
        >
          Go to Dashboard
        </Link>
        <Link 
          to="/interview" 
          className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          Start Mock Interview
        </Link>
      </div>
    </div>
  );
}
