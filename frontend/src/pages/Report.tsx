export default function Report() {
  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interview Report</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Completed on August 7, 2026</p>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 text-center">
        <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Overall Score</h2>
        <div className="text-6xl font-black text-primary-600">92/100</div>
        <p className="mt-4 text-green-600 dark:text-green-400 font-medium">Strong Hire Recommendation</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Strengths</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Excellent understanding of distributed systems.</li>
            <li>Clear and concise communication of complex topics.</li>
            <li>Strong problem-solving approach.</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Areas for Improvement</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Could dive deeper into database query optimization.</li>
            <li>Missed one edge case in the algorithmic challenge.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
