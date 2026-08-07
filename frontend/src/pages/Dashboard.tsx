export default function Dashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Interviews</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Avg. Score</h3>
          <p className="text-3xl font-bold text-primary-600">85%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Upcoming</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Sessions</h2>
        </div>
        <div className="p-6 flex items-center justify-center text-slate-500 dark:text-slate-400 min-h-[200px]">
          No interview sessions found. Start a new one!
        </div>
      </div>
    </div>
  );
}
